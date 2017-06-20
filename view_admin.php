<?php

require_once('../../../../config.php');
require_once('lib.php');
require_once('locallib_admin.php');

global $PAGE, $OUTPUT, $USER;

$id = optional_param('id', 0, PARAM_INT);
$switchrole = optional_param('switchrole', -1, PARAM_INT); // Deprecated, use course/switchrole.php instead.

$params = array();
if (!empty($id)) {
    $params = array('id' => $id);
} else {
    print_error('unspecifycourseid', 'error');
}

$course = $DB->get_record('course', $params, '*', MUST_EXIST);
$urlparams = array('id' => $course->id);

$PAGE->set_url('/mod/assign/feedback/editpdfplus/view_admin.php?', $urlparams); // Defined here to avoid notices on errors etc
// Prevent caching of this page to stop confusion when changing page after making AJAX changes
$PAGE->set_cacheable(false);

context_helper::preload_course($course->id);
$context = context_course::instance($course->id, MUST_EXIST);

// Remove any switched roles before checking login
if ($switchrole == 0 && confirm_sesskey()) {
    role_switch($switchrole, $context);
}

require_login($course, false);

// Switchrole - sanity check in cost-order...
$reset_user_allowed_editing = false;
if ($switchrole > 0 && confirm_sesskey() &&
        has_capability('moodle/role:switchroles', $context)) {
    // is this role assignable in this context?
    // inquiring minds want to know...
    $aroles = get_switchable_roles($context);
    if (is_array($aroles) && isset($aroles[$switchrole])) {
        role_switch($switchrole, $context);
        // Double check that this role is allowed here
        require_login($course);
    }
    // reset course page state - this prevents some weird problems ;-)
    $USER->activitycopy = false;
    $USER->activitycopycourse = NULL;
    unset($USER->activitycopyname);
    unset($SESSION->modform);
    $USER->editing = 0;
    $reset_user_allowed_editing = true;
}

//If course is hosted on an external server, redirect to corresponding
//url with appropriate authentication attached as parameter
if (file_exists($CFG->dirroot . '/course/externservercourse.php')) {
    include $CFG->dirroot . '/course/externservercourse.php';
    if (function_exists('extern_server_course')) {
        if ($extern_url == extern_server_course($course)) {
            redirect($extern_url);
        }
    }
}

require_once($CFG->dirroot . '/calendar/lib.php');    /// This is after login because it needs $USER
// Must set layout before gettting section info. See MDL-47555.
$PAGE->set_pagelayout('standard');

// Fix course format if it is no longer installed
$course->format = course_get_format($course)->get_format();

$PAGE->set_pagetype('course-view-' . $course->format);
$PAGE->set_other_editing_capability('moodle/course:update');

if ($reset_user_allowed_editing) {
    // ugly hack
    unset($PAGE->_user_allowed_editing);
}

$SESSION->fromdiscussion = $PAGE->url->out(false);

if ($course->id == SITEID) {
    // This course is not a real course.
    redirect($CFG->wwwroot . '/');
}

$PAGE->set_title(get_string('admintitle', 'assignfeedback_editpdfplus'));

$PAGE->set_heading($course->fullname);
echo $OUTPUT->header();
//$PAGE->start_collecting_javascript_requirements();

if (has_capability('mod/assignfeedback_editpdfplus:use', $context, null, false)) {
    $editpdfplus = new assign_feedback_editpdfplus_admin($context, $course);
    echo $editpdfplus->view();
}

echo $OUTPUT->footer();
