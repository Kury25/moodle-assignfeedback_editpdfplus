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
 * @module mod_assignfeedback_editpdfplus/annotation
 */
define(['jquery', './global'],
        function ($, global) {
            // I am the internal, static counter for the number of models
            // that have been created in the system. This is used to
            // power the unique identifier of each instance.
            var instanceCount = 0;

            // I get the next instance ID.
            var getNewInstanceID = function () {
                // Precrement the instance count in order to generate the
                // next value instance ID.
                return(++instanceCount);
            };
            // I return an initialized object.
            /**
             * Annotation class.
             *
             * @class Annotation
             */
            function Annotation() {
                // Store the private instance id.
                this._instanceID = getNewInstanceID();
                $("#tutu").val();
                // Return this object reference.
                return(this);

            }
            // I return the current instance count. I am a static method
            // on the Model class.
            Annotation.getInstanceCount = function () {
                return(instanceCount);
            };
            Annotation.prototype.getInstanceID = function () {
                return(this._instanceID);
            };
            /*var Annotation = function () {
             };*/
            /**
             * X position
             * @property x
             * @type Int
             * @public
             */
            Annotation.x = 0;
            /**
             * Y position
             * @property y
             * @type Int
             * @public
             */
            Annotation.y = 0;
            /**
             * Ending x position
             * @property endx
             * @type Int
             * @public
             */
            Annotation.endx = 0;
            /**
             * Ending y position
             * @property endy
             * @type Int
             * @public
             */
            Annotation.endy = 0;
            /**
             * Path
             * @property path
             * @type String - list of points like x1,y1:x2,y2
             * @public
             */
            Annotation.path = '';
            /**
             * Tool.
             * @property toolid
             * @type Int
             * @public
             */
            Annotation.toolid = 0;
            /**
             * Annotation colour.
             * @property colour
             * @type String
             * @public
             */
            Annotation.colour = 'red';
            /**
             * Reference to M.assignfeedback_editpdfplus.tool
             * @property tooltype
             * @type M.assignfeedback_editpdfplus.tool
             * @public
             */
            Annotation.tooltype = null;
            /**
             * Reference to M.assignfeedback_editpdfplus.type_tool
             * @property tooltypefamille
             * @type M.assignfeedback_editpdfplus.type_tool
             * @public
             */
            Annotation.tooltypefamille = null;
            /**
             * id of the annotation in BDD.
             * @property id
             * @type Int
             * @public
             */
            Annotation.id = 0;
            /**
             * position x of the cartridge.
             * @property cartridgex
             * @type Int
             * @public
             */
            Annotation.cartridgex = 0;
            /**
             * position y of the cartridge.
             * @property cartridgey
             * @type Int
             * @public
             */
            Annotation.cartridgey = 0;
            Annotation.adminDemo = 0;
            Annotation.prototype.init = function (config) {
                this.cartridgex = parseInt(config.cartridgex, 10) || 0;
                this.cartridgey = parseInt(config.cartridgey, 10) || 0;
                this.colour = config.colour || 'red';
                this.tooltype = config.tooltype;
                this.id = config.id;
                this.x = parseInt(config.x, 10) || 0;
                this.y = parseInt(config.y, 10) || 0;
                this.endx = parseInt(config.endx, 10) || 0;
                this.endy = parseInt(config.endy, 10) || 0;
                this.path = config.path || '';
                this.toolid = config.toolid;
                this.tooltypefamille = this.editor.typetools[this.tooltype.type];
            };
            /**
             * Draw an annotation
             * @public
             * @method draw
             * @return M.assignfeedback_editpdfplus.drawable|false
             */
            Annotation.prototype.draw = function () {
                // Should be overridden by the subclass.
            };
            /**
             * Get the final color for the annotation
             * @return string
             * @protected
             */
            Annotation.prototype.get_color = function () {
                var color = global.ANNOTATIONCOLOUR[this.colour];
                if (!color) {
                    color = this.colour;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                return color;
            };
            /**
             * Get the final color for the cartridge
             * @return string
             * @protected
             */
            Annotation.prototype.get_color_cartridge = function () {
                var color = global.ANNOTATIONCOLOUR[this.tooltype.catridgecolor];
                if (!color) {
                    color = this.tooltype.catridgecolor;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                if (!color || color === '') {
                    return this.tooltypefamille.cartridge_color;
                }
                return color;
            };
            /**
             * Init the HTML id for the annotation
             * @protected
             */
            Annotation.prototype.init_div_cartridge_id = function () {
                var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
                if (this.tooltype.id) {
                    this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
                } else {
                    this.divcartridge = 'ct_' + this.id + '_' + date;
                }
            };
            /**
             * get the html node for the cartridge
             * @param {string} colorcartridge
             * @return node
             */
            Annotation.prototype.get_div_cartridge = function (colorcartridge, canevas) {
                var div = "<div ";
                div += "id='" + this.divcartridge + "' ";
                div += "class='assignfeedback_editpdfplus_cartridge' ";
                div += "style='border-color: " + colorcartridge + ";'> ";
                div += "</div>";
                if (canevas) {
                    canevas.append(div);
                }
                var divdisplay = $('#' + this.divcartridge);
                if (this.adminDemo < 1) {
                    //if (this.editor.get('readonly')) {
                    //    divdisplay.on('click', this.view_annot, this);
                    //}
                }
                return divdisplay;
            };
            /**
             * get the html node for the label cartridge
             * @param {string} colorcartridge
             * @param {boolean} draggable
             * @return node
             */
            Annotation.prototype.get_div_cartridge_label = function (colorcartridge, canevas/*, draggable*/) {
                var divcartridge = "<div ";
                divcartridge += "id='" + this.divcartridge + "_cartridge' ";
                divcartridge += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_cartridge' ";
                //if (this.editor.get('readonly') && this.get_valref() === '') {
                //divcartridge += "style='border-right:none;padding-right:0px;color:" + colorcartridge + ";' ";
                //} else {
                divcartridge += "style='border-right-color: " + colorcartridge + ";color:" + colorcartridge + ";' ";
                //}
                divcartridge += "> ";
                divcartridge += this.tooltype.libelle;
                divcartridge += "</div>";
                if (canevas) {
                    canevas.append(divcartridge);
                }
                var divcartridgedisplay = $('#' + this.divcartridge + "_cartridge");
                /*if (draggable && !this.editor.get('readonly')) {
                 divcartridgedisplay.on('mousedown', this.move_cartridge_begin, this);
                 return divcartridgedisplay;
                 }*/
                return divcartridgedisplay;
            };
            /**
             * get the html node for the textannot associated to the annotation
             * @param {string} colorcartridge
             * @return node
             */
            Annotation.prototype.get_div_input = function (colorcartridge, canevas) {
                var divinput = "<div ";
                divinput += "id='" + this.divcartridge + "_display' ";
                divinput += "style='color:" + colorcartridge + "; ";
                //if (this.editor.get('readonly') && this.get_valref() === '') {
                //    divinput += "padding:0px;";
                //}
                divinput += "'></div>";
                canevas.append(divinput);
                var divinputdisplay = $("#" + this.divcartridge + "_display");
                //if (!this.editor.get('readonly')) {
                divinputdisplay.on("click", {annotation: this}, this.edit_annot);
                //}
                return divinputdisplay;
            };
            /**
             * get the html node for the edition of comment and parameters
             * @return node
             */
            Annotation.prototype.get_div_edition = function (canevas) {
                var divedition = "<div ";
                divedition += "id='" + this.divcartridge + "_edit' ";
                divedition += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_edition' ";
                divedition += "style='display:none;'> ";
                divedition += "<textarea id='"
                        + this.divcartridge
                        + "_editinput' type='text'"
                        //value=\""
                        //+ this.get_valref()
                        + " class='form-control' style='margin-bottom:5px;'";
                if (this.adminDemo === 1) {
                    divedition += ' readonly';
                }
                divedition += ">"
                        //+ this.get_valref()
                        + "</textarea>";
                divedition += "</div>";
                if (canevas) {
                    canevas.append(divedition);
                }
                var diveditiondisplay = $("#" + this.divcartridge + "_edit");
                var propositions = this.tooltype.texts;
                if (propositions && propositions.length > 0) {
                    var divproposition = "<div id='" + this.divcartridge + "_edit_propositions'></div>";
                    diveditiondisplay.append(divproposition);
                    var divpropositiondisplay = $("#" + this.divcartridge + "_edit_propositions");
                    var propositionarray = propositions.split('","');
                    for (var i = 0; i < propositionarray.length; i++) {
                        var buttontmp = "<button class='btn btn-default";
                        if (this.adminDemo === 1) {
                            buttontmp += ' disabled';
                        }
                        buttontmp += "' type='button' style='width:100%;font-size: x-small;'>"
                                + propositionarray[i].replace('"', '')
                                + "</button>";
                        divpropositiondisplay.append(buttontmp);
                        if (this.adminDemo < 1) {
                            //buttontmpdisplay.on('click', this.fill_input_edition, this, propositionarray[i].replace('"', ''));
                        }
                        divpropositiondisplay.append("<br/>");
                    }
                }
                return diveditiondisplay;
            };
            /**
             * get the html node for the text annotation, tools and options
             * @param {string} colorcartridge
             * @return node
             */
            Annotation.prototype.get_div_container = function (colorcartridge, canevas) {
                var divconteneur = "<div ";
                divconteneur += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_conteneur' >";
                divconteneur += "</div>";
                if (canevas) {
                    canevas.append(divconteneur);
                }
                var divconteneurdisplay = $('.assignfeedback_editpdfplus_' + this.tooltypefamille.label + "_conteneur");
                var divinputdisplay = this.get_div_input(colorcartridge, divconteneurdisplay);
                divinputdisplay.addClass('assignfeedback_editpdfplus_' + this.tooltypefamille.label + '_input');
                var onof = 1;
                if (this.displaylock || this.displaylock >= 0) {
                    onof = this.displaylock;
                }
                var inputonof = "<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />";
                if (canevas) {
                    divconteneurdisplay.append(inputonof);
                }
                //var readonly = this.editor.get('readonly');
                //divconteneurdisplay.append(this.get_input_question());
                //readonly = this.editor.get('readonly');
                //if (!readonly) {
                this.get_button_visibility_left(divconteneurdisplay);
                this.get_button_visibility_right(divconteneurdisplay);
                this.get_button_save(divconteneurdisplay);
                this.get_button_cancel(divconteneurdisplay);
                if (this.tooltype.reply === 1) {
                    this.get_button_question(divconteneurdisplay);
                }
                this.get_button_remove(divconteneurdisplay);
                //} else {
                //    divconteneurdisplay.append(this.get_button_student_status());
                //}

                return divconteneurdisplay;
            };
            /**
             * get the html node for the button to set visibility on right
             * @return node
             */
            Annotation.prototype.get_button_visibility_right = function (canevas) {
                var buttonvisibility = "<button id='"
                        + this.divcartridge
                        + "_buttonedit_right' class='btn btn-default";
                if (this.adminDemo === 1) {
                    buttonvisibility += ' disabled';
                }
                buttonvisibility += "' type='button'>";
                buttonvisibility += "<i class='fa fa-arrow-right' aria-hidden='true'></i>";
                buttonvisibility += "</button>";
                if (canevas) {
                    canevas.append(buttonvisibility);
                }
                var buttonvisibilitydisplay = $('#' + this.divcartridge + "_buttonedit_right");
                if (this.adminDemo < 1) {
                    //buttonvisibilitydisplay.on('click', this.change_visibility_annot('r'));
                }
                return buttonvisibilitydisplay;
            };
            /**
             * get the html node for the button to set visibility on left
             * @return node
             */
            Annotation.prototype.get_button_visibility_left = function (canevas) {
                var buttonvisibility = "<button id='"
                        + this.divcartridge
                        + "_buttonedit_left' class='btn btn-default";
                if (this.adminDemo === 1) {
                    buttonvisibility += ' disabled';
                }
                buttonvisibility += "' type='button'>";
                buttonvisibility += "<i class='fa fa-arrow-left' aria-hidden='true'></i>";
                buttonvisibility += "</button>";
                if (canevas) {
                    canevas.append(buttonvisibility);
                }
                var buttonvisibilitydisplay = $('#' + this.divcartridge + "_buttonedit_left");
                if (this.adminDemo < 1) {
                    //buttonvisibilitydisplay.on('click', this.change_visibility_annot('l'));
                }
                return buttonvisibilitydisplay;
            };

            /**
             * get the html node for the button to save the text in the annotation
             * @return node
             */
            Annotation.prototype.get_button_save = function (canevas) {
                var buttonsave = "<button id='"
                        + this.divcartridge
                        + "_buttonsave' style='display:none;margin-left:110px;' class='btn btn-default";
                if (this.adminDemo === 1) {
                    buttonsave += ' disabled';
                }
                buttonsave += "' type='button'>"
                        + "<i class='fa fa-check' aria-hidden='true'></i>"
                        + "</button>";
                if (canevas) {
                    canevas.append(buttonsave);
                }
                var buttonsavedisplay = $('#' + this.divcartridge + "_buttonsave");
                if (this.adminDemo < 1) {
                    buttonsavedisplay.on('click', this.save_annot);
                }
                return buttonsavedisplay;
            };
            /**
             * get the html node for the button to cancel the text edition of the annotation
             * @return node
             */
            Annotation.prototype.get_button_cancel = function (canevas) {
                var buttoncancel = "<button id='"
                        + this.divcartridge
                        + "_buttoncancel' style='display:none;' class='btn btn-default";
                if (this.adminDemo === 1) {
                    buttoncancel += ' disabled';
                }
                buttoncancel += "' type='button'>"
                        + "<i class='fa fa-undo' aria-hidden='true'></i>"
                        + "</button>";
                if (canevas) {
                    canevas.append(buttoncancel);
                }
                var buttoncanceldisplay = $('#' + this.divcartridge + "_buttoncancel");
                if (this.adminDemo < 1) {
                    //buttoncanceldisplay.on('click', this.cancel_edit, this);
                }
                return buttoncanceldisplay;
            };

            /**
             * get the html node for the button to set a question
             * @return node
             */
            Annotation.prototype.get_button_question = function (canevas) {
                var buttonquestion = "<button id='"
                        + this.divcartridge
                        + "_buttonquestion' style='display:none;margin-left:10px;' class='btn btn-default";
                if (this.adminDemo === 1) {
                    buttonquestion += ' disabled';
                }
                buttonquestion += "' type='button'>"
                        + '<span class="fa-stack fa-lg" style="line-height: 1em;width: 1em;">'
                        + '<i class="fa fa-question-circle-o fa-stack-1x"></i>'
                        + '<i class="fa fa-ban fa-stack-1x text-danger"></i>'
                        + '</span>'
                        + "</button>";
                if (canevas) {
                    canevas.append(buttonquestion);
                }
                var buttonquestiondisplay = $('#' + this.divcartridge + "_buttonquestion");
                if (this.adminDemo < 1) {
                    //buttonquestiondisplay.on('click', this.change_question_status, this);
                }
                return buttonquestiondisplay;
            };
            /**
             * get the html node for the button to remove the annotation
             * @return node
             */
            Annotation.prototype.get_button_remove = function (canevas) {
                var buttontrash = "<button id='"
                        + this.divcartridge
                        + "_buttonremove' style='display:none;margin-left:10px;' class='btn btn-default";
                if (this.adminDemo === 1) {
                    buttontrash += ' disabled';
                }
                buttontrash += "' type='button'>"
                        + "<i class='fa fa-trash' aria-hidden='true'></i>"
                        + "</button>";
                if (canevas) {
                    canevas.append(buttontrash);
                }
                var buttontrashdisplay = $('#' + this.divcartridge + "_buttonremove");
                if (this.adminDemo < 1) {
                    //buttontrashdisplay.on('click', this.remove_by_trash, this);
                }
                return buttontrashdisplay;
            };
            /**
             * display the annotation according to parameters and profile
             * @return node
             */
            Annotation.prototype.apply_visibility_annot = function () {
                var divdisplay = $('#' + this.divcartridge + "_display");
                var interrupt = $('#' + this.divcartridge + "_onof");
                var buttonplusr = $('#' + this.divcartridge + "_buttonedit_right");
                var buttonplusl = $('#' + this.divcartridge + "_buttonedit_left");
                var buttonstatus = $('#' + this.divcartridge + "_radioContainer");
                if (interrupt) {
                    if (interrupt.val() === '1') {
                        if (buttonplusr) {
                            buttonplusr.show();
                        }
                        if (buttonplusl) {
                            buttonplusl.show();
                        }
                    } else if (interrupt.val() === '0') {
                        if (buttonplusr) {
                            buttonplusr.show();
                        }
                        if (buttonplusl) {
                            buttonplusl.hide();
                        }
                    } else {
                        if (buttonplusr) {
                            buttonplusr.hide();
                        }
                        if (buttonplusl) {
                            buttonplusl.show();
                        }
                    }
                }
                if (divdisplay) {
                    divdisplay.html(this.get_text_to_diplay_in_cartridge());
                }
                if (this.tooltypefamille.label === 'frame' && buttonplusr) {
                    buttonplusr.hide();
                    buttonplusl.hide();
                }
                if (buttonstatus) {
                    buttonstatus.hide();
                }
                this.apply_question_status();
            };
            /**
             * get the html node for the text to display for the annotation, according to parameters
             * @return node
             */
            Annotation.prototype.get_text_to_diplay_in_cartridge = function () {
                var valref = this.get_valref();
                var interrupt = $('#' + this.divcartridge + "_onof");
                var finalcontent = "";
                if (valref === '' /*&& !this.editor.get('readonly')*/) {
                    finalcontent = '&nbsp;&nbsp;&nbsp;&nbsp';
                }
                if (interrupt.val() === '1' && valref !== '') {
                    finalcontent = valref.substr(0, 20);
                } else if (interrupt.val() === '0' && valref !== '') {
                    finalcontent = '...';
                } else if (valref !== '') {
                    finalcontent = valref;
                }
                if (this.answerrequested === 1) {
                    finalcontent += '&nbsp;<span style="color:red;">[?]</span>';
                }
                return finalcontent;
            };
            /**
             * change question set of the annotation
             * @return null
             */
            Annotation.prototype.apply_question_status = function () {
                var buttonquestion = $('#' + this.divcartridge + "_buttonquestion");
                var questionvalue = $('#' + this.divcartridge + "_question");
                var value = 0;
                if (questionvalue) {
                    value = parseInt(questionvalue.val(), 10);
                }
                if (buttonquestion) {
                    if (value === 1) {
                        buttonquestion.html('<i class="fa fa-question-circle-o"></i>');
                    } else {
                        buttonquestion.html('<span class="fa-stack fa-lg" style="line-height: 1em;width: 1em;">'
                                + '<i class="fa fa-question-circle-o fa-stack-1x"></i>'
                                + '<i class="fa fa-ban fa-stack-1x text-danger"></i>'
                                + '</span>');
                    }
                }
                return;
            };
            /**
             * global method, draw empty cartridge
             */
            Annotation.prototype.draw_catridge = function () {
                return true;
            };
            /**
             * display annotation edditing view
             */
            Annotation.prototype.edit_annot = function (event) {
                if (event.data.annotation.tooltype.typetool <= global.TOOLTYPE.COMMENTPLUS/* && !this.parent_annot_element*/) {
                    var annot = event.data.annotation;
                    var divprincipale = $('#' + annot.divcartridge);
                    var divdisplay = $('#' + annot.divcartridge + "_display");
                    var divedit = $('#' + annot.divcartridge + "_edit");
                    var buttonplusr = $('#' + annot.divcartridge + "_buttonedit_right");
                    var buttonplusl = $('#' + annot.divcartridge + "_buttonedit_left");
                    var buttonsave = $('#' + annot.divcartridge + "_buttonsave");
                    var buttoncancel = $('#' + annot.divcartridge + "_buttoncancel");
                    var buttonquestion = $('#' + annot.divcartridge + "_buttonquestion");
                    var buttonrotation = $('#' + annot.divcartridge + "_buttonrotation");
                    var buttonremove = $('#' + annot.divcartridge + "_buttonremove");
                    var input = $('#' + annot.divcartridge + "_editinput");
                    divdisplay.hide();
                    if (buttonplusr) {
                        buttonplusr.hide();
                    }
                    if (buttonplusl) {
                        buttonplusl.hide();
                    }
                    if (buttonrotation) {
                        buttonrotation.hide();
                    }
                    divedit.show();
                    buttonsave.show();
                    buttoncancel.show();
                    if (buttonquestion) {
                        buttonquestion.show();
                    }
                    buttonremove.show();
                    divprincipale.css('z-index', 1000);
                    if (input) {
                        input.attr('focus', 'on');
                    }
                    event.data.annotation.disabled_canvas_event();
                    $('#canevas').on('click',
                            {annotation: annot, action: 'clickoutside'},
                            annot.save_annot_clickout);
                }
            };
            /**
             * fill input edition with new text
             * @param {type} e
             * @param {string} unputtext
             */
            Annotation.prototype.fill_input_edition = function (e, unputtext) {
                var input = $('#' + this.divcartridge + "_editinput");
                if (input) {
                    input.set('value', unputtext);
                }
                this.save_annot(unputtext);
            };
            Annotation.prototype.save_annot_clickout = function (event) {
                //alert(event.target.id === "canevas");
                if ((event.target.id === "canevas" /*&& this.editor.currentannotation === this*/)) {
                    if (event.data.annotation.adminDemo === 1) {
                        event.data.annotation.cancel_edit();
                    } else {
                        //event.data.annotation.save_annot(null);
                    }
                }
                return;
            };
            /**
             * save text annotation
             * @param {string} result
             */
            Annotation.prototype.save_annot = function (result) {
                if (typeof result !== 'string') {
                    var input = $('#' + this.divcartridge + "_editinput");
                    if (input) {
                        result = input.val();
                    }
                }
                this.textannot = result;
                //this.editor.save_current_page();
                if (result.length === 0) {
                    result = "&nbsp;&nbsp;";
                }
                this.hide_edit();
                this.apply_visibility_annot();
            };
            /**
             * cancel annotation detail view
             * @param {type} e
             * @param {string} clickType
             */
            Annotation.prototype.cancel_edit = function () {
                //if (!(clickType === 'clickoutside' /*&& this.editor.currentannotation === this)*/)) {
                var valref = this.get_valref();
                var input = $('#' + this.divcartridge + "_editinput");
                if (valref && input) {
                    input.set('value', valref);
                }
                this.hide_edit();
                this.apply_visibility_annot();
                var divprincipale = $('#' + this.divcartridge);
                if (divprincipale) {
                    divprincipale.off();
                }
                //}
                //return;
            };
            /**
             * remove annotation detail view
             * @param {type} e
             * @param {string} clickType
             */
            Annotation.prototype.hide_edit = function (e, clickType) {
                if (!clickType || !(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
                    var divprincipale = $('#' + this.divcartridge);
                    var divdisplay = $('#' + this.divcartridge + "_display");
                    var divedit = $('#' + this.divcartridge + "_edit");
                    var divvisu = $('#' + this.divcartridge + "_visu");
                    var buttonsave = $('#' + this.divcartridge + "_buttonsave");
                    var buttoncancel = $('#' + this.divcartridge + "_buttoncancel");
                    var buttonquestion = $('#' + this.divcartridge + "_buttonquestion");
                    var buttonrotation = $('#' + this.divcartridge + "_buttonrotation");
                    var buttonremove = $('#' + this.divcartridge + "_buttonremove");
                    var buttonstatus = $('#' + this.divcartridge + "_radioContainer");
                    if (divdisplay) {
                        divdisplay.show();
                        //divdisplay.css('display', 'inline');
                        divdisplay.css('color', this.get_color_cartridge());
                    }
                    if (buttonrotation) {
                        buttonrotation.show();
                    }
                    if (divedit) {
                        divedit.hide();
                        buttonsave.hide();
                        buttoncancel.hide();
                    }
                    if (divvisu) {
                        divvisu.hide();
                    }
                    if (buttonquestion) {
                        buttonquestion.hide();
                    }
                    if (buttonremove) {
                        buttonremove.hide();
                    }
                    if (divprincipale) {
                        divprincipale.css('z-index', 1);
                        $("#canevas").off();
                        //if (this.editor.get('readonly')) {
                        //    divprincipale.on('click', this.view_annot, this, 'click');
                        //}
                    }
                    if (divedit) {
                        this.enabled_canvas_event();
                    }
                    if (buttonstatus) {
                        buttonstatus.hide();
                    }
                }
            };
            /**
             * Disable canvas event (click on other tool or annotation)
             */
            Annotation.prototype.disabled_canvas_event = function () {
                var drawingcanvas = $(global.SELECTOR.DRAWINGCANVAS);
                drawingcanvas.off('click');
            };
            /**
             * Enable canvas event (click on other tool or annotation)
             */
            Annotation.prototype.enabled_canvas_event = function () {
                /*var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
                 drawingcanvas.on('gesturemovestart', this.editor.edit_start, null, this.editor);
                 drawingcanvas.on('gesturemove', this.editor.edit_move, null, this.editor);
                 drawingcanvas.on('gesturemoveend', this.editor.edit_end, null, this.editor);*/
            };
            /**
             * change the visibility of the annotation according to parameters and variable sens
             * @param {type} e
             * @param {char} sens
             */
            Annotation.prototype.change_visibility_annot = function (sens) {
                var interrupt = $('#' + this.divcartridge + "_onof");
                var finalvalue = parseInt(interrupt.val(), 10);
                if (sens === 'r') {
                    finalvalue += 1;
                } else {
                    finalvalue -= 1;
                }
                interrupt.val(finalvalue);
                this.displaylock = finalvalue;
                this.apply_visibility_annot();
                //this.editor.save_current_page();
            };
            /**
             * get the final reference text value
             * @return node
             */
            Annotation.prototype.get_valref = function () {
                if (this.textannot && this.textannot.length > 0 && typeof this.textannot === 'string') {
                    return this.textannot;
                }
                return '';
            };


            return Annotation;
        });