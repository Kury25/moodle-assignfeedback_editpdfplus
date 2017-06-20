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
 * External assign API
 *
 * @package    assignfeedback_editpdfplus
 * @copyright  2017 Université de Lausanne
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die;

require_once("$CFG->libdir/externallib.php");
require_once("$CFG->dirroot/user/externallib.php");
require_once("$CFG->dirroot/mod/assign/locallib.php");
require_once("locallib.php");
require_once("locallib_admin.php");

use \assignfeedback_editpdfplus\form\axis_form;
use \assignfeedback_editpdfplus\admin_editor;

class assignfeedback_editpdfplus_external extends external_api {

    /**
     * Returns description of method parameters
     * @return external_function_parameters
     */
    public static function submit_axis_form_parameters() {
        return new external_function_parameters(
                array(
            'jsonformdata' => new external_value(PARAM_RAW, 'The data from the grading form, encoded as a json array')
                )
        );
    }

    public static function submit_axis_form($jsonformdata) {
        global $USER, $PAGE, $DB;

        $params = self::validate_parameters(self::submit_axis_form_parameters(), array(
                    'jsonformdata' => $jsonformdata
        ));

        $serialiseddata = json_decode($params['jsonformdata']);

        $data = array();
        parse_str($serialiseddata, $data);

        $warnings = array();

        if (WS_SERVER) {
            // Assume form submission if coming from WS.
            $USER->ignoresesskey = true;
            //$data['_qf__mod_assign_grade_form_' . $params['userid']] = 1;
        }

        $course = $DB->get_record('course', array('id' => $data['courseid']), '*', MUST_EXIST);
        $context = context_course::instance($course->id, MUST_EXIST);
        $PAGE->set_context($context);

        $customdata = (object) $data;
        $formparams = array($customdata);

        // Data is injected into the form by the last param for the constructor.
        $mform = new axis_form(null, $formparams, 'post', '', null, true, $data);
        $validateddata = $mform->get_data();

        if ($validateddata) {
            if ($validateddata->axeid) {
                admin_editor::edit_axis($validateddata->axeid, $validateddata->label);
                /* $axisTot = admin_editor::get_axis($context->id);
                  $res = array();
                  $res[]=array('axeid' => $validateddata->axeid, 'axelabel' => $validateddata->label);
                  foreach ($axisTot as $axetmp) {
                  $res[]=array('axeid' => $axetmp->id, 'axelabel' => $axetmp->label);
                  }
                  return $res; */
                $axeid = $validateddata->axeid;
                return array(array('axeid' => $axeid, 'axelabel' => $validateddata->label));
            } else {
                $axeid = admin_editor::add_axis($validateddata->label, $context->id);
                //return array(array('itemid' => $axeid),array('item' => $validateddata->label));
                //return array('axe' => array('axeid' => $axeid, 'axelabel' => $validateddata->label));
                return array(array('axeid' => $axeid, 'axelabel' => $validateddata->label));
            }
        } else {
            $warnings[] = array('message' => 'erreur à l enregistrement');
        }


        return $warnings;
    }

    /* public static function submit_axis_form_returns() {
      return new external_warnings();
      } */

    public static function submit_axis_form_returns() {
        return new external_multiple_structure(
                new external_single_structure(
                array(
            'axeid' => new external_value(PARAM_INT, 'axis id'),
            'axelabel' => new external_value(PARAM_TEXT, 'axis label'),
            'message' => new external_value(PARAM_TEXT, 'message', VALUE_OPTIONAL)
                )
                )
        );
    }

}
