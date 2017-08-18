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
    'core/ajax', 'core/str', /*'mod_assign/grading_form_change_checker'*/
    'assignfeedback_editpdfplus/annotation', 'assignfeedback_editpdfplus/annotationhighlightplus',
    'assignfeedback_editpdfplus/annotationstampplus', 'assignfeedback_editpdfplus/annotationframe',
    'assignfeedback_editpdfplus/annotationcommentplus', 'assignfeedback_editpdfplus/annotationverticalline',
    'assignfeedback_editpdfplus/annotationstampcomment'],
        function ($/*, Y*/, notification, templates, fragment, ajax, str,
                Annotation, AnnotationHighlightplus, AnnotationStampplus, AnnotationFrame,
                AnnotationCommentplus, AnnotationVerticalline, AnnotationStampcomment /*, checker*/) {

            var contextid = null;
            var currentTool = null;
            var action = null;
            var typetools = null;
            /**
             * AdminPanel class.
             *
             * @class AdminPanel
             */
            var AdminPanel = function (contextidP, typetoolsP) {
                //this.registerEventListeners();
                contextid = contextidP;
                typetools = JSON.parse(typetoolsP);
                this.init();
            };
            var annotationcurrent = null;
            //messages
            AdminPanel.messageDelOk = "";
            AdminPanel.messageDelKo = "";
            AdminPanel.messageko = "";
            AdminPanel.messageaddok = "";
            AdminPanel.messageaddlibelleko = "";
            AdminPanel.messageEditOk = "";
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
                    if (canBeDelete) {
                        if (parseInt(canBeDelete) > 0) {
                            $("#assignfeedback_editpdfplus_widget_admin_button_delaxis").addClass("disabled");
                        } else {
                            $("#assignfeedback_editpdfplus_widget_admin_button_delaxis").removeClass("disabled");
                        }
                    } else {
                        $("#editpdlplus_axes option[value='" + selectAxis + "']").data('delete', 0);
                        $("#assignfeedback_editpdfplus_widget_admin_button_delaxis").removeClass("disabled");
                    }
                    $('#toolworkspace').html("");
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

                $(".btn-primary").click();

                $(".btnimport").on('click', this.importAxis);

                initMessages();
            };
            //init message
            var initMessages = function () {
                str.get_string('admindeltool_messageok', 'assignfeedback_editpdfplus').done(function (message) {
                    AdminPanel.messageDelOk = message;
                }).fail(notification.exception);
                str.get_string('admindeltool_messageko', 'assignfeedback_editpdfplus').done(function (message) {
                    AdminPanel.messageDelKo = message;
                }).fail(notification.exception);
                str.get_string('adminaddtool_messageok', 'assignfeedback_editpdfplus').done(function (message) {
                    AdminPanel.messageaddok = message;
                }).fail(notification.exception);
                str.get_string('admin_messageko', 'assignfeedback_editpdfplus').done(function (message) {
                    AdminPanel.messageko = message;
                }).fail(notification.exception);
                str.get_string('adminedittool_messageok', 'assignfeedback_editpdfplus').done(function (message) {
                    AdminPanel.messageEditOk = message;
                }).fail(notification.exception);
                str.get_string('adminaddtool_messagelibelleko', 'assignfeedback_editpdfplus').done(function (message) {
                    AdminPanel.messageaddlibelleko = message;
                }).fail(notification.exception);
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
            AdminPanel.prototype.refreshPrevisu = function () {
                currentTool.typetool = $("#typetool").val();
                currentTool.color = $("#color").val();
                currentTool.libelle = $("#libelle").val();
                currentTool.catridgecolor = $("#cartridgecolor").val();
                var res = "";
                $("input[name^='text[']").each(function () {
                    if ($(this).val() && ($(this).val()).length > 0) {
                        res += '"' + $(this).val().replace(/"/g, "") + '",';
                    }
                });
                if (res.length > 0) {
                    $("#texts").val(res.substring(0, res.length - 1));
                }
                currentTool.texts = $("#texts").val();
                currentTool.button = $("#button").val();
                currentTool.enabled = $("#enabled").val();
                currentTool.reply = 0;
                if ($("#reply").is(':checked')) {
                    currentTool.reply = 1;
                }
                currentTool.order = $("#order").val();
                initCanevas();
                initToolDisplay();
            };
            //
            var getTypeTool = function (toolid) {
                for (var i = 0; i < typetools.length; i++) {
                    if (typetools[i].id == toolid) {
                        return typetools[i];
                    }
                }
            };
            var initToolDisplay = function () {
                var typetool = parseInt($("#typetool").val());
                var typetoolEntity = getTypeTool(typetool);
                var confCartridge = false;
                var confCartridgeColor = false;
                if (typetoolEntity.configurable_cartridge && parseInt(typetoolEntity.configurable_cartridge) === 0) {
                    $("#libelle").hide();
                    $("label[for='libelle']").hide();
                    confCartridge = true;
                } else {
                    $("#libelle").show();
                    $("label[for='libelle']").show();
                }
                if (typetoolEntity.configurable_cartridge_color && parseInt(typetoolEntity.configurable_cartridge_color) === 0) {
                    $("#cartridgecolor").hide();
                    $("label[for='cartridgecolor']").hide();
                    confCartridgeColor = true;
                } else {
                    $("#cartridgecolor").show();
                    $("label[for='cartridgecolor']").show();
                }
                if (confCartridge && confCartridgeColor) {
                    $("#collapse3").parent().hide();
                } else {
                    $("#collapse3").parent().show();
                }
                var confAnnotColor = false,
                        confAnnotTexts = false,
                        confAnnotReply = false;
                if (typetoolEntity.configurable_color && parseInt(typetoolEntity.configurable_color) === 0) {
                    $("#color").hide();
                    $("label[for='color']").hide();
                    confAnnotColor = true;
                } else {
                    $("#color").show();
                    $("label[for='color']").show();
                }
                if (typetoolEntity.configurable_texts && parseInt(typetoolEntity.configurable_texts) === 0) {
                    $(".textform").hide();
                    $("label[for='texts']").hide();
                    confAnnotTexts = true;
                } else {
                    $(".textform").show();
                    $("label[for='texts']").show();
                }
                if (typetoolEntity.configurable_question && parseInt(typetoolEntity.configurable_question) === 0) {
                    $("#reply").hide();
                    $("label[for='reply']").hide();
                    confAnnotReply = true;
                } else {
                    $("#reply").show();
                    $("label[for='reply']").show();
                }
                if (confAnnotColor && confAnnotReply && confAnnotTexts) {
                    $("#collapse4").parent().hide();
                } else {
                    $("#collapse4").parent().show();
                }
            };
            //
            var initCanevas = function () {
                $('#canevas').html("");
                annotationcurrent = null;
                var typetool = parseInt($("#typetool").val());
                if (typetool === 3 || typetool === 4 || typetool === 7) {
                    $('#canevas').css("background-image", "url(" + $("#map01").val() + ")");
                } else if (typetool === 1 || typetool === 6) {
                    $('#canevas').css("background-image", "url(" + $("#map02").val() + ")");
                } else if (typetool === 5) {
                    $('#canevas').css("background-image", "url(" + $("#map03").val() + ")");
                }
                if (typetool === 1) {
                    annotationcurrent = new AnnotationHighlightplus();
                } else if (typetool === 3) {
                    annotationcurrent = new AnnotationStampplus();
                } else if (typetool === 4) {
                    annotationcurrent = new AnnotationFrame();
                    var annotChild = new AnnotationFrame();
                } else if (typetool === 5) {
                    annotationcurrent = new AnnotationVerticalline();
                } else if (typetool === 6) {
                    annotationcurrent = new AnnotationStampcomment();
                } else if (typetool === 7) {
                    annotationcurrent = new AnnotationCommentplus();
                }
                if (annotationcurrent) {
                    var typetoolEntity = getTypeTool(typetool);
                    currentTool.reply = 0;
                    if ($("#reply").is(':checked')) {
                        currentTool.reply = 1;
                    }
                    annotationcurrent.initAdminDemo(currentTool, typetoolEntity);
                    annotationcurrent.draw($('#canevas'));
                    if (annotChild) {
                        annotChild.initChildAdminDemo(annotationcurrent);
                        annotChild.draw($('#canevas'));
                    }
                }
            };
            //
            AdminPanel.prototype.openDivAddAxis = function () {
                $("#message_edit_tool").hide();
                $("#axistool").hide();
                $('#assignfeedback_editpdfplus_widget_admin_div_addaxis').show();
                $('#assignfeedback_editpdfplus_widget_admin_div_addaxis > .panel-body').html("");
                $('#assignfeedback_editpdfplus_widget_admin_toolheader').hide();
                $('#assignfeedback_editpdfplus_widget_admin_toolworkspace').hide();
                $("#editpdlplus_axes").prop('disabled', 'disabled');
                var params = {};
                fragment.loadFragment('assignfeedback_editpdfplus', 'axisadd', contextid, params)
                        .done(function (html, js) {
                            templates.appendNodeContents('#assignfeedback_editpdfplus_widget_admin_div_addaxis > .panel-body',
                                    html, js);
                        }.bind(this)).fail(notification.exception);
            };
            //
            AdminPanel.prototype.openDivEditAxis = function () {
                $("#message_edit_tool").hide();
                $("#axistool").hide();
                $('#assignfeedback_editpdfplus_widget_admin_div_editaxis').show();
                $('#assignfeedback_editpdfplus_widget_admin_div_editaxis > .panel-body').html("");
                $('#assignfeedback_editpdfplus_widget_admin_toolheader').hide();
                $('#assignfeedback_editpdfplus_widget_admin_toolworkspace').hide();
                $("#editpdlplus_axes").prop('disabled', 'disabled');
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
                var canBeDelete = $("#editpdlplus_axes option:selected").data('delete');
                if (canBeDelete !== null && parseInt(canBeDelete) === 0) {
                    $("#message_edit_tool").hide();
                    $("#axistool").hide();
                    $('#assignfeedback_editpdfplus_widget_admin_div_delaxis').show();
                    $('#assignfeedback_editpdfplus_widget_admin_div_delaxis > .panel-body').html("");
                    $('#assignfeedback_editpdfplus_widget_admin_toolheader').hide();
                    $('#assignfeedback_editpdfplus_widget_admin_toolworkspace').hide();
                    $("#editpdlplus_axes").prop('disabled', 'disabled');
                    var axeid = $("#editpdlplus_axes option:selected").val();
                    var params = {axeid: axeid};
                    fragment.loadFragment('assignfeedback_editpdfplus', 'axisdel', contextid, params)
                            .done(function (html, js) {
                                templates.appendNodeContents('#assignfeedback_editpdfplus_widget_admin_div_delaxis > .panel-body',
                                        html, js);
                            }.bind(this)).fail(notification.exception);
                }
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
            AdminPanel.prototype.importAxis = function () {
                var axisimportid = $(this).data('axis');
                if (axisimportid && parseInt(axisimportid) > 0) {
                    $("#assignfeedback_editpdfplus_import_axis > div > input[name^='axeid']").val(axisimportid);
                    var form = $('#assignfeedback_editpdfplus_import_axis');
                    var data = form.serialize() + "&courseid=" + $("#courseid").val();
                    ajax.call([
                        {
                            methodname: 'assignfeedback_editpdfplus_submit_axis_import_form',
                            args: {jsonformdata: JSON.stringify(data)}
                        }
                    ])[0].done(function (toolbar) {
                        if (toolbar[0].message === "") {
                            //mise à jour du message
                            $("#message_import_axis").show();
                            $("#message_import_axis").html(AdminPanel.messageaddok);
                            $("#message_import_axis").addClass("alert-success");
                            $("#message_import_axis").removeClass("alert-danger");
                            $("#message_import_axis").removeClass("alert-warning");
                            $("#message_import_axis").fadeOut(5000);
                            //maj axe
                            var divAxis = "<div id='editpdlplus_toolbar_"
                                    + toolbar[0].axeid
                                    + "' class='btn-group toolbar' style='display: none;'></div>";
                            $('#editpdlplus_toolbars').append(divAxis);
                            var option = new Option(toolbar[0].axelabel, toolbar[0].axeid, true, true);
                            $("#editpdlplus_axes").append(option);
                            var axeOption = $("#editpdlplus_axes option[value='" + toolbar[0].axeid + "']");
                            axeOption.data('delete', 1);
                            var btr = $("#assignfeedback_editpdfplus_widget_admin_button_delaxis");
                            btr.addClass("disabled");
                            $('#editpdlplus_tool_item').html("");
                            //maj toolbar
                            if (toolbar[0].toolid && toolbar[0].toolid > 0) {
                                for (var i = 0; i < toolbar.length; i++) {
                                    var classButton = "btn-default";
                                    if (toolbar[i].enable !== 1) {
                                        classButton = "";
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
                            } else {
                                var axeid = toolbar[0].axeid;
                                var axeOption = $("#editpdlplus_axes option[value='" + axeid + "']");
                                axeOption.data('delete', 0);
                                var btr = $("#assignfeedback_editpdfplus_widget_admin_button_delaxis");
                                btr.removeClass("disabled");
                            }
                            $(".editpdlplus_tool").on("click", refreshToolView);
                            //maj visu
                            $("#editpdlplus_axes").change();
                            $("a[href^='#collapseadmin1'").click();
                        } else {
                            $("#message_import_axis").show();
                            $("#message_import_axis").html(toolbar[0].message);
                            $("#message_import_axis").addClass("alert-danger");
                            $("#message_import_axis").removeClass("alert-success");
                            $("#message_import_axis").fadeOut(5000);
                        }
                    }).fail(notification.exception);
                }
            };
            //
            var refreshToolView = function () {
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
                if (!currentTool || currentTool.id !== selectid) {
                    $("#message_edit_tool").hide();
                }
                //load proprieties
                $('#editpdlplus_tool_item').html("");
                var params = {toolid: selectid};
                //this.test();
                fragment.loadFragment('assignfeedback_editpdfplus', 'tooledit', contextid, params)
                        .done(function (html, js) {
                            fillResultAjax($('#editpdlplus_tool_item'), html, js)
                                    .done(function () {
                                        currentTool = new Object();
                                        currentTool.id = selectid;
                                        currentTool.typetool = $("#typetool").val();
                                        var typetoolEntity = getTypeTool(currentTool.typetool);
                                        var realcolor = $("#realcolor").val();
                                        if (realcolor.length > 0) {
                                            currentTool.color = $("#color").val();
                                        } else {
                                            $("#color").val(typetoolEntity.color);
                                            currentTool.color = null;
                                        }
                                        currentTool.libelle = $("#libelle").val();
                                        if ($("#realcartridgecolor").val().length > 0) {
                                            currentTool.catridgecolor = $("#cartridgecolor").val();
                                        } else {
                                            $("#cartridgecolor").val(typetoolEntity.cartridge_color);
                                            currentTool.catridgecolor = null;
                                        }
                                        currentTool.texts = $("#texts").val();
                                        currentTool.button = $("#button").val();
                                        currentTool.enabled = $("#enabled").val();
                                        currentTool.reply = $("#reply").val();
                                        currentTool.order = $("#order").val();
                                        $("#typetool").on("change", function () {
                                            currentTool.typetool = $("#typetool").val();
                                            var typetoolEntity = getTypeTool(currentTool.typetool);
                                            currentTool.color = typetoolEntity.color;
                                            currentTool.catridgecolor = typetoolEntity.cartridge_color;
                                            $("#color").val(currentTool.color);
                                            $("#cartridgecolor").val(currentTool.catridgecolor);
                                            initToolDisplay();
                                            initCanevas();
                                        });
                                        $("#toolFormSubmit").on("click", function () {
                                            var res = "";
                                            $("input[name^='text[']").each(function () {
                                                if ($(this).val() && ($(this).val()).length > 0) {
                                                    res += '"' + $(this).val().replace(/"/g, "") + '",';
                                                }
                                            });
                                            if (res.length > 0) {
                                                $("#texts").val(res.substring(0, res.length - 1));
                                            }
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
                                                    $("#message_edit_tool").show();
                                                    $("#message_edit_tool").html(AdminPanel.messageEditOk);
                                                    $("#message_edit_tool").addClass("alert-success");
                                                    $("#message_edit_tool").removeClass("alert-danger");
                                                    $("#message_edit_tool").removeClass("alert-warning");
                                                    //mise à jour bar d'outils
                                                    $("#editpdlplus_toolbar_" + toolbar[0].axeid).html("");
                                                    //var newtool = null;
                                                    for (var i = 0; i < toolbar.length; i++) {
                                                        var classButton = "btn-default";
                                                        if (toolbar[i].enable !== 1) {
                                                            classButton = "";
                                                        }
                                                        if (toolbar[i].toolid === toolbar[i].selecttool) {
                                                            classButton = "btn-primary";
                                                            //newtool = toolbar[i];
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
                                                    //AdminPanel.prototype.refreshPrevisu();
                                                    $("#editpdlplus_tool_" + toolbar[0].selecttool).click();
                                                    //refreshToolView();
                                                } else {
                                                    $("#message_edit_tool").show();
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
                                                    if (toolbar[0].message === "" || toolbar[0].message === "1") {
                                                        //mise à jour du message
                                                        $("#message_edit_tool").show();
                                                        $("#message_edit_tool").html(AdminPanel.messageDelOk);
                                                        $("#message_edit_tool").addClass("alert-success");
                                                        $("#message_edit_tool").removeClass("alert-danger");
                                                        $("#message_edit_tool").removeClass("alert-warning");
                                                        //mise à jour bar d'outils
                                                        $("#editpdlplus_toolbar_" + toolbar[0].axeid).html("");
                                                        if (parseInt(toolbar[0].toolid) > 0) {
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
                                                            var axeid = toolbar[0].axeid;
                                                            var axeOption = $("#editpdlplus_axes option[value='" + axeid + "']");
                                                            axeOption.data('delete', 0);
                                                            var btr = $("#assignfeedback_editpdfplus_widget_admin_button_delaxis");
                                                            btr.removeClass("disabled");
                                                        }
                                                        $('#toolworkspace').html("");
                                                    } else {
                                                        $("#message_edit_tool").show();
                                                        $("#message_edit_tool").html(toolbar[0].message);
                                                        $("#message_edit_tool").addClass("alert-danger");
                                                        $("#message_edit_tool").removeClass("alert-success");
                                                    }
                                                }).fail(notification.exception);
                                            }
                                        });
                                        $("#toolRefesh").on("click", function () {
                                            AdminPanel.prototype.refreshPrevisu();
                                        });
                                        //maj affichage previsu
                                        initCanevas();
                                        //maj tool worspkace
                                        initToolDisplay();
                                    }.bind(this)).fail(notification.exception);
                            //templates.appendNodeContents('#editpdlplus_tool_item', html, js).done(function () {
                            //alert("jdikdi");
                            //$(".editpdlplus_tool").on("click", this.refreshToolView);
                            //}.bind(this))/*.fail(notification.exception)*/;
                        }.bind(this)).fail(notification.exception);
            };
            //
            AdminPanel.prototype.openDivAddTool = function () {
                $("#message_edit_tool").hide();
                $('#editpdlplus_tool_item').html("");
                $('.btn-primary').addClass("btn-default");
                $('.editpdlplus_tool').removeClass("btn-primary");
                var axeid = $("#editpdlplus_axes option:selected").val();
                var params = {axisid: axeid};
                fragment.loadFragment('assignfeedback_editpdfplus', 'tooladd', contextid, params)
                        .done(function (html, js) {
                            fillResultAjax($('#editpdlplus_tool_item'), html, js)
                                    .done(function () {
                                        $("#canevas").hide();
                                        if (action === "clone") {
                                            $("#typetool").val(currentTool.typetool);
                                            $("#color").val(currentTool.color);
                                            $("#libelle").val(currentTool.libelle);
                                            $("#cartridgecolor").val(currentTool.catridgecolor);
                                            $("#texts").val(currentTool.texts);
                                            $("#button").val(currentTool.button);
                                            $("#enabled").val(currentTool.enabled);
                                            $("#reply").val(currentTool.reply);
                                            $("#order").val(currentTool.order);
                                            currentTool = new Object();
                                            action = null;
                                        } else {
                                            currentTool = new Object();
                                            $("#typetool").on("change", function () {
                                                currentTool.typetool = $("#typetool").val();
                                                var typetoolEntity = getTypeTool(currentTool.typetool);
                                                currentTool.color = typetoolEntity.color;
                                                currentTool.catridgecolor = typetoolEntity.cartridge_color;
                                                $("#color").val(currentTool.color);
                                                $("#cartridgecolor").val(currentTool.catridgecolor);
                                                initToolDisplay();
                                            });
                                            $("#typetool").change();
                                        }
                                        $("#toolFormSubmit").on("click", function () {
                                            if ($("#button").val() === "") {
                                                //mise à jour du message
                                                $("#message_edit_tool").show();
                                                $("#message_edit_tool").html(AdminPanel.messageaddlibelleko);
                                                $("#message_edit_tool").addClass("alert-warning");
                                                $("#message_edit_tool").removeClass("alert-danger");
                                                $("#message_edit_tool").removeClass("alert-success");
                                            } else {
                                                var res = "";
                                                $("input[name^='text[']").each(function () {
                                                    if ($(this).val() && ($(this).val()).length > 0) {
                                                        res += '"' + $(this).val().replace(/"/g, "") + '",';
                                                    }
                                                });
                                                if (res.length > 0) {
                                                    $("#texts").val(res.substring(0, res.length - 1));
                                                }
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
                                                        $("#message_edit_tool").show();
                                                        $("#message_edit_tool").html(AdminPanel.messageaddok);
                                                        $("#message_edit_tool").addClass("alert-success");
                                                        $("#message_edit_tool").removeClass("alert-danger");
                                                        $("#message_edit_tool").removeClass("alert-warning");
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
                                                        var axeid = toolbar[0].axeid;
                                                        var axeOption = $("#editpdlplus_axes option[value='" + axeid + "']");
                                                        axeOption.data('delete', 1);
                                                        var delAxBt = $("#assignfeedback_editpdfplus_widget_admin_button_delaxis");
                                                        delAxBt.addClass("disabled");
                                                    } else {
                                                        $("#message_edit_tool").show();
                                                        $("#message_edit_tool").html(toolbar[0].message);
                                                        $("#message_edit_tool").addClass("alert-danger");
                                                        $("#message_edit_tool").removeClass("alert-success");
                                                    }
                                                }).fail(notification.exception);
                                            }
                                        });
                                    }.bind(this)).fail(notification.exception);
                        }.bind(this)).fail(notification.exception);
            };
            return AdminPanel;
        });