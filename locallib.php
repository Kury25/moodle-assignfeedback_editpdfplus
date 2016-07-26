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
 * This file contains the definition for the library class for PDF feedback plugin
 *
 *
 * @package   assignfeedback_editpdfplus
 * @copyright 2012 Davo Smith
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

use \assignfeedback_editpdfplus\document_services;
use \assignfeedback_editpdfplus\page_editor;

/**
 * library class for editpdf feedback plugin extending feedback plugin base class
 *
 * @package   assignfeedback_editpdfplus
 * @copyright 2012 Davo Smith
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class assign_feedback_editpdfplus extends assign_feedback_plugin {

    /** @var boolean|null $enabledcache Cached lookup of the is_enabled function */
    private $enabledcache = null;

    /**
     * Get the name of the file feedback plugin
     * @return string
     */
    public function get_name() {
        return get_string('pluginname', 'assignfeedback_editpdfplus');
    }

    /**
     * Create a widget for rendering the editor.
     *
     * @param int $userid
     * @param stdClass $grade
     * @param bool $readonly
     * @return assignfeedback_editpdfplus_widget
     */
    public function get_widget($userid, $grade, $readonly) {
        $attempt = -1;
        if ($grade && $grade->attemptnumber) {
            $attempt = $grade->attemptnumber;
        } else {
            $grade = $this->assignment->get_user_grade($userid, true);
        }

        $feedbackfile = document_services::get_feedback_document($this->assignment->get_instance()->id, $userid, $attempt);

        $stampfiles = array();
        $fs = get_file_storage();
        $syscontext = context_system::instance();

        // get the costum toolbars
        $toolbars = array();
        $coursecontext = context::instance_by_id($this->assignment->get_context()->id);
        $coursecontexts = array_filter(explode('/', $coursecontext->path), 'strlen');
        $tools = page_editor::get_tools($coursecontexts);
        foreach ($tools as $tool) {
            if ($tool->axis > 0) {
                $toolbars[$tool->axis - 1][] = $tool;
            }
        }
        //debugging(sizeof($toolbars[0]) . ' ' . sizeof($toolbars[1]) . ' ' . sizeof($toolbars[2]));
        // Copy any new stamps to this instance.
        if ($files = $fs->get_area_files($syscontext->id, 'assignfeedback_editpdfplus', 'stamps', 0, "filename", false)) {
            foreach ($files as $file) {
                $filename = $file->get_filename();
                if ($filename !== '.') {

                    $existingfile = $fs->get_file($this->assignment->get_context()->id, 'assignfeedback_editpdfplus', 'stamps', $grade->id, '/', $file->get_filename());
                    if (!$existingfile) {
                        $newrecord = new stdClass();
                        $newrecord->contextid = $this->assignment->get_context()->id;
                        $newrecord->itemid = $grade->id;
                        $fs->create_file_from_storedfile($newrecord, $file);
                    }
                }
            }
        }

        // Now get the full list of stamp files for this instance.
        if ($files = $fs->get_area_files($this->assignment->get_context()->id, 'assignfeedback_editpdfplus', 'stamps', $grade->id, "filename", false)) {
            foreach ($files as $file) {
                $filename = $file->get_filename();
                if ($filename !== '.') {
                    $url = moodle_url::make_pluginfile_url($this->assignment->get_context()->id, 'assignfeedback_editpdfplus', 'stamps', $grade->id, '/', $file->get_filename(), false);
                    array_push($stampfiles, $url->out());
                }
            }
        }

        $url = false;
        $filename = '';
        if ($feedbackfile) {
            $url = moodle_url::make_pluginfile_url($this->assignment->get_context()->id, 'assignfeedback_editpdfplus', document_services::FINAL_PDF_FILEAREA, $grade->id, '/', $feedbackfile->get_filename(), false);
            $filename = $feedbackfile->get_filename();
        }

        // Retrieve total number of pages.
        $pagetotal = document_services::page_number_for_attempt($this->assignment->get_instance()->id, $userid, $attempt, $readonly);

        $widget = new assignfeedback_editpdfplus_widget($this->assignment->get_instance()->id, $userid, $attempt, $url, $filename, $stampfiles, $readonly, $pagetotal, $toolbars);
        return $widget;
    }

    /**
     * Get form elements for grading form
     *
     * @param stdClass $grade
     * @param MoodleQuickForm $mform
     * @param stdClass $data
     * @param int $userid
     * @return bool true if elements were added to the form
     */
    public function get_form_elements_for_user($grade, MoodleQuickForm $mform, stdClass $data, $userid) {
        global $PAGE;

        $attempt = -1;
        if ($grade) {
            $attempt = $grade->attemptnumber;
        }

        $renderer = $PAGE->get_renderer('assignfeedback_editpdfplus');

        $widget = $this->get_widget($userid, $grade, false);

        $html = $renderer->render($widget);
        $mform->addElement('static', 'editpdf', get_string('editpdf', 'assignfeedback_editpdfplus'), $html);
        $mform->addHelpButton('editpdf', 'editpdf', 'assignfeedback_editpdfplus');
        $mform->addElement('hidden', 'editpdf_source_userid', $userid);
        $mform->setType('editpdf_source_userid', PARAM_INT);
        $mform->setConstant('editpdf_source_userid', $userid);
    }

    /**
     * Check to see if the grade feedback for the pdf has been modified.
     *
     * @param stdClass $grade Grade object.
     * @param stdClass $data Data from the form submission (not used).
     * @return boolean True if the pdf has been modified, else false.
     */
    public function is_feedback_modified(stdClass $grade, stdClass $data) {
        // We only need to know if the source user's PDF has changed. If so then all
        // following users will have the same status. If it's only an individual annotation
        // then only one user will come through this method.
        // Source user id is only added to the form if there was a pdf.
        if (!empty($data->editpdf_source_userid)) {
            $sourceuserid = $data->editpdf_source_userid;
            // Retrieve the grade information for the source user.
            $sourcegrade = $this->assignment->get_user_grade($sourceuserid, true, $grade->attemptnumber);
            $pagenumbercount = document_services::page_number_for_attempt($this->assignment, $sourceuserid, $sourcegrade->attemptnumber);
            for ($i = 0; $i < $pagenumbercount; $i++) {
                // Select all annotations.
                $draftannotations = page_editor::get_annotations($sourcegrade->id, $i, true);
                $nondraftannotations = page_editor::get_annotations($grade->id, $i, false);
                // Check to see if the count is the same.
                if (count($draftannotations) != count($nondraftannotations)) {
                    // The count is different so we have a modification.
                    return true;
                } else {
                    $matches = 0;
                    // Have a closer look and see if the draft files match all the non draft files.
                    foreach ($nondraftannotations as $ndannotation) {
                        foreach ($draftannotations as $dannotation) {
                            foreach ($ndannotation as $key => $value) {
                                if ($key != 'id' && $value != $dannotation->{$key}) {
                                    continue 2;
                                }
                            }
                            $matches++;
                        }
                    }
                    if ($matches !== count($nondraftannotations)) {
                        return true;
                    }
                }
                // Select all comments.
                $draftcomments = page_editor::get_comments($sourcegrade->id, $i, true);
                $nondraftcomments = page_editor::get_comments($grade->id, $i, false);
                if (count($draftcomments) != count($nondraftcomments)) {
                    return true;
                } else {
                    // Go for a closer inspection.
                    $matches = 0;
                    foreach ($nondraftcomments as $ndcomment) {
                        foreach ($draftcomments as $dcomment) {
                            foreach ($ndcomment as $key => $value) {
                                if ($key != 'id' && $value != $dcomment->{$key}) {
                                    continue 2;
                                }
                            }
                            $matches++;
                        }
                    }
                    if ($matches !== count($nondraftcomments)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * Generate the pdf.
     *
     * @param stdClass $grade
     * @param stdClass $data
     * @return bool
     */
    public function save(stdClass $grade, stdClass $data) {
        // Source user id is only added to the form if there was a pdf.
        if (!empty($data->editpdf_source_userid)) {
            $sourceuserid = $data->editpdf_source_userid;
            // Copy drafts annotations and comments if current user is different to sourceuserid.
            if ($sourceuserid != $grade->userid) {
                page_editor::copy_drafts_from_to($this->assignment, $grade, $sourceuserid);
            }
        }
        if (page_editor::has_annotations_or_comments($grade->id, true)) {
            document_services::generate_feedback_document($this->assignment, $grade->userid, $grade->attemptnumber);
        }

        return true;
    }

    /**
     * Display the list of files in the feedback status table.
     *
     * @param stdClass $grade
     * @param bool $showviewlink (Always set to false).
     * @return string
     */
    public function view_summary(stdClass $grade, & $showviewlink) {
        $showviewlink = false;
        return $this->view($grade);
    }

    /**
     * Display the list of files in the feedback status table.
     *
     * @param stdClass $grade
     * @return string
     */
    public function view(stdClass $grade) {
        global $PAGE;
        $html = '';
        // Show a link to download the pdf.
        if (page_editor::has_annotations_or_comments($grade->id, false)) {
            $html = $this->assignment->render_area_files('assignfeedback_editpdfplus', document_services::FINAL_PDF_FILEAREA, $grade->id);
            //debugging('tutu');
            // Also show the link to the read-only interface.
            $renderer = $PAGE->get_renderer('assignfeedback_editpdfplus');
            $widget = $this->get_widget($grade->userid, $grade, true);

            $html .= $renderer->render($widget);
        }
        return $html;
    }

    /**
     * Return true if there are no released comments/annotations.
     *
     * @param stdClass $grade
     */
    public function is_empty(stdClass $grade) {
        global $DB;

        $comments = $DB->count_records('assignfeedback_editpp_cmnt', array('gradeid' => $grade->id, 'draft' => 0));
        $annotations = $DB->count_records('assignfeedback_editpp_annot', array('gradeid' => $grade->id, 'draft' => 0));
        return $comments == 0 && $annotations == 0;
    }

    /**
     * The assignment has been deleted - remove the plugin specific data
     *
     * @return bool
     */
    public function delete_instance() {
        global $DB;
        $grades = $DB->get_records('assign_grades', array('assignment' => $this->assignment->get_instance()->id), '', 'id');
        if ($grades) {
            list($gradeids, $params) = $DB->get_in_or_equal(array_keys($grades), SQL_PARAMS_NAMED);
            $DB->delete_records_select('assignfeedback_editpp_annot', 'gradeid ' . $gradeids, $params);
            $DB->delete_records_select('assignfeedback_editpp_cmnt', 'gradeid ' . $gradeids, $params);
        }
        return true;
    }

    /**
     * Automatically enable or disable editpdf feedback plugin based on
     * whether the ghostscript path is set correctly.
     *
     * @return bool
     */
    public function is_enabled() {
        if ($this->enabledcache === null) {
            $testpath = assignfeedback_editpdfplus\pdf::test_gs_path(false);
            $this->enabledcache = ($testpath->status == assignfeedback_editpdfplus\pdf::GSPATH_OK) && $this->get_config('enabled');
        }
        return $this->enabledcache;
    }

    /**
     * Automatically hide the setting for the editpdf feedback plugin.
     *
     * @return bool false
     */
    public function is_configurable() {
        return true;
    }

    /**
     * Get file areas returns a list of areas this plugin stores files.
     *
     * @return array - An array of fileareas (keys) and descriptions (values)
     */
    public function get_file_areas() {
        return array(document_services::FINAL_PDF_FILEAREA => $this->get_name());
    }

    /**
     * This plugin will inject content into the review panel with javascript.
     * @return bool true
     */
    public function supports_review_panel() {
        return true;
    }

}
