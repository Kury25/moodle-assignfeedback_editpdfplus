// Standard license block omitted.
/*
 * @module     assignfeedback_editpdfplus/toolbar
 * @package    assignfeedback_editpdfplus
 * @copyright  2015 Someone cool
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

define(['jquery', 'jqueryui', 'core/notification'], function ($, nn, notification) {

    var manager = {
        setup: function () {
            $(document).ready(function () {

                setTimeout(function () {

                    //var basicControls = ["#print", "#bold", "#italic", "#undo", "#redo"];
                    $("#redo").button({
                        "icon": "ui-icon-arrowreturnthick-1-e",
                        "showLabel": false,
                        "option": "disabled"
                    });
                    $("#undo").button({
                        "icon": "ui-icon-arrowreturnthick-1-w",
                        "showLabel": false
                    });
                    //$( ".toolbar" ).controlgroup();
                    notification.alert("fin");

                }, 2000);


            });
        }
    };

    require(['jquery', "jqueryui"], function ($) {
        $("#undo").addClass('ui-button');
    });

    return {
        setup: manager.setup
    };

});