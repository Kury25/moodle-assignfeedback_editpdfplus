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
 * Install code for the feedback_editpdfplus module.
 *
 * @package   assignfeedback_editpdfplus
 * @copyright 2013 Jerome Mouneyrac
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

/**
 * EditPDFplus install code
 */
function xmldb_assignfeedback_editpdfplus_install() {
    global $CFG, $DB;

    // List of default stamps.
    $defaultstamps = array(/* 'smile.png', 'sad.png', 'tick.png', 'cross.png', */'twoway_h.png', 'twoway_v.png');

    // Stamp file object.
    $filerecord = new stdClass;
    $filerecord->component = 'assignfeedback_editpdfplus';
    $filerecord->contextid = context_system::instance()->id;
    $filerecord->userid = get_admin()->id;
    $filerecord->filearea = 'stamps';
    $filerecord->filepath = '/';
    $filerecord->itemid = 0;

    $fs = get_file_storage();

    // Load all default stamps.
    foreach ($defaultstamps as $stamp) {
        $filerecord->filename = $stamp;
        $fs->create_file_from_pathname($filerecord, $CFG->dirroot . '/mod/assign/feedback/editpdfplus/pix/' . $filerecord->filename);
    }

    //init DB
    //axis
    $axis1 = new assignfeedback_editpdfplus\axis();
    $axis1->id = null;
    $axis1->contextid = 1;
    $axis1->label = "Axis 1 : grammar / syntax";
    $axis1->order = 1;
    $DB->insert_record('assignfeedback_editpp_axis', $axis1);
    $axis2 = new assignfeedback_editpdfplus\axis();
    $axis2->id = null;
    $axis2->contextid = 1;
    $axis2->label = "Axis 2 : contents";
    $axis2->order = 2;
    $DB->insert_record('assignfeedback_editpp_axis', $axis2);
    $axis3 = new assignfeedback_editpdfplus\axis();
    $axis3->id = null;
    $axis3->contextid = 1;
    $axis3->label = "Axis 3 : others";
    $axis3->order = 3;
    $DB->insert_record('assignfeedback_editpp_axis', $axis3);
    //tool type
    $tytool1 = new assignfeedback_editpdfplus\type_tool();
    $tytool1->id = null;
    $tytool1->cartridge_color = "#FF6F40";
    $tytool1->cartridge_x = 0;
    $tytool1->cartridge_y = -24;
    $tytool1->color = "#FFFF40";
    $tytool1->contextid = 1;
    $tytool1->label = "highlightplus";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool1);
    $tytool2 = new assignfeedback_editpdfplus\type_tool();
    $tytool2->id = null;
    $tytool2->cartridge_color = null;
    $tytool2->cartridge_x = null;
    $tytool2->cartridge_y = null;
    $tytool2->color = "red";
    $tytool2->contextid = 1;
    $tytool2->label = "stampplus";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool2);
    $tytool3 = new assignfeedback_editpdfplus\type_tool();
    $tytool3->id = null;
    $tytool3->cartridge_color = null;
    $tytool3->cartridge_x = 5;
    $tytool3->cartridge_y = -8;
    $tytool3->color = "#FF0000";
    $tytool3->contextid = 1;
    $tytool3->label = "frame";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool3);
    $tytool4 = new assignfeedback_editpdfplus\type_tool();
    $tytool4->id = null;
    $tytool4->cartridge_color = "#0000FF";
    $tytool4->cartridge_x = 5;
    $tytool4->cartridge_y = 0;
    $tytool4->color = "#0000FF";
    $tytool4->contextid = 1;
    $tytool4->label = "verticalline";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool4);
    $tytool5 = new assignfeedback_editpdfplus\type_tool();
    $tytool5->id = null;
    $tytool5->cartridge_color = "#000099";
    $tytool5->cartridge_x = 35;
    $tytool5->cartridge_y = -4;
    $tytool5->color = "#000099";
    $tytool5->contextid = 1;
    $tytool5->label = "stampcomment";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool5);
    $tytool6 = new assignfeedback_editpdfplus\type_tool();
    $tytool6->id = null;
    $tytool6->cartridge_color = "#000000";
    $tytool6->cartridge_x = null;
    $tytool6->cartridge_y = null;
    $tytool6->color = null;
    $tytool6->contextid = 1;
    $tytool6->label = "commentplus";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool6);
    $tytool7 = new assignfeedback_editpdfplus\type_tool();
    $tytool7->id = null;
    $tytool7->cartridge_color = null;
    $tytool7->cartridge_x = null;
    $tytool7->cartridge_y = null;
    $tytool7->color = null;
    $tytool7->contextid = 1;
    $tytool7->label = "pen";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool7);
    $tytool8 = new assignfeedback_editpdfplus\type_tool();
    $tytool8->id = null;
    $tytool8->cartridge_color = null;
    $tytool8->cartridge_x = null;
    $tytool8->cartridge_y = null;
    $tytool8->color = null;
    $tytool8->contextid = 1;
    $tytool8->label = "line";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool8);
    $tytool9 = new assignfeedback_editpdfplus\type_tool();
    $tytool9->id = null;
    $tytool9->cartridge_color = null;
    $tytool9->cartridge_x = null;
    $tytool9->cartridge_y = null;
    $tytool9->color = null;
    $tytool9->contextid = 1;
    $tytool9->label = "rectangle";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool9);
    $tytool10 = new assignfeedback_editpdfplus\type_tool();
    $tytool10->id = null;
    $tytool10->cartridge_color = null;
    $tytool10->cartridge_x = null;
    $tytool10->cartridge_y = null;
    $tytool10->color = null;
    $tytool10->contextid = 1;
    $tytool10->label = "oval";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool10);
    $tytool11 = new assignfeedback_editpdfplus\type_tool();
    $tytool11->id = null;
    $tytool11->cartridge_color = null;
    $tytool11->cartridge_x = null;
    $tytool11->cartridge_y = null;
    $tytool11->color = null;
    $tytool11->contextid = 1;
    $tytool11->label = "highlight";
    $DB->insert_record('assignfeedback_editpp_typet', $tytool11);
    //tools
    $tool1 = new assignfeedback_editpdfplus\tool();
    $tool1->id = null;
    $tool1->axis = 0;
    $tool1->cartridge = null;
    $tool1->cartridge_color = null;
    $tool1->colors = null;
    $tool1->contextid = 1;
    $tool1->enabled = 1;
    $tool1->label = "pen";
    $tool1->order = null;
    $tool1->reply = 0;
    $tool1->texts = null;
    $tool1->type = 8;
    $DB->insert_record('assignfeedback_editpp_tool', $tool1);
    $tool2 = new assignfeedback_editpdfplus\tool();
    $tool2->id = null;
    $tool2->axis = 0;
    $tool2->cartridge = null;
    $tool2->cartridge_color = null;
    $tool2->colors = null;
    $tool2->contextid = 1;
    $tool2->enabled = 1;
    $tool2->label = "line";
    $tool2->order = null;
    $tool2->reply = 0;
    $tool2->texts = null;
    $tool2->type = 9;
    $DB->insert_record('assignfeedback_editpp_tool', $tool2);
    $tool3 = new assignfeedback_editpdfplus\tool();
    $tool3->id = null;
    $tool3->axis = 0;
    $tool3->cartridge = null;
    $tool3->cartridge_color = null;
    $tool3->colors = null;
    $tool3->contextid = 1;
    $tool3->enabled = 1;
    $tool3->label = "rectangle";
    $tool3->order = null;
    $tool3->reply = 0;
    $tool3->texts = null;
    $tool3->type = 10;
    $DB->insert_record('assignfeedback_editpp_tool', $tool3);
    $tool4 = new assignfeedback_editpdfplus\tool();
    $tool4->id = null;
    $tool4->axis = 0;
    $tool4->cartridge = null;
    $tool4->cartridge_color = null;
    $tool4->colors = null;
    $tool4->contextid = 1;
    $tool4->enabled = 1;
    $tool4->label = "oval";
    $tool4->order = null;
    $tool4->reply = 0;
    $tool4->texts = null;
    $tool4->type = 11;
    $DB->insert_record('assignfeedback_editpp_tool', $tool4);
    $tool5 = new assignfeedback_editpdfplus\tool();
    $tool5->id = null;
    $tool5->axis = 0;
    $tool5->cartridge = null;
    $tool5->cartridge_color = null;
    $tool5->colors = null;
    $tool5->contextid = 1;
    $tool5->enabled = 1;
    $tool5->label = "highlight";
    $tool5->order = null;
    $tool5->reply = 0;
    $tool5->texts = null;
    $tool5->type = 12;
    $DB->insert_record('assignfeedback_editpp_tool', $tool5);
    $tool6 = new assignfeedback_editpdfplus\tool();
    $tool6->id = null;
    $tool6->axis = 1;
    $tool6->cartridge = "Axis1";
    $tool6->cartridge_color = null;
    $tool6->colors = null;
    $tool6->contextid = 1;
    $tool6->enabled = 1;
    $tool6->label = "COMMENT";
    $tool6->order = 1;
    $tool6->reply = 1;
    $tool6->texts = null;
    $tool6->type = 7;
    $DB->insert_record('assignfeedback_editpp_tool', $tool6);
    $tool7 = new assignfeedback_editpdfplus\tool();
    $tool7->id = null;
    $tool7->axis = 1;
    $tool7->cartridge = "LEX";
    $tool7->cartridge_color = null;
    $tool7->colors = null;
    $tool7->contextid = 1;
    $tool7->enabled = 1;
    $tool7->label = "LEXIQUE";
    $tool7->order = 2;
    $tool7->reply = 1;
    $tool7->texts = '"wrong meaning","bad word"';
    $tool7->type = 1;
    $DB->insert_record('assignfeedback_editpp_tool', $tool7);
    $tool8 = new assignfeedback_editpdfplus\tool();
    $tool8->id = null;
    $tool8->axis = 1;
    $tool8->cartridge = "REP";
    $tool8->cartridge_color = null;
    $tool8->colors = null;
    $tool8->contextid = 1;
    $tool8->enabled = 1;
    $tool8->label = "REPETION";
    $tool8->order = 3;
    $tool8->reply = 1;
    $tool8->texts = '"repetition","duplication"';
    $tool8->type = 4;
    $DB->insert_record('assignfeedback_editpp_tool', $tool8);
    $tool9 = new assignfeedback_editpdfplus\tool();
    $tool9->id = null;
    $tool9->axis = 1;
    $tool9->cartridge = null;
    $tool9->cartridge_color = null;
    $tool9->colors = "blue";
    $tool9->contextid = 1;
    $tool9->enabled = 1;
    $tool9->label = "PONCTUATION";
    $tool9->order = 4;
    $tool9->reply = 0;
    $tool9->texts = null;
    $tool9->type = 3;
    $DB->insert_record('assignfeedback_editpp_tool', $tool9);
    $tool10 = new assignfeedback_editpdfplus\tool();
    $tool10->id = null;
    $tool10->axis = 2;
    $tool10->cartridge = "Axis2";
    $tool10->cartridge_color = null;
    $tool10->colors = null;
    $tool10->contextid = 1;
    $tool10->enabled = 1;
    $tool10->label = "COMMENT";
    $tool10->order = 1;
    $tool10->reply = 1;
    $tool10->texts = null;
    $tool10->type = 7;
    $DB->insert_record('assignfeedback_editpp_tool', $tool10);
    $tool11 = new assignfeedback_editpdfplus\tool();
    $tool11->id = null;
    $tool11->axis = 2;
    $tool11->cartridge = "LI";
    $tool11->cartridge_color = null;
    $tool11->colors = null;
    $tool11->contextid = 1;
    $tool11->enabled = 1;
    $tool11->label = "LINK";
    $tool11->order = 2;
    $tool11->reply = 1;
    $tool11->texts = '"Connection","Correlation","Relation between these 2 ideas"';
    $tool11->type = 6;
    $DB->insert_record('assignfeedback_editpp_tool', $tool11);
    $tool12 = new assignfeedback_editpdfplus\tool();
    $tool12->id = null;
    $tool12->axis = 3;
    $tool12->cartridge = "Useless";
    $tool12->cartridge_color = "#0000FF";
    $tool12->colors = "#0000FF";
    $tool12->contextid = 1;
    $tool12->enabled = 1;
    $tool12->label = "Useless";
    $tool12->order = 1;
    $tool12->reply = 0;
    $tool12->texts = null;
    $tool12->type = 1;
    $DB->insert_record('assignfeedback_editpp_tool', $tool12);
    $tool13 = new assignfeedback_editpdfplus\tool();
    $tool13->id = null;
    $tool13->axis = 3;
    $tool13->cartridge = null;
    $tool13->cartridge_color = null;
    $tool13->colors = "green";
    $tool13->contextid = 1;
    $tool13->enabled = 1;
    $tool13->label = "✔";
    $tool13->order = 2;
    $tool13->reply = 0;
    $tool13->texts = null;
    $tool13->type = 3;
    $DB->insert_record('assignfeedback_editpp_tool', $tool13);
    $tool14 = new assignfeedback_editpdfplus\tool();
    $tool14->id = null;
    $tool14->axis = 3;
    $tool14->cartridge = "Formatting";
    $tool14->cartridge_color = "#FF6F40";
    $tool14->colors = "#FF6F40";
    $tool14->contextid = 1;
    $tool14->enabled = 1;
    $tool14->label = "FORM";
    $tool14->order = 3;
    $tool14->reply = 1;
    $tool14->texts = '"identation","order"';
    $tool14->type = 5;
    $DB->insert_record('assignfeedback_editpp_tool', $tool14);
}
