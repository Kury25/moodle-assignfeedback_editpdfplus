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
 * Process ajax requests
 *
 * @package assignfeedback_editpdfplus
 * @copyright  2016 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
use \assignfeedback_editpdfplus\document_services;
use \assignfeedback_editpdfplus\combined_document;
use \assignfeedback_editpdfplus\page_editor;

define('AJAX_SCRIPT', true);

require('../../../../config.php');
require_once($CFG->dirroot . '/mod/assign/locallib.php');

require_sesskey();

$action = optional_param('action', '', PARAM_ALPHANUM);
$assignmentid = required_param('assignmentid', PARAM_INT);
$userid = required_param('userid', PARAM_INT);
$attemptnumber = required_param('attemptnumber', PARAM_INT);
$readonly = optional_param('readonly', false, PARAM_BOOL);

$cm = \get_coursemodule_from_instance('assign', $assignmentid, 0, false, MUST_EXIST);
$context = \context_module::instance($cm->id);

$assignment = new \assign($context, null, null);

require_login($assignment->get_course(), false, $cm);

if (!$assignment->can_view_submission($userid)) {
    print_error('nopermission');
}

if ($action === 'pollconversions') {
    $draft = true;
    if (!has_capability('mod/assign:grade', $context)) {
        $draft = false;
        $readonly = true; // A student always sees the readonly version.
        require_capability('mod/assign:submit', $context);
    }

    if ($readonly) {
        // Whoever is viewing the readonly version should not use the drafts, but the actual annotations.
        $draft = false;
    }

    $response = (object) [
                'status' => -1,
                'filecount' => 0,
                'pagecount' => 0,
                'pageready' => 0,
                'pages' => [],
    ];

    //$pages = document_services::get_page_images_for_attempt($assignment, $userid, $attemptnumber, $readonly);
    //$response = new stdClass();
    //$response->pagecount = count($pages);
    //$response->pages = array();

    $combineddocument = document_services::get_combined_document_for_attempt($assignment, $userid, $attemptnumber);
    $response->status = $combineddocument->get_status();
    $response->filecount = $combineddocument->get_document_count();

    if ($response->status === combined_document::STATUS_READY) {
        $combineddocument = document_services::get_combined_pdf_for_attempt($assignment, $userid, $attemptnumber);
        $response->pagecount = $combineddocument->get_page_count();
    } else if ($response->status === combined_document::STATUS_COMPLETE || $response->status === combined_document::STATUS_FAILED) {
        $pages = document_services::get_page_images_for_attempt($assignment, $userid, $attemptnumber, $readonly);

        $response->pagecount = $combineddocument->get_page_count();

        //$grade = $assignment->get_user_grade($userid, true);
        $grade = $assignment->get_user_grade($userid, true, $attemptnumber);

        // The readonly files are stored in a different file area.
        $filearea = document_services::PAGE_IMAGE_FILEAREA;
        if ($readonly) {
            $filearea = document_services::PAGE_IMAGE_READONLY_FILEAREA;
        }

        foreach ($pages as $id => $pagefile) {
            $index = count($response->pages);
            $page = new stdClass();
            //$comments = page_editor::get_comments($grade->id, $index, $draft);
            $page->url = moodle_url::make_pluginfile_url($context->id, 'assignfeedback_editpdfplus', $filearea, $grade->id, '/', $pagefile->get_filename())->out();
            //$page->comments = $comments;
            if ($imageinfo = $pagefile->get_imageinfo()) {
                $page->width = $imageinfo['width'];
                $page->height = $imageinfo['height'];
            } else {
                $page->width = 0;
                $page->height = 0;
            }
            $annotations = page_editor::get_annotations($grade->id, $index, $draft);
            $page->annotations = $annotations;
            //array_push($response->pages, $page);
            $response->pages[] = $page;

            $component = 'assignfeedback_editpdfplus';
            $filearea = document_services::PAGE_IMAGE_FILEAREA;
            $filepath = '/';
            $fs = get_file_storage();
            $files = $fs->get_directory_files($context->id, $component, $filearea, $grade->id, $filepath);
            $response->pageready = count($files);

            $tools = page_editor::get_tools(null);
            $typetools = page_editor::get_typetools(null);
            $axis = page_editor::get_axis(null);
            $response->tools = $tools;
            $response->typetools = $typetools;
            $response->axis = $axis;
        }
    }

    echo json_encode($response);
    die();
} else if ($action == 'savepage') {
    require_capability('mod/assign:grade', $context);

    $response = new stdClass();
    $response->errors = array();

    $grade = $assignment->get_user_grade($userid, true);

    $pagejson = required_param('page', PARAM_RAW);
    $page = json_decode($pagejson);
    $index = required_param('index', PARAM_INT);

    /* $added = page_editor::set_comments($grade->id, $index, $page->comments);
      if ($added != count($page->comments)) {
      array_push($response->errors, get_string('couldnotsavepage', 'assignfeedback_editpdfplus', $index + 1));
      } */
    $added = page_editor::set_annotations($grade->id, $index, $page->annotations);
    if ($added != count($page->annotations)) {
        array_push($response->errors, get_string('couldnotsavepage', 'assignfeedback_editpdfplus', $index + 1));
    }
    echo json_encode($response);
    die();
} else if ($action == 'generatepdf') {

    $refresh = optional_param('refresh', false, PARAM_BOOL);

    if (!$refresh) {
        require_capability('mod/assign:grade', $context);
    } else {
        require_capability('mod/assign:submit', $context);
    }
    $response = new stdClass();
    $grade = $assignment->get_user_grade($userid, true, $attemptnumber);
    $file = document_services::generate_feedback_document($assignment, $userid, $attemptnumber, $refresh);

    $response->url = '';
    if ($file) {
        $url = moodle_url::make_pluginfile_url($assignment->get_context()->id, 'assignfeedback_editpdfplus', document_services::FINAL_PDF_FILEAREA, $grade->id, '/', $file->get_filename(), false);
        $response->url = $url->out(true);
        $response->filename = $file->get_filename();
    }

    if ($refresh) {
        $teachers = get_users_by_capability($context, 'mod/assignfeedback_editpdf:notify');
        $contextb = $assignment->get_context();
        $course = $assignment->get_course();
        $coursemodule = $assignment->get_course_module();
        $modulename = get_string('modulename', 'assign');
        $assignmentname = $assignment->get_instance()->name;
        $formatparams = array('context' => $contextb->get_course_context());
        $body = format_string($course->shortname, true, $formatparams)
                . ' -> '
                . $modulename
                . ' -> '
                . format_string($assignmentname, true, $formatparams) . "\n"
                . "\n---------------------------------------------------------------------\n"
                . "La correction du devoir a été mise à jour. Vous pouvez accéder au document en suivant ce lien : "
                . $response->url
                . "\n\nCeci est un mail automatique.";
        $bodyhtml = '<p><font face="sans-serif">'
                . '<a href="' . $CFG->wwwroot . '/course/view.php?id=' . $course->id . '">'
                . format_string($course->shortname, true, $formatparams)
                . '</a> ->'
                . '<a href="' . $CFG->wwwroot . '/mod/assign/index.php?id=' . $course->id . '">'
                . $modulename
                . '</a> ->'
                . '<a href="' . $CFG->wwwroot . '/mod/assign/view.php?id=' . $coursemodule->id . '">'
                . format_string($assignmentname, true, $formatparams)
                . '</a></font></p>'
                . '<hr /><font face="sans-serif">'
                . "<b>Information Moodle</b><br/>"
                . "<p>La correction du devoir a été mise à jour. Vous pouvez accéder au document en suivant ce <a href='"
                . $response->url
                . "'>lien</a></p>"
                . "<i>Ceci est un mail automatique.</i>";
        foreach ($teachers as $teacher) {
            $res = email_to_user($teacher, $USER, "[Moodle] Mise à jour devoir", $body, $bodyhtml);
        }
    }

    echo json_encode($response);
    die();
} /* else if ($action == 'loadquicklist') {
  require_capability('mod/assign:grade', $context);

  $result = comments_quick_list::get_comments();

  echo json_encode($result);
  die();
  } *//* else if ($action == 'addtoquicklist') {
  require_capability('mod/assign:grade', $context);

  $comment = required_param('commenttext', PARAM_RAW);
  $width = required_param('width', PARAM_INT);
  $colour = required_param('colour', PARAM_ALPHA);

  $result = comments_quick_list::add_comment($comment, $width, $colour);

  echo json_encode($result);
  die();
  } */ else if ($action == 'revertchanges') {
    require_capability('mod/assign:grade', $context);

    $grade = $assignment->get_user_grade($userid, true, $attemptnumber);

    $result = page_editor::revert_drafts($gradeid);

    echo json_encode($result);
    die();
}/* else if ($action == 'removefromquicklist') {
  require_capability('mod/assign:grade', $context);

  $commentid = required_param('commentid', PARAM_INT);

  $result = comments_quick_list::remove_comment($commentid);

  echo json_encode($result);
  die();
  } */ else if ($action == 'deletefeedbackdocument') {
    require_capability('mod/assign:grade', $context);

    $grade = $assignment->get_user_grade($userid, true);
    $result = document_services::delete_feedback_document($assignment, $userid, $attemptnumber);

    $result = $result && page_editor::unrelease_drafts($grade->id);
    echo json_encode($result);
    die();
} else if ($action == 'updatestudentview') {
    require_capability('mod/assign:submit', $context);

    $response = new stdClass();
    $response->errors = array();

    $grade = $assignment->get_user_grade($userid, true);

    $pagejson = required_param('page', PARAM_RAW);
    $page = json_decode($pagejson);
    $index = required_param('index', PARAM_INT);

    $added = page_editor::update_annotations_status($page->annotations);
    if ($added != count($page->annotations)) {
        array_push($response->errors, get_string('couldnotsavepage', 'assignfeedback_editpdfplus', $index + 1));
    }
    echo json_encode($response);
    die();
}

