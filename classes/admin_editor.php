<?php

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * This file contains the editor class for the assignfeedback_editpdfplus plugin
 *
 * @package   assignfeedback_editpdfplus
 * @copyright  2017 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace assignfeedback_editpdfplus;

use assignfeedback_editpdfplus\axis;

/**
 * This class performs crud operations on comments and annotations from a page of a response.
 *
 * No capability checks are done - they should be done by the calling class.
 *
 * @package   assignfeedback_editpdfplus
 * @copyright 2017 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class admin_editor {

    /**
     * Add an axis
     * @global type $DB
     * @param String $axisLabel axis' name
     * @param Integer $context context's id
     * @return Integer id of the created axis
     */
    public static function add_axis($axisLabel, $context) {
        global $DB;

        $record = $DB->get_record_sql('SELECT max(order_axis) as order_max FROM {assignfeedback_editpp_axis} WHERE contextid = :contextid', array('contextid' => $context));

        $axis = new axis();
        $axis->contextid = $context;
        $axis->label = $axisLabel;
        if ($record->order_max == null) {
            $axis->order_axis = 1;
        } else {
            $axis->order_axis = $record->order_max + 1;
        }

        return $DB->insert_record('assignfeedback_editpp_axis', $axis);
    }

    /**
     * Add a tool
     * @global type $DB
     * @param object $data object with contains tool' info
     * @param Integer $contextid context's id
     * @return \assignfeedback_editpdfplus\tool created tool
     */
    public static function add_tool($data, $contextid) {
        global $DB;

        $maxindice = admin_editor::reorder_tool($data->toolaxis);

        $tool = new tool();
        $tool->axis = $data->toolaxis;
        $tool->cartridge = $data->libelle;
        $tool->cartridge_color = $data->catridgecolor;
        $tool->contextid = $contextid;
        $tool->label = $data->button;
        $tool->reply = 0;
        if ($data->reply == "on") {
            $tool->reply = 1;
        }
        $tool->texts = $data->texts;
        $tool->type = $data->typetool;
        $tool->colors = $data->color;
        $reorder = false;
        if ($maxindice == null) {
            $tool->order_tool = 1;
        } elseif ($data->order && intval($data->order) < 1000) {
            $tool->order_tool = $data->order;
            $reorder = true;
        } else {
            $tool->order_tool = $maxindice + 1;
        }

        $toolid = $DB->insert_record('assignfeedback_editpp_tool', $tool);

        if ($toolid > 0) {
            if ($reorder) {
                admin_editor::reorder_tool($data->axisid, $toolid);
            }
            return $tool;
        }
        return null;
    }

    public static function edit_tool_order($data) {
        global $DB;
        $record = $DB->get_record('assignfeedback_editpp_tool', array('id' => $data->toolid), '*', MUST_EXIST);
        $toolCurrent = new tool($record);
        $previousorder = -1;
        $toolPrevious = null;
        $toolNext = null;
        if ($data->previoustoolid) {
            $record = $DB->get_record('assignfeedback_editpp_tool', array('id' => $data->previoustoolid), '*', MUST_EXIST);
            $toolPrevious = new tool($record);
            $previousorder = $toolPrevious->order_tool + 1;
        } elseif ($data->nexttoolid) {
            $record = $DB->get_record('assignfeedback_editpp_tool', array('id' => $data->nexttoolid), '*', MUST_EXIST);
            $toolNext = new tool($record);
            $previousorder = $toolNext->order_tool - 1;
        }
        if ($previousorder > -1 && ($toolPrevious || $toolNext )) {
            if ($previousorder == 0) {
                $previousorder = 1;
            }
            $toolCurrent->order_tool = $previousorder;
            debugging($previousorder);
            if ($DB->update_record('assignfeedback_editpp_tool', $toolCurrent)) {
                admin_editor::reorder_tool($toolCurrent->axis, $data->toolid);
            }
        }
    }

    /**
     * Order tools of a toolbar
     * @global type $DB
     * @param Integer $axisid axis to reorder
     * @param Integer $toolid optional, can indicate a tool to place into a toolbar
     * @return last order rank
     */
    protected static function reorder_tool($axisid, $toolid = null) {
        global $DB;

        $tools = array();
        $records = $DB->get_records_sql('SELECT * FROM {assignfeedback_editpp_tool} WHERE axis = :axisid ORDER BY order_tool ASC', array('axisid' => $axisid));
        foreach ($records as $record) {
            array_push($tools, new tool($record));
        }
        $compteurPrecedent = null;
        $decalage = 1;
        $lastTool = null;
        foreach ($tools as $tool) {
            if ($compteurPrecedent == null) {
                $compteurPrecedent = $tool->order_tool;
                $lastTool = $tool;
            } else {
                $compteurCourant = $tool->order_tool;
                if ($compteurCourant != $compteurPrecedent + $decalage) {
                    if ($toolid && $tool->id == $toolid) {
                        $tool->order_tool = $lastTool->order_tool;
                        $lastTool->order_tool = $compteurPrecedent + 1;
                        $DB->update_record('assignfeedback_editpp_tool', $tool);
                        $DB->update_record('assignfeedback_editpp_tool', $lastTool);
                    } else {
                        $tool->order_tool = $compteurPrecedent + $decalage;
                        $DB->update_record('assignfeedback_editpp_tool', $tool);
                        $lastTool = $tool;
                    }
                    //$decalage++;
                } else {
                    $lastTool = $tool;
                }
                $compteurPrecedent++;
            }
        }
        return $compteurPrecedent;
    }

    /**
     * Edit an axis
     * @global type $DB
     * @param Integer $axeid axis' id
     * @param String $axisLabel new axis' label
     * @return Boolean true if the update is ok
     */
    public static function edit_axis($axeid, $axisLabel) {
        global $DB;

        $axis = $DB->get_record('assignfeedback_editpp_axis', array('id' => $axeid), '*', MUST_EXIST);
        $axis->label = $axisLabel;
        return $DB->update_record('assignfeedback_editpp_axis', $axis);
    }

    /**
     * Delete an axis
     * @global type $DB
     * @param Integer $axeid axis' id
     * @return Boolean true if the update is ok
     */
    public static function del_axis($axeid) {
        global $DB;
        return $DB->delete_records('assignfeedback_editpp_axis', array('id' => $axeid));
    }

    /**
     * Delete a tool
     * @global type $DB
     * @param \assignfeedback_editpdfplus\tool $tool
     * @return Boolean true if the remove is ok
     */
    public static function del_tool($tool) {
        global $DB;
        return $DB->delete_records('assignfeedback_editpp_tool', array('id' => $tool->toolid));
    }

    /**
     * Get all tools by an axis' id
     * @global type $DB
     * @param Integer $axisid axis' id
     * @return array<\assignfeedback_editpdfplus\tool> the toolbar, order by order_tool
     */
    public static function get_tools_by_axis($axisid) {
        global $DB;
        $tools = array();
        $records = $DB->get_records('assignfeedback_editpp_tool', array('axis' => $axisid));
        foreach ($records as $record) {
            array_push($tools, new tool($record));
        }
        usort($tools, function($a, $b) {
            $al = $a->order_tool;
            $bl = $b->order_tool;
            if ($al == $bl) {
                return 0;
            }
            return ($al > $bl) ? +1 : -1;
        });
        return $tools;
    }

    /**
     * Get all diferent contexts id
     * @global type $DB
     * @param Integer $axisid axis' id
     * @return array<\assignfeedback_editpdfplus\tool> the toolbar, order by order_tool
     */
    public static function get_all_different_contexts() {
        global $DB;
        $records = $DB->get_records_sql("SELECT DISTINCT(contextid) FROM `mdl_assignfeedback_editpp_axis`");
        return $records;
    }

    /**
     * Update a tool
     * @global type $DB
     * @param object $toolJson object contains tool's values to update
     * @return \assignfeedback_editpdfplus\tool
     */
    public static function edit_tool($toolJson) {
        global $DB;

        $record = $DB->get_record('assignfeedback_editpp_tool', array('id' => $toolJson->toolid), '*', MUST_EXIST);
        $tool = new tool($record);
        $tool->axis = $toolJson->toolaxis;
        $tool->type = $toolJson->typetool;
        $tool->colors = $toolJson->color;
        $tool->cartridge = $toolJson->libelle;
        $tool->cartridge_color = $toolJson->catridgecolor;
        $tool->texts = $toolJson->texts;
        $tool->label = $toolJson->button;
        $tool->enabled = $toolJson->enabled;
        if ($toolJson->reply == "on") {
            $tool->reply = 1;
        } else {
            $tool->reply = 0;
        }
        $reorder = false;
        if ($tool->order_tool != $toolJson->order) {
            $tool->order_tool = $toolJson->order;
            $reorder = true;
        }
        if ($DB->update_record('assignfeedback_editpp_tool', $tool)) {
            if ($reorder) {
                admin_editor::reorder_tool($tool->axis, $tool->id);
            }
            return $tool;
        }
        return null;
    }

    /**
     * Get all the type tools which are configurabled.
     * @return array<\assignfeedback_editpdfplus\type_tool> array of type tools
     */
    public static function get_typetools() {
        global $DB;
        $typetools = array();
        $records = $DB->get_records('assignfeedback_editpp_typet', array('configurable' => 1));
        foreach ($records as $record) {
            $newTypeTool = page_editor::custom_type_tool(new type_tool($record));
            if ($newTypeTool->configurable > 0) {
                array_push($typetools, $newTypeTool);
            }
        }
        return $typetools;
    }

    /**
     * Get axis by its id
     * @global type $DB
     * @param Integer $axeid axis' id
     * @return \assignfeedback_editpdfplus\axis the axis
     */
    public static function getAxisById($axeid) {
        global $DB;
        $axis = $DB->get_record('assignfeedback_editpp_axis', array('id' => $axeid), '*', MUST_EXIST);
        return $axis;
    }

    /**
     * Clone an axis to the context given in parameter
     * @global type $DB
     * @param \assignfeedback_editpdfplus\axis $axisOrigin
     * @param Integer $context context's id
     * @return Integer id of the imported axis
     */
    public static function import_axis($axisOrigin, $context) {
        global $DB;
        $record = $DB->get_record_sql('SELECT max(order_axis) as order_max FROM {assignfeedback_editpp_axis} WHERE contextid = :contextid', array('contextid' => $context));

        $axis = new axis();
        $axis->contextid = $context;
        $axis->label = $axisOrigin->label;
        if ($record->order_max == null) {
            $axis->order_axis = 1;
        } else {
            $axis->order_axis = $record->order_max + 1;
        }

        return $DB->insert_record('assignfeedback_editpp_axis', $axis);
    }

    /**
     * Clone a tool to a new axis
     * @global type $DB
     * @param \assignfeedback_editpdfplus\tool $toolToImport tool to duplicate
     * @param \assignfeedback_editpdfplus\axis $axeNew axis to attached new tool
     * @param Integer $context context's id
     * @return Integer id of tool's created
     */
    public static function import_tool($toolToImport, $axeNew, $context) {
        global $DB;
        $record = $DB->get_record_sql('SELECT max(order_tool) as order_max FROM {assignfeedback_editpp_tool} WHERE contextid = :contextid', array('axis' => $axeNew->id, 'contextid' => $context));

        $tool = new tool();
        $tool->axis = $axeNew;
        $tool->cartridge = $toolToImport->cartridge;
        $tool->cartridge_color = $toolToImport->cartridge_color;
        $tool->colors = $toolToImport->colors;
        $tool->contextid = $context;
        $tool->enabled = $toolToImport->enabled;
        $tool->label = $toolToImport->label;
        $tool->reply = $toolToImport->reply;
        $tool->texts = $toolToImport->texts;
        $tool->type = $toolToImport->type;
        if ($record->order_max == null) {
            $tool->order_tool = 1;
        } else {
            $tool->order_tool = $record->order_max + 1;
        }
        return $DB->insert_record('assignfeedback_editpp_tool', $tool);
    }

}
