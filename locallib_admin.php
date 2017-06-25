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
 * Description of locallib_admin
 *
 * @package   assignfeedback_editpdfplus
 * @copyright  2017 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

use \assignfeedback_editpdfplus\page_editor;
use \assignfeedback_editpdfplus\widget_admin;
use \assignfeedback_editpdfplus\form\axis_form;
use \assignfeedback_editpdfplus\form\axis_del_form;
use \assignfeedback_editpdfplus\form\tool_form;
use \assignfeedback_editpdfplus\admin_editor;

class assign_feedback_editpdfplus_admin {

    private $course = null;
    private $context = null;

    function __construct(stdClass $context, stdClass $course) {
        $this->context = $context;
        $this->course = $course;
    }

    /**
     * todo.
     *
     * @return string
     */
    public function view() {
        global $PAGE;

        //$PAGE->requires->js_call_amd('assignfeedback_editpdfplus/admin_panel', 'init');

        $html = '';
        //$toform = null;
        $renderer = $PAGE->get_renderer('assignfeedback_editpdfplus');
        /* $formAddAxis = new axis_form(new moodle_url('/mod/assign/feedback/editpdfplus/view_admin.php?id=' . $this->course->id, array('id' => $this->course->id))); //Form processing and displaying is done here
          if ($formAddAxis->is_cancelled()) {
          //Handle form cancel operation, if cancel button is present on form
          } else if ($fromform = $formAddAxis->get_data()) {
          //In this case you process validated data. $mform->get_data() returns data posted in form.
          $label = $fromform->label;
          $axe = $this->addAxis($label);
          $formAddAxis->set_data($toform);
          return $axe; //"<option>tutu</option>";
          } else {
          // this branch is executed if the form is submitted but the data doesn't validate and the form should be redisplayed
          // or on the first display of the form.
          //Set default data (if any)
          $formAddAxis->set_data($toform);
          } */
        $widget = $this->get_widget();
        //$widget->axisaddform = $formAddAxis;
        $html .= $renderer->render_assignfeedback_editpdfplus_widget_admin($widget);
        return $html;
    }

    public function getAxisForm($axeid = null) {
        global $PAGE, $DB;

        $html = '';
        $toform = null;
        $formAxis = null;
        $axis = null;
        if ($axeid != null) {
            $axis = $DB->get_record('assignfeedback_editpp_axis', array('id' => $axeid), '*', MUST_EXIST);
        }
        if ($axis != null) {
            $formAxis = new axis_form(null, array('id' => $this->course->id), null, null, array('id' => "assignfeedback_editpdfplus_edit_axis")); //Form processing and displaying is done here
            $formAxis->set_data(array('axeid' => $axeid, 'label' => $axis->label));
            $formAxis->id = "assignfeedback_editpdfplus_edit_axis";
            $formAxis->title = "Renommer l'axe";
            $formAxis->action = "edit";
        } else {
            $formAxis = new axis_form(null, array('id' => $this->course->id), null, null, array('id' => "assignfeedback_editpdfplus_add_axis")); //Form processing and displaying is done here
            $formAxis->set_data($toform);
            $formAxis->id = "assignfeedback_editpdfplus_add_axis";
            $formAxis->title = "Ajouter un nouvel axe";
            $formAxis->action = "add";
        }
        $renderer = $PAGE->get_renderer('assignfeedback_editpdfplus');
        $formAxis->courseid = $this->course->id;
        $html .= $renderer->render_assignfeedback_editpdfplus_widget_admin_axisform($formAxis);
        return $html;
    }

    public function getAxisDelForm($axeid) {
        global $PAGE, $DB;

        $html = '';
        $formAxis = null;
        $axis = null;
        if ($axeid != null) {
            $axis = $DB->get_record('assignfeedback_editpp_axis', array('id' => $axeid), '*', MUST_EXIST);
        }
        if ($axis != null) {
            $formAxis = new axis_del_form(null, array('id' => $this->course->id), null, null, array('id' => "assignfeedback_editpdfplus_del_axis")); //Form processing and displaying is done here
            $formAxis->set_data(array('axeid' => $axeid, 'label' => $axis->label));
        }
        $formAxis->id = "assignfeedback_editpdfplus_del_axis";
        $formAxis->title = "Supprimer l'axe";
        $formAxis->action = "del";
        $renderer = $PAGE->get_renderer('assignfeedback_editpdfplus');
        $formAxis->courseid = $this->course->id;
        $html .= $renderer->render_assignfeedback_editpdfplus_widget_admin_axisdelform($formAxis);
        return $html;
    }

    public function getToolForm($toolid = null) {
        global $PAGE, $DB;

        $html = '';
        $data = new stdClass;
        $data->courseid = $this->course->id;
        $data->sesskey = sesskey();
        $data->actionurl = "http://localhost/moodle33/moodle/lib/ajax/service.php";
        $data->formid = "assignfeedback_editpdfplus_edit_tool";
        if ($toolid != null) {
            $data->tool = $DB->get_record('assignfeedback_editpp_tool', array('id' => $toolid), '*', MUST_EXIST);
        }
        $data->tools = page_editor::get_typetools(null);
        $renderer = $PAGE->get_renderer('assignfeedback_editpdfplus');
        //$formTool->courseid = $this->course->id;
        $html .= $renderer->render_assignfeedback_editpdfplus_widget_admin_toolform($data);
        return $html;
    }

    private function get_widget() {
        global $USER;

        // get the costum toolbars
        $toolbars = array();
        $coursecontext = context::instance_by_id($this->context->id);
        $coursecontexts = array_filter(explode('/', $coursecontext->path), 'strlen');
        $tools = page_editor::get_tools($coursecontexts);
        $axis = page_editor::get_axis(array($this->context->id));
        foreach ($axis as $ax) {
            $ax->children = 0;
            $toolbar = new stdClass();
            $toolbar->axis = $ax;
            $toolbar->tools = array();
            //$toolbars[$ax->id]['label'] = $ax->label;
            foreach ($tools as $tool) {
                if ($tool->axis == $ax->id) {
                    if ($tool->enabled == "1") {
                        $tool->button = "btn-default";
                    } else {
                        $tool->button = "";
                    }
                    if ($tool->type == "4") {
                        $tool->label = '| ' . $tool->label . ' |';
                    } elseif ($tool->type == "5") {
                        $tool->label = '| ' . $tool->label;
                    }
                    if ($tool->type == "4" || $tool->type == "1") {
                        $tool->style = "text-decoration: underline;";
                    }
                    $toolbar->tools[] = $tool;
                    $ax->children++;
                }
            }
            $toolbars[] = $toolbar;
        }
        $widget = new widget_admin($this->context, $this->course, $USER, $toolbars, $axis);
        return $widget;
    }

}
