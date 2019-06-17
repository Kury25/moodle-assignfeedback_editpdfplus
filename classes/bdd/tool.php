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
 * This file contains the annotation class for the assignfeedback_editpdfplus plugin
 *
 * @package   assignfeedback_editpdfplus
 * @copyright  2016 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace assignfeedback_editpdfplus\bdd;

/**
 * Description of tool
 *
 * @author kury
 */
class tool {

    /** @var int unique id for this annotation */
    public $id = 0;

    /** @var int contextid for this annotation */
    public $contextid = 0;

    /** @var int axis for this annotation */
    public $axis = 0;

    /** @var int type */
    public $type = null;

    /** @var strClass type */
    public $typeObject = null;

    /** @var string colors used */
    public $colors = '';

    /** @var string cartridge for drawing the annotation. */
    public $cartridge = '';

    /** @var string colors used */
    public $cartridge_color = '';

    /** @var string texts for this annotation. */
    public $texts = '';

    /** @var array texts for this annotation. */
    public $textsarray = '';

    /** @var string label of this annotation */
    public $label = '';

    /** @var boolean, allow reply or not */
    public $reply = 0;

    /** @var boolean, if tool is actived or not */
    public $enabled = 1;

    /** @var int order_tool, order in toolbar */
    public $order_tool = 1000;

    /**  @var boolean, can be removed or not */
    public $removable = false;

    /**  @var string, button class, which will a graphic representation  */
    public $button = "";

    /**  @var string, html style which will a graphic representation  */
    public $style = "";

    /**  @var string, html class which will a graphic representation  */
    public $displayClass = "";

    /**
     * Convert a compatible stdClass into an instance of this class.
     * @param stdClass $record
     */
    public function __construct(\stdClass $record = null) {
        if ($record) {
            $intcols = array('reply');
            foreach ($this as $key => $value) {
                if (isset($record->$key)) {
                    if (in_array($key, $intcols)) {
                        $this->$key = intval($record->$key);
                    } else {
                        $this->$key = $record->$key;
                    }
                }
            }
        }
    }

    /**
     * Initialize a minimal tool
     * @param array $parameters Optionals parameters to initialize a tool
     */
    public function init($parameters) {
        $this->contextid = isset($parameters['contextid']) ? $parameters['contextid'] : 0;
        $this->enabled = true;
        $this->axis = isset($parameters['axeid']) ? $parameters['axeid'] : 0;
        $this->removable = true;
        $this->label = isset($parameters['label']) ? $parameters['label'] : "";
    }

    /**
     * Get text proposals and transform it into an array
     * @return \assignfeedback_editpdfplus\stdClass
     */
    public function initToolTextsArray() {
        if (!$this->texts) {
            $this->textsarray = null;
        } else {
            $tooltextsarray = explode("\",\"", $this->texts);
            $compteur = 0;
            $result = array();
            foreach ($tooltextsarray as $value) {
                if (!$value || $value == '"') {
                    continue;
                }
                $obj = new \stdClass();
                $obj->text = $value;
                if (substr($obj->text, 0, 1) == '"') {
                    $obj->text = substr($obj->text, 1);
                }
                if (substr($obj->text, -1) == '"') {
                    $obj->text = substr($obj->text, 0, -1);
                }
                $obj->index = $compteur;
                $result[] = $obj;
                $compteur++;
            }

            $this->textsarray = $result;
        }
    }

    /**
     * Set Style and replace label with format symbol for display purpose
     */
    public function setDesign() {
        $this->label = $this->getButtonLabel();
        $this->style = $this->getStyleButton();
    }

    /**
     * Calculate a label with format symbol, according to its type
     * @return string
     */
    private function getButtonLabel() {
        if ($this->type == "4") {
            return '| ' . $this->label . ' |';
        }
        if ($this->type == "5") {
            return '| ' . $this->label;
        }
        return $this->label;
    }

    /**
     * Calculate a sytle for a display in a button, according to its type
     * @return string
     */
    private function getStyleButton() {
        $styleTmp = "";
        if ($this->enabled == "0") {
            $styleTmp .= "background-image:none;background-color:#CCCCCC;";
        }
        if ($this->type == "4" || $this->type == "1") {
            $styleTmp .= "text-decoration: underline;";
        }
        return $styleTmp;
    }

    /**
     * Get elements (display label, parameters) to render a button in HTML
     * @param bool $disabled if the button must be disabled
     * @return array
     */
    public function getRendererBoutonHTMLDisplay($disabled = false) {
        $iconhtml = $this->getButtonLabel();
        $tooltiptext = get_string('typetool_' . $this->typeObject->label, 'assignfeedback_editpdfplus');
        $iconhtml .= "<span class='assignfeedback_editpdfplus_tooltiptext'>" . $tooltiptext . "</span>";
        if (!$this->typeObject) {
            return array(
                'content' => $iconhtml,
                'parameters' => null
            );
        }
        $datatool = $this->typeObject->label;
        $iconparams = array('data-tool' => $datatool,
            'class' => $this->typeObject->label . ' costumtoolbarbutton btn btn-light',
            'id' => 'ctbutton' . $this->id,
            'type' => 'button',
            'style' => $this->getStyleButton());
        if ($disabled) {
            $iconparams['disabled'] = 'true';
        }
        return array(
            'content' => $iconhtml,
            'parameters' => $iconparams
        );
    }

}
