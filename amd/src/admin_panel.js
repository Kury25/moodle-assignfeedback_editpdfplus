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
/*
 * @package    assignfeedback_editpdfplus
 * @copyright  2017 Université de Lausanne
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * @module mod_assignfeedback_editpdfplus/admin_panel
 */
define(['jquery'/*, 'core/yui'*/, 'core/notification', 'core/templates', 'core/fragment'/*,
 'core/ajax', 'core/str', 'mod_assign/grading_form_change_checker'*/],
        function ($/*, Y*/, notification, templates, fragment/*, ajax, str, checker*/) {

            var contextid = null;

            /**
             * AdminPanel class.
             *
             * @class AdminPanel
             */
            var AdminPanel = function (contextidP) {
                //this.registerEventListeners();
                this.init();
                contextid = contextidP;
            };
            //
            //AdminPanel.prototype.contextid;
            //
            AdminPanel.prototype.selectTool = null;
            //
            AdminPanel.prototype.init = function () {
                var selectAxis = $("#editpdlplus_axes").val();
                $("#editpdlplus_toolbar_" + selectAxis).show();

                $("#editpdlplus_axes").on("change", function () {
                    $(".toolbar").hide();
                    var selectAxis = $("#editpdlplus_axes").val();
                    $("#editpdlplus_toolbar_" + selectAxis).show();
                });
//
                $(".editpdlplus_tool").on("click", function () {
                    var selectid = $(this).val();
                    $(".editpdlplus_tool").each(function () {
                        $(this).removeClass("btn-primary");
                        $(this).removeClass("btn-default");
                        var enabled = $(this).data('enable');
                        if (enabled === 1 && $(this).val() !== selectid) {
                            $(this).addClass("btn-default");
                        }
                    });
                    $(this).addClass("btn-primary");
                });
                this.selectTool = $(".editpdlplus_tool").first();
                this.initTool();
                $("#assignfeedback_editpdfplus_widget_admin_button_addaxis").on("click", this.openDivAddAxis);
                $("#assignfeedback_editpdfplus_widget_admin_button_editaxis").on("click", this.openDivEditAxis);
            };
            //
            AdminPanel.prototype.initTool = function () {
                $(this.selectTool).removeClass("btn-default");
                $(this.selectTool).addClass("btn-primary");
            };
            //
            AdminPanel.prototype.openDivAddAxis = function () {
                $("#axistool").hide();
                $('#assignfeedback_editpdfplus_widget_admin_div_addaxis').show();
                $('#assignfeedback_editpdfplus_widget_admin_div_addaxis > .panel-body').html("");
                var params = {};
                fragment.loadFragment('assignfeedback_editpdfplus', 'axisadd', contextid, params)
                        .done(function (html, js) {
                            templates.appendNodeContents('#assignfeedback_editpdfplus_widget_admin_div_addaxis > .panel-body',
                                    html, js);
                        }.bind(this)).fail(notification.exception);
            };
            //
            AdminPanel.prototype.openDivEditAxis = function () {
                $("#axistool").hide();
                $('#assignfeedback_editpdfplus_widget_admin_div_editaxis').show();
                $('#assignfeedback_editpdfplus_widget_admin_div_editaxis > .panel-body').html("");
                /*var context = {name: 'Tweety bird', intelligence: 2};
                 templates.render('assignfeedback_editpdfplus/admin_axis_add', context)
                 // It returns a promise that needs to be resoved.
                 .then(function (html, js) {
                 // Here eventually I have my compiled template, and any javascript that it generated.
                 // The templates object has append, prepend and replace functions.
                 templates.appendNodeContents('#assignfeedback_editpdfplus_widget_admin_div_editaxis > .panel-body',
                 html, js);
                 }).fail(notification.exception);*/
                var axeid = $("#editpdlplus_axes option:selected").val();
                var params = {axeid: axeid};
                fragment.loadFragment('assignfeedback_editpdfplus', 'axisedit', contextid, params)
                        .done(function (html, js) {
                            templates.appendNodeContents('#assignfeedback_editpdfplus_widget_admin_div_editaxis > .panel-body',
                                    html, js);
                        }.bind(this)).fail(notification.exception);
            };
            return AdminPanel;

        });