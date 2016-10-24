<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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
