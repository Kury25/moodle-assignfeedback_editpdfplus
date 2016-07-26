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
 * @copyright 2012 Davo Smith
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
            'searchcomments' => 'h',
            'comment' => 'z',
            'commentcolour' => 'x',
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

            $iconhtml = $this->pix_icon($icon, $iconalt, 'assignfeedback_editpdfplus');
            $iconparams = array('data-tool' => $tool, 'class' => $tool . 'button');
            if ($disabled) {
                $iconparams['disabled'] = 'true';
            }
        } else {
            $iconalt = $fulltool->label;
            $iconhtml = $fulltool->label;
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
            $iconparams = array('data-tool' => $datatool, 'class' => $class . 'button');
        }

        if (!empty($accesskey)) {
            $iconparams['accesskey'] = $accesskey;
        }
        return html_writer::tag('button', $iconhtml, $iconparams);
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
        $navigation2 = '';
        //$divToolbar;
        // Pick the correct arrow icons for right to left mode.
        if (right_to_left()) {
            $nav_prev = 'nav_next';
            $nav_next = 'nav_prev';
        } else {
            $nav_prev = 'nav_prev';
            $nav_next = 'nav_next';
        }

        $iconalt = get_string('navigateprevious', 'assignfeedback_editpdfplus');
        $iconhtml = $this->pix_icon($nav_prev, $iconalt, 'assignfeedback_editpdfplus');
        $navigation1 .= html_writer::tag('button', $iconhtml, array('disabled' => 'true',
                    'class' => 'navigate-previous-button', 'accesskey' => $this->get_shortcut('navigate-previous-button')));
        $navigation1 .= html_writer::tag('select', null, array('disabled' => 'true',
                    'aria-label' => get_string('gotopage', 'assignfeedback_editpdfplus'), 'class' => 'navigate-page-select',
                    'accesskey' => $this->get_shortcut('navigate-page-select')));
        $iconalt = get_string('navigatenext', 'assignfeedback_editpdfplus');
        $iconhtml = $this->pix_icon($nav_next, $iconalt, 'assignfeedback_editpdfplus');
        $navigation1 .= html_writer::tag('button', $iconhtml, array('disabled' => 'true',
                    'class' => 'navigate-next-button', 'accesskey' => $this->get_shortcut('navigate-next-button')));

        $divnavigation1 = html_writer::div($navigation1, 'navigation', array('role' => 'navigation'));

        $navigation2 .= $this->render_toolbar_button('comment_search', 'searchcomments', null, $this->get_shortcut('searchcomments'));
        $divnavigation2 = html_writer::div($navigation2, 'navigation-search', array('role' => 'navigation'));

        $toolbar001 = '';
        $toolbar002 = '';
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
                $compteur = 0;
                if (sizeof($toolbar) > 0) {
                    $toolbartmp = '';
                    foreach ($toolbar as $tool) {
                        $toolbartmp .= $this->render_toolbar_button('', '', $tool);
                    }
                    $toolbarCostum[] = html_writer::div($toolbartmp, 'toolbar customtoolbar', array('role' => 'toolbar', 'id' => 'toolbaraxis' . $tool->axis, 'style' => 'display:none;'));
                    switch ($tool->axis) {
                        case 1:
                            $axis[1] = 'Axe 1 : rectitude';
                            break;
                        case 2:
                            $axis[2] = 'Axe 2 : structure/contenu';
                            break;
                        case 3:
                            $axis[3] = 'Axe 3 : instance corr.';
                            break;
                    }
                    $compteur++;
                }
            }

            $axischoice = html_writer::div(html_writer::select($axis, 'axisselection', 0, FALSE), 'toolbar ', array('role' => 'toolbar'));
            $toolbarCostumdiv = '';
            foreach ($toolbarCostum as $toolbarCostumUnit) {
                $toolbarCostumdiv.= $toolbarCostumUnit;
            }
            $toolbarCostumdiv.= $axischoice;
        }

        // Toobars written in reverse order because they are floated right.
        $pageheader = html_writer::div($divnavigation1 .
                        $divnavigation2 .
                        $toolbar002 .
                        $toolbarCostumdiv .
                        $toolbar001 .
                        $clearfix, 'pageheader');
        debugging($pageheader);

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

        $changesmessage = html_writer::div($changesmessage, 'unsaved-changes');
        $canvas .= $changesmessage;

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
                'readonly' => $widget->readonly,
                'pagetotal' => $widget->pagetotal));

        //$this->page->requires->js_call_amd('assignfeedback_editpdfplus/toolbar', 'setup');

        $this->page->requires->yui_module('moodle-assignfeedback_editpdfplus-editor', 'M.assignfeedback_editpdfplus.editor.init', $editorparams);

        $this->page->requires->strings_for_js(array(
            'yellow',
            'white',
            'red',
            'blue',
            'green',
            'black',
            'clear',
            'colourpicker',
            'loadingeditor',
            'pagexofy',
            'deletecomment',
            'addtoquicklist',
            'filter',
            'searchcomments',
            'commentcontextmenu',
            'deleteannotation',
            'stamp',
            'stamppicker',
            'cannotopenpdf',
            'pagenumber'
                ), 'assignfeedback_editpdfplus');

        return $html;
    }

}
