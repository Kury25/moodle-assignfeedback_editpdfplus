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
 * @copyright  2016 Université de Lausanne
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
     * 
     * @global type $DB
     * @param type $axisLabel
     * @param type $context
     * @return type
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
     * 
     * @global type $DB
     * @param type $axisLabel
     * @param type $context
     * @return type
     */
    public static function edit_axis($axeid, $axisLabel) {
        global $DB;

        $axis = $DB->get_record('assignfeedback_editpp_axis', array('id' => $axeid), '*', MUST_EXIST);
        $axis->label = $axisLabel;
        return $DB->update_record('assignfeedback_editpp_axis', $axis);
    }

}
