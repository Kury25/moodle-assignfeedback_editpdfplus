<?php

require_once('../../../../config.php');
require_once('lib.php');
require_once('locallib_admin.php');

global $PAGE, $OUTPUT, $USER;

$id = required_param('id', PARAM_INT);

$PAGE->set_url('/mod/assign/feedback/editpdfplus/view_admin.php?', ['id' => $id]);

// Prevent caching of this page to stop confusion when changing page after making AJAX changes
$PAGE->set_cacheable(false);

if ($id == SITEID) {
    $course = (object)['id' => SITEID];
    $context = context_system::instance();
}
else {
    $course = $DB->get_record('course', ['id' => $id], MUST_EXIST);
    $context = context_course::instance($course->id, MUST_EXIST);
}

$PAGE->set_context($context);

require_login();

$PAGE->set_title(get_string('admintitle', 'assignfeedback_editpdfplus'));

$PAGE->set_heading(get_string('admintitle', 'assignfeedback_editpdfplus'));
echo $OUTPUT->header();
//$PAGE->start_collecting_javascript_requirements();

require_capability('assignfeedback/editpdfplus:managetools', $context);

$editpdfplus = new assign_feedback_editpdfplus_admin($context, $course);
echo $editpdfplus->view();

echo $OUTPUT->footer();

