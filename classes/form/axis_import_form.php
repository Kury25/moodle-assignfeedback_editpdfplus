<?php

/**
 * 
 *
 * @package    assignfeedback_editpdfplus
 * @copyright  2017 Université de Lausanne
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace assignfeedback_editpdfplus\form;

require_once("$CFG->libdir/formslib.php");

use moodleform;

/**
 * Description of formslib
 *
 * @author kury
 */
class axis_import_form extends moodleform {

    protected function definition() {
        global $CFG;

        $mform = $this->_form;
        $mform->addElement('hidden', 'axeid', '');
        $mform->setType('axeid', PARAM_INTEGER);           
    }

    //Custom validation should be added here
    function validation($data, $files) {
        return array();
    }

}
