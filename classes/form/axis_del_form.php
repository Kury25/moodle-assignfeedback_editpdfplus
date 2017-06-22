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
class axis_del_form extends moodleform {

    protected function definition() {

        $mform = $this->_form;
        $mform->addElement('hidden', 'label', ''); // Add elements to your form
        $mform->setType('hidden', PARAM_TEXT);                   //Set type of element
        $mform->addElement('hidden', 'axeid', ''); // Add elements to your form
        $mform->setType('hidden', PARAM_INT);                   //Set type of element
        
        /*$buttonarray[] = &$mform->createElement('submit', 'submitbutton', 'Enregistrer');
        $mform->addGroup($buttonarray, 'buttonar', '', array(' '), false);
        $mform->closeHeaderBefore('buttonar');*/
        
        //$this->add_action_buttons();
    }

    //Custom validation should be added here
    function validation($data, $files) {
        return array();
    }

}
