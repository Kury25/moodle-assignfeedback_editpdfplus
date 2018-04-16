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

/**
 * A custom renderer class that extends the plugin_renderer_base and is used by the editpdf feedback plugin.
 *
 * @package assignfeedback_editpdfplus
 * @copyright 2013 Davo Smith
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class assignfeedback_editpdfplus_renderer extends plugin_renderer_base {

    /**
     * Return the PDF button shortcut.
     *
     * @param string $name the name of a specific button.
     * @return string the specific shortcut.
     */
    private function get_shortcut($name) {

        $shortcuts = array('navigate-previous-button' => 'j',
            'navigate-page-select' => 'k',
            'navigate-next-button' => 'l',
            'select' => 'c',
            'drag' => 'd',
            'pen' => 'y',
            'line' => 'u',
            'rectangle' => 'i',
            'oval' => 'o',
            'highlight' => 'p',
            'annotationcolour' => 'r',
            'stamp' => 'n',
            'currentstamp' => 'm');


        // Return the shortcut.
        return $shortcuts[$name];
    }

    /**
     * Render a single colour button.
     *
     * @param string $icon - The key for the icon
     * @param string $tool - The key for the lang string.
     * @param string $accesskey Optional - The access key for the button.
     * @param bool $disabled Optional - Is this button disabled.
     * @return string
     */
    private function render_toolbar_button($icon, $tool, assignfeedback_editpdfplus\tool $fulltool = null, $accesskey = null, $disabled = false) {

        if (!$fulltool) {
            // Build button alt text.
            $alttext = new stdClass();
            $alttext->tool = $tool;
            if (!empty($accesskey)) {
                $alttext->shortcut = '(Alt/Shift-Alt/Ctrl-Option + ' . $accesskey . ')';
            } else {
                $alttext->shortcut = '';
            }
            $iconalt = get_string('toolbarbutton', 'assignfeedback_editpdfplus', $alttext);

            $class = "";
            switch ($tool) {
                case "drag":
                    $class = "fa-hand-paper-o";
                    break;
                case "select":
                    $class = "fa-mouse-pointer";
                    break;
                case "pen":
                    $class = "fa-pencil";
                    break;
                case "line":
                    $class = "fa-minus";
                    break;
                case "rectangle":
                    $class = "fa-square-o";
                    break;
                case "oval":
                    $class = "fa-circle-o";
                    break;
                case "highlight":
                    $class = "fa-paint-brush";
                    break;
                case "annotationcolour":
                    $class = "fa-tint"; //,'style'=>'color:red;'
                    break;
                default:
                    break;
            }
            $iconhtml = html_writer::tag("i", "", array('class' => 'fa ' . $class,
                        'aria-hidden' => 'true'));
            $iconparams = array('data-tool' => $tool, 'class' => $tool . 'button btn btn-default', 'type' => 'button');
            if ($disabled) {
                $iconparams['disabled'] = 'true';
            }
        } else {
            $iconalt = $fulltool->label;
            $iconhtml = $fulltool->label;
            if ($fulltool->type == 4) {
                $iconhtml = '| ' . $fulltool->label . ' |';
            }
            if ($fulltool->type == 5) {
                $iconhtml = '| ' . $fulltool->label;
            }
            $datatool = '';
            $class = '';
            switch ($fulltool->type) {
                case 1:
                    $datatool = 'highlightplus';
                    $class = 'highlightplus';
                    break;
                case 2:
                    $datatool = 'lineplus';
                    $class = 'lineplus';
                    break;
                case 3:
                    $datatool = 'stampplus';
                    $class = 'stampplus';
                    break;
                case 4:
                    $datatool = 'frame';
                    $class = 'frame';
                    break;
                case 5:
                    $datatool = 'verticalline';
                    $class = 'verticalline';
                    break;
                case 6:
                    $datatool = 'stampcomment';
                    $class = 'stampcomment';
                    break;
                case 7:
                    $datatool = 'commentplus';
                    $class = 'commentplus';
                    break;
                default:
                    break;
            }
            $iconparams = array('data-tool' => $datatool,
                'class' => $class . 'button btn btn-default costumtoolbarbutton',
                'id' => 'ctbutton' . $fulltool->id,
                'type' => 'button');
        }

        if (!empty($accesskey)) {
            $iconparams['accesskey'] = $accesskey;
        }
        return html_writer::tag('button', $iconhtml, $iconparams);
    }

    private function render_toolbar_axis(assignfeedback_editpdfplus\axis $axis) {
        $iconhtml = $axis->label;
        $iconparams = array('type' => 'checkbox', 'class' => 'axis', 'id' => 'ctaxis' . $axis->id, 'value' => $axis->id);
        return html_writer::tag('input', $iconhtml, $iconparams);
    }

    /**
     * Render the editpdf widget in the grading form.
     *
     * @param assignfeedback_editpdfplus_widget $widget - Renderable widget containing assignment, user and attempt number.
     * @return string
     */
    public function render_assignfeedback_editpdfplus_widget(assignfeedback_editpdfplus_widget $widget) {
        global $CFG;

        $html = '';

        $html .= html_writer::div(get_string('jsrequired', 'assignfeedback_editpdfplus'), 'hiddenifjs');
        $linkid = html_writer::random_id();
        if ($widget->readonly) {
            $launcheditorlink = html_writer::tag('a', get_string('viewfeedbackonline', 'assignfeedback_editpdfplus'), array('id' => $linkid, 'class' => 'btn', 'href' => '#'));
        } else {
            $launcheditorlink = html_writer::tag('a', get_string('launcheditor', 'assignfeedback_editpdfplus'), array('id' => $linkid, 'class' => 'btn', 'href' => '#'));
        }
        $links = $launcheditorlink;
        $html .= '<input type="hidden" name="assignfeedback_editpdfplus_haschanges" value="false"/>';

        $html .= html_writer::div($links, 'visibleifjs');
        $header = get_string('pluginname', 'assignfeedback_editpdfplus');
        $body = '';
        // Create the page navigation.
        $navigation1 = '';

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
        $navigation1 .= html_writer::tag('button', $iconhtmlP, array('disabled' => 'true',
                    'class' => 'btn btn-default navigate-previous-button',
                    'type' => 'button',
                    'accesskey' => $this->get_shortcut('navigate-previous-button')));

        $navigation1 .= html_writer::tag('select', null, array('disabled' => 'true',
                    'aria-label' => get_string('gotopage', 'assignfeedback_editpdfplus'), 'class' => 'navigate-page-select',
                    'accesskey' => $this->get_shortcut('navigate-page-select')));
        $iconhtmlN = html_writer::tag("i", "", array('class' => 'fa fa-caret-right fa-2x',
                    'aria-hidden' => 'true'));
        $navigation1 .= html_writer::tag('button', $iconhtmlN, array('disabled' => 'true',
                    'class' => 'btn btn-default navigate-next-button',
                    'type' => 'button',
                    'accesskey' => $this->get_shortcut('navigate-next-button')));

        $divnavigation1 = html_writer::div($navigation1, 'navigation', array('role' => 'navigation'));

        $toolbar001 = '';
        $toolbar002 = '';
        $toolbarCostumdiv = '';
        $toolbaraxis = '';
        $clearfix = html_writer::div('', 'clearfix');

        if (!$widget->readonly) {

            /** Toolbar n°0 : basic tools * */
            // Select Tool.
            $toolbar001 .= $this->render_toolbar_button('drag', 'drag', null, $this->get_shortcut('drag'));
            $toolbar001 .= $this->render_toolbar_button('select', 'select', null, $this->get_shortcut('select'));
            $toolbar001 = html_writer::div($toolbar001, 'toolbar', array('role' => 'toolbar'));

            // Other Tools.
            $toolbar002 .= $this->render_toolbar_button('pen', 'pen', null, $this->get_shortcut('pen'));
            $toolbar002 .= $this->render_toolbar_button('line', 'line', null, $this->get_shortcut('line'));
            $toolbar002 .= $this->render_toolbar_button('rectangle', 'rectangle', null, $this->get_shortcut('rectangle'));
            $toolbar002 .= $this->render_toolbar_button('oval', 'oval', null, $this->get_shortcut('oval'));
            $toolbar002 .= $this->render_toolbar_button('highlight', 'highlight', null, $this->get_shortcut('highlight'));
            $toolbar002 .= $this->render_toolbar_button('background_colour_clear', 'annotationcolour', null, $this->get_shortcut('annotationcolour'));
            $toolbar002 = html_writer::div($toolbar002, 'toolbar', array('role' => 'toolbar'));

            /** Costum toolbars * */
            $toolbarCostum = array();
            $axis = array();
            foreach ($widget->toolbars as $toolbar) {
                $axis[$toolbar['axeid']] = $toolbar['label'];
                $toolbartmp = '';
                foreach ($toolbar['tool'] as $tool) {
                    if ($tool->enabled) {
                        $toolbartmp .= $this->render_toolbar_button('', '', $tool);
                    }
                }
                $toolbarCostum[] = html_writer::div($toolbartmp, 'toolbar customtoolbar', array('role' => 'toolbar', 'id' => 'toolbaraxis' . $toolbar['axeid'], 'style' => 'display:none;'));
            }
            $axischoice = html_writer::div(html_writer::select($axis, 'axisselection', 0, FALSE), 'toolbar ', array('role' => 'toolbar'));
            foreach ($toolbarCostum as $toolbarCostumUnit) {
                $toolbarCostumdiv .= $toolbarCostumUnit;
            }
            $toolbarCostumdiv .= $axischoice;
        } else {
            $toolbaraxis = "<div class='navigation' style='padding-left:10px;'><div style='display:inline;margin-right:5px;text-align:left;'>";
            $axis = $widget->axis;
            foreach ($axis as $ax) {
                $toolbaraxis .= $this->render_toolbar_axis($ax);
                $toolbaraxis .= "</div><div style='display:inline;margin-left:5px;text-align:left;'>";
            }
            $toolbaraxis .= "</div></div>";
            $questionchoice = html_writer::select(
                            [get_string('question_select', 'assignfeedback_editpdfplus'), get_string('question_select_without', 'assignfeedback_editpdfplus'), get_string('question_select_with', 'assignfeedback_editpdfplus')], 'questionselection', 0, FALSE, array('class' => 'form-control'));
            $axischoice = html_writer::select(
                            [get_string('statut_select', 'assignfeedback_editpdfplus'), get_string('statut_select_nc', 'assignfeedback_editpdfplus'), get_string('statut_select_ok', 'assignfeedback_editpdfplus'), get_string('statut_select_ko', 'assignfeedback_editpdfplus')], 'statutselection', 0, FALSE, array('class' => 'form-control'));
            $validatebutton = html_writer::tag('button', get_string('send_pdf_update', 'assignfeedback_editpdfplus'), array('class' => 'button btn btn-default', 'id' => 'student_valide_button'));
            $toolbaraxis .= html_writer::div($validatebutton, 'toolbar ', array('role' => 'toolbar'));
            $toolbaraxis .= html_writer::div($axischoice, 'toolbar ', array('role' => 'toolbar'));
            $toolbaraxis .= html_writer::div($questionchoice, 'toolbar ', array('role' => 'toolbar'));
        }

        // Toobars written in reverse order because they are floated right.
        $pageheader = html_writer::div($divnavigation1 .
                        $toolbar002 .
                        $toolbaraxis .
                        $toolbarCostumdiv .
                        $toolbar001 .
                        $clearfix, 'pageheader', array('style' => 'padding:0'));

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
                'stampfiles' => $widget->stampfiles,
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
            'stamp',
            'stamppicker',
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
