<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace assignfeedback_editpdfplus;

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
    public $type = 0;

    /** @var string colors used */
    public $colors = '';

    /** @var string cartridge for drawing the annotation. */
    public $cartridge = '';
    
    /** @var string colors used */
    public $cartridge_color = '';

    /** @var string texts for this annotation. */
    public $texts = '';
    
    /** @var string label of this annotation */
    public $label = '';

    /** @var boolean, allow reply or not */
    public $reply = 0;

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
