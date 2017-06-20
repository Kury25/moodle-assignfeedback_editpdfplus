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
 * Web service for assignfeedback_editpdfplus
 * @package    assignfeedback_editpdfplus
 * @subpackage db
 * @copyright  2017 Université de Lausanne
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
$functions = array(
    'assignfeedback_editpdfplus_submit_axis_form' => array(
        'classname' => 'assignfeedback_editpdfplus_external',
        'methodname' => 'submit_axis_form',
        'classpath' => 'mod/assign/feedback/editpdfplus/externallib.php',
        'description' => 'Test add axis',
        'type' => 'write',
        'ajax' => true,
        'requiredcapability' => 'mod/assignfeedback_editpdfplus:use',
        'enabled'=>1,
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE)
    ),
    'assignfeedback_editpdfplus_submit_axis_edit_form' => array(
        'classname' => 'assignfeedback_editpdfplus_external',
        'methodname' => 'submit_axis_edit_form',
        'classpath' => 'mod/assign/feedback/editpdfplus/externallib.php',
        'description' => 'Edit an axis',
        'type' => 'write',
        'ajax' => true,
        'requiredcapability' => 'mod/assignfeedback_editpdfplus:use',
        'enabled'=>1,
        'services' => array(MOODLE_OFFICIAL_MOBILE_SERVICE)
    )
);