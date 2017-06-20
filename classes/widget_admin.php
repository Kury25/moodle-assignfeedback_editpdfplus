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

namespace assignfeedback_editpdfplus;

defined('MOODLE_INTERNAL') || die();

use renderable;
use templatable;

/**
 * This file contains the definition for the library class for edit PDF renderer.
 *
 * @package   assignfeedback_editpdfplus
 * @copyright  2016 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class widget_admin implements renderable, templatable {

    /** @var int $assignment - Assignment instance id */
    public $context = null;

    /** @var int $userid - The user id we are grading */
    public $course = null;

    /** @var int $userid - The user id we are grading */
    public $userid = 0;

    /** @var tool[] $toolbars */
    public $toolbars = array();

    /** @var axis[] $toolbars */
    public $axis = array();

    /**
     * Constructor
     * @param int $assignment - Assignment instance id
     * @param int $userid - The user id we are grading
     * @param int $attemptnumber - The attempt number we are grading
     * @param moodle_url $downloadurl - A url to download the current generated pdf.
     * @param string $downloadfilename - Name of the generated pdf.
     * @param string[] $stampfiles - The file names of the stamps.
     * @param bool $readonly - Show the readonly interface (no tools).
     * @param integer $pagetotal - The total number of pages.
     * @param tool[] $toolbars - the different tool to display
     * @param axis[] $axis - the different axis to display
     */
    public function __construct($context, $course, $userid, $toolbars, $axis) {
        $this->context = $context;
        $this->course = $course;
        $this->userid = $userid;
        $this->toolbars = $toolbars;
        $this->axis = $axis;
    }

    public function export_for_template(\renderer_base $output) {
        
    }

}
