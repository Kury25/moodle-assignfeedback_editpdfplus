// Standard license block omitted.
/*
 * @package    assignfeedback_editpdfplus
 * @copyright  2015 Someone cool
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * @module mod_assignfeedback_editpdfplus/editplus
 */
define(['jquery'], function ($) {
    /**
     * @constructor
     * @alias module:mod_assignfeedback_editpdfplus/editplus
     */
    var greeting = function () {
        /** @access private */
        //var privateThoughts = 'I like the colour blue';
        $("#id").val();
        /** @access public */
        this.publicThoughts = 'I like the colour orange';

    };
    /**
     * A formal greeting.
     * @access public
     * @return {string}
     */
    greeting.prototype.formal = function () {
        return 'How do you do?';
    };
    /**
     * An informal greeting.
     * @access public
     * @return {string}
     */
    greeting.prototype.informal = function () {
        return 'Wassup!';
    };
    return {
        init: function () {
            alert("hello");
        }
    };

});