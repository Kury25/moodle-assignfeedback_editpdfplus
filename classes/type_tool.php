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

namespace assignfeedback_editpdfplus;

/**
 * Description of type_tool
 *
 * @author kury
 */
class type_tool {

    /** @var int unique id for this annotation */
    public $id = 0;

    /** @var int contextid for this annotation */
    public $contextid = 0;

    /** @var string label of this annotation */
    public $label = '';

    /** @var string colors used */
    public $color = '';

    /** @var string colors used */
    public $cartridge_color = '';

    /** @var int starting location of cartridge in pixels. Image resolution is 100 pixels per inch */
    public $cartridge_x = 0;

    /** @var int ending location of cartridge in pixels. Image resolution is 100 pixels per inch */
    public $cartridge_y = 0;

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

}
