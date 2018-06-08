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
 * This file contains the definition for the library class for edit PDF renderer.
 *
 * @package   assignfeedback_editpdfplus
 * @copyright  2016 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

use \assignfeedback_editpdfplus\bdd\tool_generic;

/**
 * A custom renderer class that extends the plugin_renderer_base and is used by the editpdf feedback plugin.
 *
 * @package assignfeedback_editpdfplus
 * @copyright 2013 Davo Smith
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class assignfeedback_editpdfplus_renderer extends plugin_renderer_base {

    const TOOL_NAVPAGESELECT = "navigate-page-select";
    const TOOL_NAVPAGENEXT = "navigate-next-button";
    const TOOL_SELECT = "select";
    const TOOL_DRAG = "drag";
    const TOOL_ANNOTATIONCOLOR = "annotationcolour";

    /**
     * Render a single colour button.
     *
     * @param string $tool - The key for the lang string.
     * @param string $accesskey Optional - The access key for the button.
     * @param bool $disabled Optional - Is this button disabled.
     * @return string
     */
    private function render_toolbar_button(assignfeedback_editpdfplus\bdd\tool $fulltool = null, $disabled = false) {
        $displayArray = $fulltool->getRendererBoutonHTMLDisplay($disabled);
        return html_writer::tag('button', $displayArray["content"], $displayArray["parameters"]);
    }

    private function render_toolbar_axis(assignfeedback_editpdfplus\bdd\axis $axis) {
        $iconhtml = $axis->label;
        $iconparams = array('type' => 'checkbox', 'class' => 'axis', 'id' => 'ctaxis' . $axis->id, 'value' => $axis->id);
        $inputhtml = html_writer::tag('input', "", $iconparams);
        $labelHtml = html_writer::label($inputhtml . $iconhtml, "", true, array('class' => 'checkbox-inline mt-2 mr-2'));
        return $labelHtml;
    }

    /**
     * Render the editpdf widget in the grading form.
     *
     * @param assignfeedback_editpdfplus_widget $widget - Renderable widget containing assignment, user and attempt number.
     * @return string
     */
    public function render_assignfeedback_editpdfplus_widget(assignfeedback_editpdfplus_widget $widget) {
        $html = '';

        //JS declaration
        $html .= html_writer::div(get_string('jsrequired', 'assignfeedback_editpdfplus'), 'hiddenifjs');

        //Random id for plugin identification
        $linkid = html_writer::random_id();
        if ($widget->readonly) {
            $launcheditorlink = html_writer::tag('a', get_string('viewfeedbackonline', 'assignfeedback_editpdfplus'), array('id' => $linkid, 'class' => 'btn btn-secondary', 'href' => '#'));
        } else {
            $launcheditorlink = html_writer::tag('a', get_string('launcheditor', 'assignfeedback_editpdfplus'), array('id' => $linkid, 'class' => 'btn btn-secondary', 'href' => '#'));
        }
        $links = $launcheditorlink;
        $html .= '<input type="hidden" name="assignfeedback_editpdfplus_haschanges" value="false"/>';
        $html .= html_writer::div($links, 'visibleifjs');

        //html header
        $header = get_string('pluginname', 'assignfeedback_editpdfplus');

        $body = '';

        /* $tooglenavigation = html_writer::tag("button", '<span class="navbar-toggler-icon"></span>', array('class' => 'navbar-toggler',
          'type' => 'button',
          'data-toggle' => "collapse",
          'data-target' => "#navbarSupportedContent",
          'aria-expanded' => "Toggle navigation")); */

        // Create the page navigation.
        $navigation = '';
        // Pick the correct arrow icons for right to left mode.
        if (right_to_left()) {
            $nav_prev = 'nav_next';
            $nav_next = 'nav_prev';
        } else {
            $nav_prev = 'nav_prev';
            $nav_next = 'nav_next';
        }
        $iconhtmlP = html_writer::tag("i", "", array('class' => 'fa fa-caret-left fa-2x',
                    'aria-hidden' => 'true'));
        $navigation .= html_writer::tag('button', $iconhtmlP, array('disabled' => 'true',
                    'class' => 'btn btn-secondary navigate-previous-button',
                    'type' => 'button'));
        $navigation .= html_writer::tag('select', null, array('disabled' => 'true',
                    'aria-label' => get_string('gotopage', 'assignfeedback_editpdfplus'), 'class' => self::TOOL_NAVPAGESELECT));
        $iconhtmlN = html_writer::tag("i", "", array('class' => 'fa fa-caret-right fa-2x',
                    'aria-hidden' => 'true'));
        $navigation .= html_writer::tag('button', $iconhtmlN, array('disabled' => 'true',
                    'class' => 'btn btn-secondary ' . self::TOOL_NAVPAGENEXT,
                    'type' => 'button'));

        $navigationBlock = html_writer::div($navigation, "btn-group btn-group-sm mr-auto", array('role' => 'group'));

        $toolbarBaseBlock = '';
        $toolbarDrawBlock = '';
        $toolbarAdminBlock = '';
        $toolbarCostumdiv = '';
        $toolbarAxis = '';

        if (!$widget->readonly) {
            /** Toolbar n°0 : basic tools * */
            // Select Tool.
            $dragTool = new tool_generic();
            $dragTool->label = self::TOOL_DRAG;
            $toolbarBase = $this->render_toolbar_button($dragTool);
            $selectTool = new tool_generic();
            $selectTool->label = self::TOOL_SELECT;
            $toolbarBase .= $this->render_toolbar_button($selectTool);
            $toolbarBaseBlock = html_writer::div($toolbarBase, "btn-group btn-group-sm mr-3", array('role' => 'group'));

            // Generic Tools.
            $toolbarDraw = '';
            foreach ($widget->genericToolbar as $tool) {
                $toolbarDraw .= $this->render_toolbar_button($tool);
            }
            $colorTool = new tool_generic();
            $colorTool->label = self::TOOL_ANNOTATIONCOLOR;
            $toolbarDraw .= $this->render_toolbar_button($colorTool);
            $toolbarDrawBlock = html_writer::div($toolbarDraw, "btn-group btn-group-sm", array('role' => 'group'));

            /** Costum toolbars * */
            $toolbarCostum = array();
            $axis = array();
            foreach ($widget->customToolbars as $toolbar) {
                $axis[$toolbar['axeid']] = $toolbar['label'];
                $toolbartmp = '';
                foreach ($toolbar['tool'] as $tool) {
                    $toolbartmp .= $this->render_toolbar_button($tool);
                }
                $toolbarCostum[] = html_writer::div($toolbartmp, "btn-group btn-group-sm mr-3 customtoolbar", array('role' => 'group', 'id' => 'toolbaraxis' . $toolbar['axeid'], 'style' => 'display:none;'));
            }
            foreach ($toolbarCostum as $toolbarCostumUnit) {
                $toolbarCostumdiv .= $toolbarCostumUnit;
            }

            $statuschoice = html_writer::div(html_writer::select($axis, 'axisselection', 0, FALSE), "btn-group btn-group-sm mr-0", array('role' => 'group'));
            $toolbarAxis = $statuschoice;

            // Toolbar pour lien creation palette
            $courseid = $this->page->course->id;
            $lienAdmin = new moodle_url('/mod/assign/feedback/editpdfplus/view_admin.php', array('id' => $courseid));
            $toolbarAdmin = html_writer::tag('button', html_writer::tag("i", "", array('class' => 'fa fa-wrench', 'aria-hidden' => 'true')), array(
                        'class' => 'btn btn-info',
                        'type' => 'button',
                        'onclick' => "document.location='" . $lienAdmin->out() . "';"));
            $toolbarAdminBlock = html_writer::div($toolbarAdmin, "btn-group btn-group-sm mr-3", array('role' => 'group'));
        } else {

            $axis = $widget->axis;
            $toolbaraxisContent = "";
            foreach ($axis as $ax) {
                $toolbaraxisContent .= $this->render_toolbar_axis($ax);
            }
            $toolbarAxis = html_writer::div($toolbaraxisContent, "btn-group btn-group-sm mr-2", array('role' => 'group'));

            $questionchoice = html_writer::select(
                            [get_string('question_select', 'assignfeedback_editpdfplus'), get_string('question_select_without', 'assignfeedback_editpdfplus'), get_string('question_select_with', 'assignfeedback_editpdfplus')], 'questionselection', 0, FALSE, array('class' => 'form-control'));
            $statuschoice = html_writer::select(
                            [get_string('statut_select', 'assignfeedback_editpdfplus'), get_string('statut_select_nc', 'assignfeedback_editpdfplus'), get_string('statut_select_ok', 'assignfeedback_editpdfplus'), get_string('statut_select_ko', 'assignfeedback_editpdfplus')], 'statutselection', 0, FALSE, array('class' => 'form-control'));
            $validatebutton = html_writer::tag('button', get_string('send_pdf_update', 'assignfeedback_editpdfplus'), array('class' => 'btn btn-secondary', 'id' => 'student_valide_button'));
            $toolbarAxis .= html_writer::div($statuschoice, 'btn-group btn-group-sm', array('role' => 'group'));
            $toolbarAxis .= html_writer::div($questionchoice, 'btn-group btn-group-sm mr-3', array('role' => 'group'));
            $toolbarAxis .= html_writer::div($validatebutton, 'btn-group btn-group-sm mr-0', array('role' => 'group'));
        }

        $pageheadercontent = $navigationBlock
                . $toolbarAdminBlock
                . $toolbarBaseBlock
                . $toolbarAxis
                . $toolbarCostumdiv
                . $toolbarDrawBlock;
        $mainnavigation = html_writer::div($pageheadercontent, "btn-toolbar btn-group-sm bg-light p-1", array('role' => 'toolbar', 'style' => 'min-height:50px;'));

        // Toobars written in reverse order because they are floated right.
        $pageheader = $mainnavigation;

        $body .= $pageheader;

        // Loading progress bar.
        $progressbar = html_writer::div('', 'bar', array('style' => 'width: 0%'));
        $progressbar = html_writer::div($progressbar, 'progress progress-info progress-striped active', array('title' => get_string('loadingeditor', 'assignfeedback_editpdfplus'),
                    'role' => 'progressbar', 'aria-valuenow' => 0, 'aria-valuemin' => 0,
                    'aria-valuemax' => 100));
        $progressbarlabel = html_writer::div(get_string('generatingpdf', 'assignfeedback_editpdfplus'), 'progressbarlabel');
        $loading = html_writer::div($progressbar . $progressbarlabel, 'loading');

        $canvas = html_writer::div($loading, 'drawingcanvas');
        $canvas = html_writer::div($canvas, 'drawingregion');
        $changesmessage = html_writer::tag('div', get_string('draftchangessaved', 'assignfeedback_editpdfplus'), array(
                    'class' => 'assignfeedback_editpdfplus_unsavedchanges warning label label-info'
        ));
        $changesmessageDiv = html_writer::div($changesmessage, 'unsaved-changes');
        $canvas .= $changesmessageDiv;

        $changesmessage2 = html_writer::tag('div', get_string('nodraftchangessaved', 'assignfeedback_editpdfplus'), array(
                    'class' => 'assignfeedback_editpdfplus_unsavedchanges_edit warning label label-info'
        ));
        $changesmessage2Div = html_writer::div($changesmessage2, 'unsaved-changes');
        $canvas .= $changesmessage2Div;

        $body .= $canvas;

        $footer = '';

        $editorparams = array(array('header' => $header,
                'body' => $body,
                'footer' => $footer,
                'linkid' => $linkid,
                'assignmentid' => $widget->assignment,
                'userid' => $widget->userid,
                'attemptnumber' => $widget->attemptnumber,
                'readonly' => $widget->readonly));

        $this->page->requires->yui_module('moodle-assignfeedback_editpdfplus-editor', 'M.assignfeedback_editpdfplus.editor.init', $editorparams);

        $this->page->requires->strings_for_js(array(
            'yellow',
            'yellowlemon',
            'white',
            'red',
            'blue',
            'green',
            'black',
            'clear',
            'colourpicker',
            'loadingeditor',
            'pagexofy',
            'addtoquicklist',
            'filter',
            'deleteannotation',
            'cannotopenpdf',
            'pagenumber',
            'student_statut_nc',
            'student_answer_lib'
                ), 'assignfeedback_editpdfplus');

        return $html;
    }

    /**
     * Display admin view
     * @param assignfeedback_editpdfplus\widget_admin $widget
     * @return String
     */
    public function render_assignfeedback_editpdfplus_widget_admin(assignfeedback_editpdfplus\widget_admin $widget) {
        return $this->render_from_template('assignfeedback_editpdfplus/admin', $widget);
    }

    /**
     * Display axis form (add and edit)
     * @param moodleform $form
     * @return String
     */
    public function render_assignfeedback_editpdfplus_widget_admin_axisform(moodleform $form) {
        return $this->render_from_template('assignfeedback_editpdfplus/axis_form', $form);
    }

    /**
     * Display axis form (delete)
     * @param moodleform $form
     * @return String
     */
    public function render_assignfeedback_editpdfplus_widget_admin_axisdelform(moodleform $form) {
        return $this->render_from_template('assignfeedback_editpdfplus/axis_del_form', $form);
    }

    /**
     * Display tool form, with preview
     * @param object $data
     * @return String
     */
    public function render_assignfeedback_editpdfplus_widget_admin_toolform($data) {
        $data->map01 = $this->pix_url('map01', 'assignfeedback_editpdfplus');
        $data->map02 = $this->pix_url('map02', 'assignfeedback_editpdfplus');
        $data->map03 = $this->pix_url('map03', 'assignfeedback_editpdfplus');
        return $this->render_from_template('assignfeedback_editpdfplus/tool_form', $data);
    }

}
