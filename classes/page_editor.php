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
 * @copyright 2012 Davo Smith
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace assignfeedback_editpdfplus;

use assignfeedback_editpdfplus\tool;

/**
 * This class performs crud operations on comments and annotations from a page of a response.
 *
 * No capability checks are done - they should be done by the calling class.
 *
 * @package   assignfeedback_editpdfplus
 * @copyright 2012 Davo Smith
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class page_editor {

    /**
     * Get all comments for a page.
     * @param int $gradeid
     * @param int $pageno
     * @param bool $draft
     * @return comment[]
     * @deprecated since version 2016101700
     */
    public static function get_comments($gradeid, $pageno, $draft) {
        global $DB;

        $comments = array();
        $params = array('gradeid' => $gradeid, 'pageno' => $pageno, 'draft' => 1);
        if (!$draft) {
            $params['draft'] = 0;
        }
        $records = $DB->get_records('assignfeedback_editpp_cmnt', $params);
        foreach ($records as $record) {
            array_push($comments, new comment($record));
        }

        return $comments;
    }

    /**
     * Set all comments for a page.
     * @param int $gradeid
     * @param int $pageno
     * @param comment[] $comments
     * @return int - the number of comments.
     * @deprecated since version 2016101700
     */
    public static function set_comments($gradeid, $pageno, $comments) {
        global $DB;

        $DB->delete_records('assignfeedback_editpp_cmnt', array('gradeid' => $gradeid, 'pageno' => $pageno, 'draft' => 1));

        $added = 0;
        foreach ($comments as $record) {
            // Force these.
            if (!($record instanceof comment)) {
                $comment = new comment($record);
            } else {
                $comment = $record;
            }
            if (trim($comment->rawtext) === '') {
                continue;
            }
            $comment->gradeid = $gradeid;
            $comment->pageno = $pageno;
            $comment->draft = 1;
            if (self::add_comment($comment)) {
                $added++;
            }
        }

        return $added;
    }

    /**
     * Get a single comment by id.
     * @param int $commentid
     * @return comment or false
     * @deprecated since version 2016101700
     */
    public static function get_comment($commentid) {
        $record = $DB->get_record('assignfeedback_editpp_cmnt', array('id' => $commentid), '*', IGNORE_MISSING);
        if ($record) {
            return new comment($record);
        }
        return false;
    }

    /**
     * Add a comment to a page.
     * @param comment $comment
     * @return bool
     * @deprecated since version 2016101700
     */
    public static function add_comment(comment $comment) {
        global $DB;
        $comment->id = null;
        return $DB->insert_record('assignfeedback_editpp_cmnt', $comment);
    }

    /**
     * Remove a comment from a page.
     * @param int $commentid
     * @return bool
     * @deprecated since version 2016101700
     */
    public static function remove_comment($commentid) {
        global $DB;
        return $DB->delete_records('assignfeedback_editpp_cmnt', array('id' => $commentid));
    }

    /**
     * Get all tools for a page.
     * @param int $contextid
     * @param int $axis
     * @return tool[]
     */
    public static function get_tools($contextidlist) {
        global $DB;
        $tools = array();
        if ($contextidlist) {
            $records = $DB->get_records_list('assignfeedback_editpp_tool', 'contextid', $contextidlist);
        } else {
            $records = $DB->get_records('assignfeedback_editpp_tool');
        }
        foreach ($records as $record) {
            if ($record->enabled == 1) {
                array_push($tools, new tool($record));
            }
        }
        usort($tools, function($a, $b) {
            $al = $a->order;
            $bl = $b->order;
            if ($al == $bl) {
                return 0;
            }
            return ($al > $bl) ? +1 : -1;
        });
        return $tools;
    }

    /**
     * Get a single tool by id.
     * @param int $toolid
     * @return tool or false
     */
    public static function get_tool($toolid) {
        global $DB;
        $record = $DB->get_record('assignfeedback_editpp_tool', array('id' => $toolid), '*', IGNORE_MISSING);
        if ($record) {
            return new tool($record);
        }
        return false;
    }

    /**
     * Get the tool type with id tooltypeid.
     * @param int $tooltypeid
     * @return type_tool
     */
    public static function get_type_tool($tooltypeid) {
        global $DB;
        $record = $DB->get_record('assignfeedback_editpp_typet', array('id' => $tooltypeid));
        if ($record) {
            return new type_tool($record);
        }
        return false;
    }

    /**
     * Get all the type tools.
     * @param array $contextidlist
     * @return type_tool
     */
    public static function get_typetools($contextidlist) {
        global $DB;
        $typetools = array();
        if ($contextidlist) {
            $records = $DB->get_records_list('assignfeedback_editpp_typet', 'contextid', $contextidlist);
        } else {
            $records = $DB->get_records('assignfeedback_editpp_typet');
        }
        foreach ($records as $record) {
            array_push($typetools, new type_tool($record));
        }
        return $typetools;
    }

    /**
     * Get all axis for contextid.
     * @param array $contextidlist optional
     * @return axis[]
     */
    public static function get_axis($contextidlist) {
        global $DB;
        $axis = array();
        if ($contextidlist) {
            $records = $DB->get_records_list('assignfeedback_editpp_axis', 'contextid', $contextidlist);
        } else {
            $records = $DB->get_records('assignfeedback_editpp_axis');
        }
        foreach ($records as $record) {
            array_push($axis, new axis($record));
        }
        usort($axis, function($a, $b) {
            $al = $a->order;
            $bl = $b->order;
            if ($al == $bl) {
                return 0;
            }
            return ($al > $bl) ? +1 : -1;
        });
        return $axis;
    }

    /**
     * Get all annotations for a page.
     * @param int $gradeid
     * @param int $pageno
     * @param bool $draft
     * @return annotation[]
     */
    public static function get_annotations($gradeid, $pageno, $draft) {
        global $DB;

        $params = array('gradeid' => $gradeid, 'pageno' => $pageno, 'draft' => 1);
        if (!$draft) {
            $params['draft'] = 0;
        }
        $annotations = array();
        $records = $DB->get_records('assignfeedback_editpp_annot', $params);
        foreach ($records as $record) {
            array_push($annotations, new annotation($record));
        }

        return $annotations;
    }

    /**
     * Set all annotations for a page.
     * @param int $gradeid
     * @param int $pageno
     * @param annotation[] $annotations
     * @return int - the number of annotations.
     */
    public static function set_annotations($gradeid, $pageno, $annotations) {
        global $DB;

        $DB->delete_records('assignfeedback_editpp_annot', array('gradeid' => $gradeid, 'pageno' => $pageno, 'draft' => 1));
        $added = 0;
        $annotationdiv = array();
        foreach ($annotations as $record) {
            $currentdiv = $record->divcartridge;
            if ($record->parent_annot_div != '') {
                //on est dans le cas d'une annotation liee
                $idparent = $annotationdiv[$record->parent_annot_div];
                $record->parent_annot = intval($idparent);
            }
            // Force these.
            if (!($record instanceof annotation)) {
                $annotation = new annotation($record);
            } else {
                $annotation = $record;
            }
            $annotation->gradeid = $gradeid;
            $annotation->pageno = $pageno;
            $annotation->draft = 1;
            $newid = self::add_annotation($annotation);
            if ($newid) {
                if ($currentdiv != '') {
                    $annotationdiv[$currentdiv] = $newid;
                }
                $added++;
            }
        }

        return $added;
    }

    /**
     * Update a set of annotations to database
     * @global $DB
     * @param annotation[] $annotations
     * @return int number of rows updated
     */
    public static function update_annotations_status($annotations) {
        global $DB;
        $added = 0;
        foreach ($annotations as $recordtmp) {
            $record = page_editor::get_annotation($recordtmp->id);
            //$old = $record->studentstatus;
            $record->studentstatus = $recordtmp->studentstatus;
            $record->studentanswer = $recordtmp->studentanswer;
            //debugging($recordtmp->id . ' - ' . $record->id . ' - ' . $old . ' | ' . $recordtmp->studentstatus . ' - ' . $record->studentstatus . ' | ' . $recordtmp->studentanswer . ' - ' . $record->studentanswer);
            $DB->update_record('assignfeedback_editpp_annot', $record);
            $added++;
        }

        return $added;
    }

    /**
     * Get a single annotation by id.
     * @param int $annotationid
     * @return annotation or false
     */
    public static function get_annotation($annotationid) {
        global $DB;

        $record = $DB->get_record('assignfeedback_editpp_annot', array('id' => $annotationid), '*', IGNORE_MISSING);
        if ($record) {
            return new annotation($record);
        }
        return false;
    }

    /**
     * Unrelease drafts
     * @param int $gradeid
     * @return bool
     */
    public static function unrelease_drafts($gradeid) {
        global $DB;

        // Delete the non-draft annotations and comments.
        $result = $DB->delete_records('assignfeedback_editpp_cmnt', array('gradeid' => $gradeid, 'draft' => 0));
        $result = $DB->delete_records('assignfeedback_editpp_annot', array('gradeid' => $gradeid, 'draft' => 0)) && $result;
        return $result;
    }

    /**
     * Release the draft comments and annotations to students.
     * @param int $gradeid
     * @return bool
     */
    public static function release_drafts($gradeid) {
        global $DB;

        // Delete the previous non-draft annotations and comments.
        $DB->delete_records('assignfeedback_editpp_cmnt', array('gradeid' => $gradeid, 'draft' => 0));
        $DB->delete_records('assignfeedback_editpp_annot', array('gradeid' => $gradeid, 'draft' => 0));

        // Copy all the draft annotations and comments to non-drafts.
        $parentlink = [];
        $records = $DB->get_records('assignfeedback_editpp_annot', array('gradeid' => $gradeid, 'draft' => 1));
        foreach ($records as $record) {
            $oldid = $record->id;
            unset($record->id);
            $record->draft = 0;
            $oldparentrecord = $record->parent_annot;
            if ($record->parent_annot > 0) {
                $record->parent_annot = $parentlink[$record->parent_annot];
            }
            $newid = $DB->insert_record('assignfeedback_editpp_annot', $record);
            $parentlink[$oldid] = $newid;
        }
        $records = $DB->get_records('assignfeedback_editpp_cmnt', array('gradeid' => $gradeid, 'draft' => 1));
        foreach ($records as $record) {
            unset($record->id);
            $record->draft = 0;
            $DB->insert_record('assignfeedback_editpp_cmnt', $record);
        }

        return true;
    }

    /**
     * Has annotations or comments.
     * @param int $gradeid
     * @return bool
     */
    public static function has_annotations_or_comments($gradeid, $includedraft) {
        global $DB;
        $params = array('gradeid' => $gradeid);
        if (!$includedraft) {
            $params['draft'] = 0;
        }
        if ($DB->count_records('assignfeedback_editpp_cmnt', $params)) {
            return true;
        }
        if ($DB->count_records('assignfeedback_editpp_annot', $params)) {
            return true;
        }
        return false;
    }

    /**
     * Aborts all draft annotations and reverts to the last version released to students.
     * @param int $gradeid
     * @return bool
     */
    public static function revert_drafts($gradeid) {
        global $DB;

        // Delete the previous non-draft annotations and comments.
        $DB->delete_records('assignfeedback_editpp_cmnt', array('gradeid' => $gradeid, 'draft' => 1));
        $DB->delete_records('assignfeedback_editpp_annot', array('gradeid' => $gradeid, 'draft' => 1));

        // Copy all the draft annotations and comments to non-drafts.
        $records = $DB->get_records('assignfeedback_editpp_annot', array('gradeid' => $gradeid, 'draft' => 0));
        foreach ($records as $record) {
            unset($record->id);
            $record->draft = 0;
            $DB->insert_record('assignfeedback_editpp_annot', $record);
        }
        $records = $DB->get_records('assignfeedback_editpp_cmnt', array('gradeid' => $gradeid, 'draft' => 0));
        foreach ($records as $record) {
            unset($record->id);
            $record->draft = 0;
            $DB->insert_record('assignfeedback_editpp_annot', $record);
        }

        return true;
    }

    /**
     * Add a annotation to a page.
     * @param annotation $annotation
     * @return bool
     */
    public static function add_annotation(annotation $annotation) {
        global $DB;

        $annotation->id = null;
        if ($annotation->parent_annot == 0) {
            $annotation->parent_annot = null;
        }
        return $DB->insert_record('assignfeedback_editpp_annot', $annotation);
    }

    /**
     * Remove a annotation from a page.
     * @param int $annotationid
     * @return bool
     */
    public static function remove_annotation($annotationid) {
        global $DB;

        return $DB->delete_records('assignfeedback_editpp_annot', array('id' => $annotationid));
    }

    /**
     * Copy annotations, comments, pages, and other required content from the source user to the current group member
     * being procssed when using applytoall.
     *
     * @param int|\assign $assignment
     * @param stdClass $grade
     * @param int $sourceuserid
     * @return bool
     */
    public static function copy_drafts_from_to($assignment, $grade, $sourceuserid) {
        global $DB;

        // Delete any existing annotations and comments from current user.
        $DB->delete_records('assignfeedback_editpp_annot', array('gradeid' => $grade->id));
        $DB->delete_records('assignfeedback_editpp_cmnt', array('gradeid' => $grade->id));
        // Get gradeid, annotations and comments from sourceuserid.
        $sourceusergrade = $assignment->get_user_grade($sourceuserid, true, $grade->attemptnumber);
        $annotations = $DB->get_records('assignfeedback_editpp_annot', array('gradeid' => $sourceusergrade->id, 'draft' => 1));
        $comments = $DB->get_records('assignfeedback_editpp_cmnt', array('gradeid' => $sourceusergrade->id, 'draft' => 1));
        $contextid = $assignment->get_context()->id;
        $sourceitemid = $sourceusergrade->id;

        // Add annotations and comments to current user to generate feedback file.
        foreach ($annotations as $annotation) {
            $annotation->gradeid = $grade->id;
            $DB->insert_record('assignfeedback_editpp_annot', $annotation);
        }
        foreach ($comments as $comment) {
            $comment->gradeid = $grade->id;
            $DB->insert_record('assignfeedback_editpp_cmnt', $comment);
        }

        $fs = get_file_storage();

        // Copy the stamp files.
        self::replace_files_from_to($fs, $contextid, $sourceitemid, $grade->id, document_services::STAMPS_FILEAREA, true);

        // Copy the PAGE_IMAGE_FILEAREA files.
        self::replace_files_from_to($fs, $contextid, $sourceitemid, $grade->id, document_services::PAGE_IMAGE_FILEAREA);

        return true;
    }

    /**
     * Replace the area files in the specified area with those in the source item id.
     *
     * @param \file_storage $fs The file storage class
     * @param int $contextid The ID of the context for the assignment.
     * @param int $sourceitemid The itemid to copy from - typically the source grade id.
     * @param int $itemid The itemid to copy to - typically the target grade id.
     * @param string $area The file storage area.
     * @param bool $includesubdirs Whether to copy the content of sub-directories too.
     */
    public static function replace_files_from_to($fs, $contextid, $sourceitemid, $itemid, $area, $includesubdirs = false) {
        $component = 'assignfeedback_editpdfplus';
        // Remove the existing files within this area.
        $fs->delete_area_files($contextid, $component, $area, $itemid);

        // Copy the files from the source area.
        if ($files = $fs->get_area_files($contextid, $component, $area, $sourceitemid, "filename", $includesubdirs)) {
            foreach ($files as $file) {
                $newrecord = new \stdClass();
                $newrecord->contextid = $contextid;
                $newrecord->itemid = $itemid;
                $fs->create_file_from_storedfile($newrecord, $file);
            }
        }
    }

    /**
     * Delete the draft annotations and comments.
     *
     * This is intended to be used when the version of the PDF has changed and the annotations
     * might not be relevant any more, therefore we should delete them.
     *
     * @param int $gradeid The grade ID.
     * @return bool
     */
    public static function delete_draft_content($gradeid) {
        global $DB;
        $conditions = array('gradeid' => $gradeid, 'draft' => 1);
        $result = $DB->delete_records('assignfeedback_editpp_annot', $conditions);
        $result = $result && $DB->delete_records('assignfeedback_editpp_cmnt', $conditions);
        return $result;
    }

    /**
     * Get the feedback comment from the database.
     *
     * @param int $gradeid
     * @return stdClass|false The feedback comments for the given grade if it exists.
     *                        False if it doesn't.
     */
    public function get_feedback_comments($gradeid) {
        global $DB;
        return $DB->get_record('assignfeedback_comments', array('grade' => $gradeid));
    }

}
