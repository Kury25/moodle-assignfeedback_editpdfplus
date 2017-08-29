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
class tool_form extends moodleform {

    protected function definition() {
        $mform = $this->_form;
        $mform->addElement('text', 'colors', 'Couleur'); // Add elements to your form
        $mform->setType('label', PARAM_TEXT);                   //Set type of element
        $mform->addElement('hidden', 'toolid', ''); // Add elements to your form
        $mform->setType('hidden', PARAM_INT);                   //Set type of element
    }

    //Custom validation should be added here
    function validation($data, $files) {
        return array();
    }

}
