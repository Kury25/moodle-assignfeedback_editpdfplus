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
define(['jquery'/*, 'core/yui'*/, 'core/notification', 'core/templates', 'core/fragment',
    'core/ajax', 'core/str'/*, 'mod_assign/grading_form_change_checker'*/],
        function ($/*, Y*/, notification, templates, fragment, ajax, str /*, checker*/) {

            var contextid = null;
            var currentTool = null;
            var action = null;
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
                $("#editpdlplus_axes").on("change", function () {
                    $(".toolbar").hide();
                    var selectAxis = $("#editpdlplus_axes").val();
                    $("#editpdlplus_toolbar_" + selectAxis).show();
                    var canBeDelete = $("#editpdlplus_axes option:selected").data('delete');
                    if (canBeDelete && parseInt(canBeDelete) > 0) {
                        $("#assignfeedback_editpdfplus_widget_admin_button_delaxis").addClass("disabled");
                    } else {
                        $("#assignfeedback_editpdfplus_widget_admin_button_delaxis").removeClass("disabled");
                    }
                });
                $("#editpdlplus_axes").change();
//
                $(".editpdlplus_tool").on("click", refreshToolView);
                this.selectTool = $(".editpdlplus_tool").first();
                this.initTool();
                $("#assignfeedback_editpdfplus_widget_admin_button_addaxis").on("click", this.openDivAddAxis);
                $("#assignfeedback_editpdfplus_widget_admin_button_editaxis").on("click", this.openDivEditAxis);
                $("#assignfeedback_editpdfplus_widget_admin_button_delaxis").on("click", this.openDivDelAxis);
                $("#assignfeedback_editpdfplus_widget_admin_button_addtool").on("click", this.openDivAddTool);
            };
            //
            AdminPanel.prototype.test = function () {
                alert("test");
                refreshToolView();
            };
            //
            AdminPanel.prototype.initTool = function () {
                $(this.selectTool).removeClass("btn-default");
                $(this.selectTool).addClass("btn-primary");
            };
            //
            AdminPanel.prototype.initCanevas = function () {
                var typetool = parseInt($("#typetool").val());
                if (typetool === 3 || typetool === 4 || typetool === 7) {
                    $('#canevas').css("background-image", "url(" + $("#map01").val() + ")");
                } else if (typetool === 1 || typetool === 6) {
                    $('#canevas').css("background-image", "url(" + $("#map02").val() + ")");
                } else if (typetool === 5) {
                    $('#canevas').css("background-image", "url(" + $("#map03").val() + ")");
                }
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
            //
            AdminPanel.prototype.openDivDelAxis = function () {
                $("#axistool").hide();
                $('#assignfeedback_editpdfplus_widget_admin_div_delaxis').show();
                $('#assignfeedback_editpdfplus_widget_admin_div_delaxis > .panel-body').html("");
                var axeid = $("#editpdlplus_axes option:selected").val();
                var params = {axeid: axeid};
                fragment.loadFragment('assignfeedback_editpdfplus', 'axisdel', contextid, params)
                        .done(function (html, js) {
                            templates.appendNodeContents('#assignfeedback_editpdfplus_widget_admin_div_delaxis > .panel-body',
                                    html, js);
                        }.bind(this)).fail(notification.exception);
            };
            /**
             * Fade the dom node out, update it, and fade it back.
             *
             * @private
             * @method _hello
             * @param {JQuery} node
             * @param {String} html
             * @param {String} js
             * @return {Deferred} promise resolved when the animations are complete.
             */
            var fillResultAjax = function (node, html, js) {
                //alert("tutu");
                //alert(html+js);
                var promise = $.Deferred();
                node.fadeOut("fast", function () {
                    templates.replaceNodeContents(node, html, js);
                    node.fadeIn("fast", function () {
                        promise.resolve();
                    });
                });
                return promise.promise();
                //return true;
            };
            //
            var refreshToolView = function () {
                var messageok = str.get_string('admindeltool_messageok', 'assignfeedback_editpdfplus');
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
                //load proprieties
                $('#editpdlplus_tool_item').html("");
                var params = {toolid: selectid};
                //this.test();
                fragment.loadFragment('assignfeedback_editpdfplus', 'tooledit', contextid, params)
                        .done(function (html, js) {
                            fillResultAjax($('#editpdlplus_tool_item'), html, js)
                                    .done(function () {
                                        $("#toolFormSubmit").on("click", function () {
                                            var form = $('#assignfeedback_editpdfplus_edit_tool');
                                            var data = form.serialize();
                                            ajax.call([
                                                {
                                                    methodname: 'assignfeedback_editpdfplus_submit_tool_edit_form',
                                                    args: {jsonformdata: JSON.stringify(data)}
                                                }
                                            ])[0].done(function (toolbar) {
                                                if (toolbar[0].message === "") {
                                                    //mise à jour du message
                                                    $("#message_edit_tool").html("Modifications enregistrées");
                                                    $("#message_edit_tool").addClass("alert-success");
                                                    $("#message_edit_tool").removeClass("alert-danger");
                                                    //mise à jour bar d'outils
                                                    $("#editpdlplus_toolbar_" + toolbar[0].axeid).html("");
                                                    for (var i = 0; i < toolbar.length; i++) {
                                                        var classButton = "btn-default";
                                                        if (toolbar[i].enable !== 1) {
                                                            classButton = "";
                                                        }
                                                        if (toolbar[i].toolid === toolbar[i].selecttool) {
                                                            classButton = "btn-primary";
                                                        }
                                                        var style = "";
                                                        if (toolbar[i].typetool === 4 || toolbar[i].typetool === 1) {
                                                            style = "text-decoration: underline;";
                                                        }
                                                        var label = toolbar[i].button;
                                                        if (toolbar[i].typetool === 4 || toolbar[i].typetool === 5) {
                                                            label = "| " + label;
                                                            if (toolbar[i].typetool === 4) {
                                                                label += " |";
                                                            }
                                                        }
                                                        var buttonTmp = "<button class='btn "
                                                                + classButton
                                                                + " editpdlplus_tool' id='editpdlplus_tool_"
                                                                + toolbar[i].toolid + "' style='"
                                                                + style
                                                                + "' value='"
                                                                + toolbar[i].toolid
                                                                + "' data-enable='"
                                                                + toolbar[i].enable + "'>"
                                                                + label
                                                                + "</button>";
                                                        $("#editpdlplus_toolbar_" + toolbar[0].axeid).append(buttonTmp);
                                                    }
                                                    $(".editpdlplus_tool").on("click", refreshToolView);
                                                } else {
                                                    $("#message_edit_tool").html(toolbar[0].message);
                                                    $("#message_edit_tool").addClass("alert-danger");
                                                    $("#message_edit_tool").removeClass("alert-success");
                                                }
                                            }).fail(notification.exception);
                                        });
                                        $("#toolEnabled").on("click", function () {
                                            var enabled = $("#toolenabled").val();
                                            if (enabled == 1) {
                                                $("#toolEnabled > i").addClass("fa-eye-slash");
                                                $("#toolEnabled > i").removeClass("fa-eye");
                                                $("#toolenabled").val(0);
                                            } else {
                                                $("#toolEnabled > i").addClass("fa-eye");
                                                $("#toolEnabled > i").removeClass("fa-eye-slash");
                                                $("#toolenabled").val(1);
                                            }
                                            $("#toolFormSubmit").click();
                                        });
                                        $("#toolClone").on("click", function () {
                                            action = "clone";
                                            currentTool = new Object();
                                            currentTool.typetool = $("#typetool").val();
                                            currentTool.color = $("#color").val();
                                            currentTool.libelle = $("#libelle").val();
                                            currentTool.catridgecolor = $("#catridgecolor").val();
                                            currentTool.texts = $("#texts").val();
                                            currentTool.button = $("#button").val();
                                            currentTool.enabled = $("#enabled").val();
                                            currentTool.reply = $("#reply").val();
                                            currentTool.order = $("#order").val();
                                            $("#assignfeedback_editpdfplus_widget_admin_button_addtool").click();
                                        });
                                        $("#toolRemove").on("click", function () {
                                            if (!$(this).hasClass("disabled")) {
                                                var form = $('#assignfeedback_editpdfplus_edit_tool');
                                                var data = form.serialize();
                                                ajax.call([
                                                    {
                                                        methodname: 'assignfeedback_editpdfplus_submit_tool_del_form',
                                                        args: {jsonformdata: JSON.stringify(data)}
                                                    }
                                                ])[0].done(function (toolbar) {
                                                    if (toolbar[0].message === "") {
                                                        //mise à jour du message
                                                        $("#message_edit_tool").html(messageok);
                                                        $("#message_edit_tool").addClass("alert-success");
                                                        $("#message_edit_tool").removeClass("alert-danger");
                                                        //mise à jour bar d'outils
                                                        $("#editpdlplus_toolbar_" + toolbar[0].axeid).html("");
                                                        for (var i = 0; i < toolbar.length; i++) {
                                                            var classButton = "btn-default";
                                                            if (toolbar[i].enable !== 1) {
                                                                classButton = "";
                                                            }
                                                            if (toolbar[i].toolid === toolbar[i].selecttool) {
                                                                classButton = "btn-primary";
                                                            }
                                                            var style = "";
                                                            if (toolbar[i].typetool === 4 || toolbar[i].typetool === 1) {
                                                                style = "text-decoration: underline;";
                                                            }
                                                            var label = toolbar[i].button;
                                                            if (toolbar[i].typetool === 4 || toolbar[i].typetool === 5) {
                                                                label = "| " + label;
                                                                if (toolbar[i].typetool === 4) {
                                                                    label += " |";
                                                                }
                                                            }
                                                            var buttonTmp = "<button class='btn "
                                                                    + classButton
                                                                    + " editpdlplus_tool' id='editpdlplus_tool_"
                                                                    + toolbar[i].toolid + "' style='"
                                                                    + style
                                                                    + "' value='"
                                                                    + toolbar[i].toolid
                                                                    + "' data-enable='"
                                                                    + toolbar[i].enable + "'>"
                                                                    + label
                                                                    + "</button>";
                                                            $("#editpdlplus_toolbar_" + toolbar[0].axeid).append(buttonTmp);
                                                        }
                                                        $(".editpdlplus_tool").on("click", refreshToolView);
                                                        $('#toolworkspace').html("");
                                                    } else {
                                                        $("#message_edit_tool").html(toolbar[0].message);
                                                        $("#message_edit_tool").addClass("alert-danger");
                                                        $("#message_edit_tool").removeClass("alert-success");
                                                    }
                                                }).fail(notification.exception);
                                            }
                                        });
                                        //maj affichage previsu
                                        //this.initCanevas();
                                        var typetool = parseInt($("#typetool").val());
                                        if (typetool === 3 || typetool === 4 || typetool === 7) {
                                            $('#canevas').css("background-image", "url(" + $("#map01").val() + ")");
                                        } else if (typetool === 1 || typetool === 6) {
                                            $('#canevas').css("background-image", "url(" + $("#map02").val() + ")");
                                        } else if (typetool === 5) {
                                            $('#canevas').css("background-image", "url(" + $("#map03").val() + ")");
                                        }
                                    }.bind(this)).fail(notification.exception);
                            //templates.appendNodeContents('#editpdlplus_tool_item', html, js).done(function () {
                            //alert("jdikdi");
                            //$(".editpdlplus_tool").on("click", this.refreshToolView);
                            //}.bind(this))/*.fail(notification.exception)*/;
                        }.bind(this)).fail(notification.exception);
            };
            //
            AdminPanel.prototype.openDivAddTool = function () {
                var messageok = str.get_string('adminaddtool_messageok', 'assignfeedback_editpdfplus');
                $('#editpdlplus_tool_item').html("");
                $('.btn-primary').addClass("btn-default");
                $('.editpdlplus_tool').removeClass("btn-primary");
                var axeid = $("#editpdlplus_axes option:selected").val();
                var params = {axisid: axeid};
                fragment.loadFragment('assignfeedback_editpdfplus', 'tooladd', contextid, params)
                        .done(function (html, js) {
                            fillResultAjax($('#editpdlplus_tool_item'), html, js)
                                    .done(function () {
                                        if (action === "clone") {
                                            $("#typetool").val(currentTool.typetool);
                                            $("#color").val(currentTool.color);
                                            $("#libelle").val(currentTool.libelle);
                                            $("#catridgecolor").val(currentTool.catridgecolor);
                                            $("#texts").val(currentTool.texts);
                                            $("#button").val(currentTool.button);
                                            $("#enabled").val(currentTool.enabled);
                                            $("#reply").val(currentTool.reply);
                                            $("#order").val(currentTool.order);
                                            currentTool = null;
                                            action = null;
                                        }
                                        $("#toolFormSubmit").on("click", function () {
                                            var form = $('#assignfeedback_editpdfplus_edit_tool');
                                            var data = form.serialize();
                                            ajax.call([
                                                {
                                                    methodname: 'assignfeedback_editpdfplus_submit_tool_add_form',
                                                    args: {jsonformdata: JSON.stringify(data)}
                                                }
                                            ])[0].done(function (toolbar) {
                                                if (toolbar[0].message === "") {
                                                    //mise à jour du message
                                                    $("#message_edit_tool").html(messageok);
                                                    $("#message_edit_tool").addClass("alert-success");
                                                    $("#message_edit_tool").removeClass("alert-danger");
                                                    //mise à jour bar d'outils
                                                    $("#editpdlplus_toolbar_" + toolbar[0].axeid).html("");
                                                    for (var i = 0; i < toolbar.length; i++) {
                                                        var classButton = "btn-default";
                                                        if (toolbar[i].enable !== 1) {
                                                            classButton = "";
                                                        }
                                                        if (toolbar[i].toolid === toolbar[i].selecttool) {
                                                            classButton = "btn-primary";
                                                        }
                                                        var style = "";
                                                        if (toolbar[i].typetool === 4 || toolbar[i].typetool === 1) {
                                                            style = "text-decoration: underline;";
                                                        }
                                                        var label = toolbar[i].button;
                                                        if (toolbar[i].typetool === 4 || toolbar[i].typetool === 5) {
                                                            label = "| " + label;
                                                            if (toolbar[i].typetool === 4) {
                                                                label += " |";
                                                            }
                                                        }
                                                        var buttonTmp = "<button class='btn "
                                                                + classButton
                                                                + " editpdlplus_tool' id='editpdlplus_tool_"
                                                                + toolbar[i].toolid + "' style='"
                                                                + style
                                                                + "' value='"
                                                                + toolbar[i].toolid
                                                                + "' data-enable='"
                                                                + toolbar[i].enable + "'>"
                                                                + label
                                                                + "</button>";
                                                        $("#editpdlplus_toolbar_" + toolbar[0].axeid).append(buttonTmp);
                                                    }
                                                    $(".editpdlplus_tool").on("click", refreshToolView);
                                                    $('#editpdlplus_tool_item').html("");
                                                } else {
                                                    $("#message_edit_tool").html(toolbar[0].message);
                                                    $("#message_edit_tool").addClass("alert-danger");
                                                    $("#message_edit_tool").removeClass("alert-success");
                                                }
                                            }).fail(notification.exception);
                                        });
                                    }.bind(this)).fail(notification.exception);
                        }.bind(this)).fail(notification.exception);
            };
            return AdminPanel;
        });