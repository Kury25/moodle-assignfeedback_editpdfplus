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
define(['jquery'],
        function ($) {
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
                var color = 'black'; //ANNOTATIONCOLOUR[this.colour];
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
                var color = 'black'; //ANNOTATIONCOLOUR[this.tooltype.cartridge_color];
                if (!color) {
                    color = this.tooltype.cartridge_color;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                if (color === '') {
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
                this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
            };
            /**
             * get the html node for the cartridge
             * @param {string} colorcartridge
             * @return node
             */
            Annotation.prototype.get_div_cartridge = function (colorcartridge) {
                var div = "<div ";
                div += "id='" + this.divcartridge + "' ";
                div += "class='assignfeedback_editpdfplus_cartridge' ";
                div += "style='border-color: " + colorcartridge + ";'> ";
                div += "</div>";
                var divdisplay = Y.Node.create(div);
                if (this.editor.get('readonly')) {
                    divdisplay.on('click', this.view_annot, this);
                }
                return divdisplay;
            };
            /**
             * get the html node for the label cartridge
             * @param {string} colorcartridge
             * @param {boolean} draggable
             * @return node
             */
            Annotation.prototype.get_div_cartridge_label = function (colorcartridge/*, draggable*/) {
                var divcartridge = "<div ";
                divcartridge += "id='" + this.divcartridge + "_cartridge' ";
                divcartridge += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_cartridge' ";
                if (this.editor.get('readonly') && this.get_valref() === '') {
                    divcartridge += "style='border-right:none;padding-right:0px;color:" + colorcartridge + ";' ";
                } else {
                    divcartridge += "style='border-right-color: " + colorcartridge + ";color:" + colorcartridge + ";' ";
                }
                divcartridge += "> ";
                divcartridge += this.tooltype.cartridge;
                divcartridge += "</div>";
                var divcartridgedisplay = Y.Node.create(divcartridge);
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
            Annotation.prototype.get_div_input = function (colorcartridge) {
                var divinput = "<div ";
                divinput += "id='" + this.divcartridge + "_display' ";
                divinput += "style='color:" + colorcartridge + "; ";
                if (this.editor.get('readonly') && this.get_valref() === '') {
                    divinput += "padding:0px;";
                }
                divinput += "'></div>";
                var divinputdisplay = Y.Node.create(divinput);
                if (!this.editor.get('readonly')) {
                    divinputdisplay.on('click', this.edit_annot, this);
                }
                return divinputdisplay;
            };
            /**
             * get the html node for the edition of comment and parameters
             * @return node
             */
            Annotation.prototype.get_div_edition = function () {
                var divedition = "<div ";
                divedition += "id='" + this.divcartridge + "_edit' ";
                divedition += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_edition' ";
                divedition += "style='display:none;'> ";
                divedition += "<textarea id='"
                        + this.divcartridge
                        + "_editinput' type='text' value=\""
                        + this.get_valref() + "\" class='form-control' style='margin-bottom:5px;' >"
                        + this.get_valref() + "</textarea>";
                divedition += "</div>";
                var diveditiondisplay = Y.Node.create(divedition);
                var propositions = this.tooltype.texts;
                if (propositions && propositions.length > 0) {
                    var divproposition = "<div></div>";
                    var divpropositiondisplay = Y.Node.create(divproposition);
                    var propositionarray = propositions.split('","');
                    for (var i = 0; i < propositionarray.length; i++) {
                        var buttontmp = "<button class='btn btn-default' type='button' style='width:100%;font-size: x-small;'>"
                                + propositionarray[i].replace('"', '')
                                + "</button>";
                        var buttontmpdisplay = Y.Node.create(buttontmp);
                        buttontmpdisplay.on('click', this.fill_input_edition, this, propositionarray[i].replace('"', ''));
                        divpropositiondisplay.append(buttontmpdisplay);
                        divpropositiondisplay.append("<br/>");
                    }
                    diveditiondisplay.append(divpropositiondisplay);
                }
                return diveditiondisplay;
            };
            /**
             * get the html node for the text annotation, tools and options
             * @param {string} colorcartridge
             * @return node
             */
            Annotation.prototype.get_div_container = function (colorcartridge) {
                var divconteneur = "<div ";
                divconteneur += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_conteneur' >";
                divconteneur += "</div>";
                var divconteneurdisplay = Y.Node.create(divconteneur);
                var divinputdisplay = this.get_div_input(colorcartridge);
                divinputdisplay.addClass('assignfeedback_editpdfplus_' + this.tooltypefamille.label + '_input');
                //var inputvalref = this.get_input_valref();
                var onof = 1;
                if (this.displaylock || this.displaylock >= 0) {
                    onof = this.displaylock;
                }
                var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
                var readonly = this.editor.get('readonly');
                if (!readonly) {
                    divinputdisplay.on('click', this.edit_annot, this);
                }
                divconteneurdisplay.append(divinputdisplay);
                divconteneurdisplay.append(inputonof);
                divconteneurdisplay.append(this.get_input_question());
                readonly = this.editor.get('readonly');
                if (!readonly) {
                    divconteneurdisplay.append(this.get_button_visibility_left());
                    divconteneurdisplay.append(this.get_button_visibility_right());
                    divconteneurdisplay.append(this.get_button_save());
                    divconteneurdisplay.append(this.get_button_cancel());
                    if (this.tooltype.reply === 1) {
                        divconteneurdisplay.append(this.get_button_question());
                    }
                    divconteneurdisplay.append(this.get_button_remove());
                } else {
                    divconteneurdisplay.append(this.get_button_student_status());
                }

                return divconteneurdisplay;
            };
            /**
             * get the html node for the button to set visibility on right
             * @return node
             */
            Annotation.prototype.get_button_visibility_right = function () {
                var buttonvisibility = "<button id='"
                        + this.divcartridge
                        + "_buttonedit_right' class='btn btn-default' type='button'>";
                buttonvisibility += "<i class='fa fa-arrow-right' aria-hidden='true'></i>";
                buttonvisibility += "</button>";
                var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
                buttonvisibilitydisplay.on('click', this.change_visibility_annot, this, 'r');
                return buttonvisibilitydisplay;
            };
            /**
             * get the html node for the button to set visibility on left
             * @return node
             */
            Annotation.prototype.get_button_visibility_left = function () {
                var buttonvisibility = "<button id='"
                        + this.divcartridge
                        + "_buttonedit_left' class='btn btn-default' type='button'>";
                buttonvisibility += "<i class='fa fa-arrow-left' aria-hidden='true'></i>";
                buttonvisibility += "</button>";
                var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
                buttonvisibilitydisplay.on('click', this.change_visibility_annot, this, 'l');
                return buttonvisibilitydisplay;
            };

            /**
             * get the html node for the button to cancel the text edition of the annotation
             * @return node
             */
            Annotation.prototype.get_button_cancel = function () {
                var buttoncancel = "<button id='"
                        + this.divcartridge
                        + "_buttoncancel' style='display:none;' class='btn btn-default' type='button'>"
                        + "<i class='fa fa-undo' aria-hidden='true'></i>"
                        + "</button>";
                var buttoncanceldisplay = Y.Node.create(buttoncancel);
                buttoncanceldisplay.on('click', this.cancel_edit, this);
                return buttoncanceldisplay;
            };

            /**
             * get the html node for the button to set a question
             * @return node
             */
            Annotation.prototype.get_button_question = function () {
                var buttonquestion = "<button id='"
                        + this.divcartridge
                        + "_buttonquestion' style='display:none;margin-left:10px;' class='btn btn-default' type='button'>"
                        + '<span class="fa-stack fa-lg" style="line-height: 1em;width: 1em;">'
                        + '<i class="fa fa-question-circle-o fa-stack-1x"></i>'
                        + '<i class="fa fa-ban fa-stack-1x text-danger"></i>'
                        + '</span>'
                        + "</button>";
                var buttonquestiondisplay = Y.Node.create(buttonquestion);
                buttonquestiondisplay.on('click', this.change_question_status, this);
                return buttonquestiondisplay;
            };
            /**
             * get the html node for the button to remove the annotation
             * @return node
             */
            Annotation.prototype.get_button_remove = function () {
                var buttontrash = "<button id='"
                        + this.divcartridge
                        + "_buttonremove' style='display:none;margin-left:10px;' class='btn btn-default' type='button'>"
                        + "<i class='fa fa-trash' aria-hidden='true'></i>"
                        + "</button>";
                var buttontrashdisplay = Y.Node.create(buttontrash);
                buttontrashdisplay.on('click', this.remove_by_trash, this);
                return buttontrashdisplay;
            };
            /**
             * display the annotation according to parameters and profile
             * @return node
             */
            Annotation.prototype.apply_visibility_annot = function () {
                var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
                var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
                var buttonplusr = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit_right");
                var buttonplusl = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit_left");
                var buttonstatus = this.editor.get_dialogue_element('#' + this.divcartridge + "_radioContainer");
                if (interrupt) {
                    if (interrupt.get('value') === '1') {
                        if (buttonplusr) {
                            buttonplusr.show();
                        }
                        if (buttonplusl) {
                            buttonplusl.show();
                        }
                    } else if (interrupt.get('value') === '0') {
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
                    divdisplay.setContent(this.get_text_to_diplay_in_cartridge());
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
                var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
                var finalcontent = "";
                if (valref === '' && !this.editor.get('readonly')) {
                    finalcontent = '&nbsp;&nbsp;&nbsp;&nbsp';
                }
                if (interrupt.get('value') === '1' && valref !== '') {
                    finalcontent = valref.substr(0, 20);
                } else if (interrupt.get('value') === '0' && valref !== '') {
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
                var buttonquestion = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonquestion");
                var questionvalue = this.editor.get_dialogue_element('#' + this.divcartridge + "_question");
                var value = 0;
                if (questionvalue) {
                    value = parseInt(questionvalue.get('value'), 10);
                }
                if (buttonquestion) {
                    if (value === 1) {
                        buttonquestion.setHTML('<i class="fa fa-question-circle-o"></i>');
                    } else {
                        buttonquestion.setHTML('<span class="fa-stack fa-lg" style="line-height: 1em;width: 1em;">'
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
            Annotation.prototype.edit_annot = function () {
                if (/*this.tooltype.type <= TOOLTYPE.COMMENTPLUS &&*/ !this.parent_annot_element) {
                    var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
                    var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
                    var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
                    var buttonplusr = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit_right");
                    var buttonplusl = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit_left");
                    var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
                    var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
                    var buttonquestion = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonquestion");
                    var buttonrotation = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonrotation");
                    var buttonremove = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonremove");
                    var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
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
                    divprincipale.setStyle('z-index', 1000);
                    if (input) {
                        input.set('focus', 'on');
                    }
                    this.disabled_canvas_event();
                    divprincipale.on('clickoutside', this.save_annot_clickout, this, 'clickoutside');
                }
            };
            /**
             * fill input edition with new text
             * @param {type} e
             * @param {string} unputtext
             */
            Annotation.prototype.fill_input_edition = function (e, unputtext) {
                var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
                if (input) {
                    input.set('value', unputtext);
                }
                this.save_annot(unputtext);
            };
            Annotation.prototype.save_annot_clickout = function (e, clickType) {
                if (!(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
                    this.save_annot(null);
                }
                return;
            };
            /**
             * save text annotation
             * @param {string} result
             */
            Annotation.prototype.save_annot = function (result) {
                if (typeof result !== 'string') {
                    var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
                    if (input) {
                        result = input.get('value');
                    }
                }
                this.textannot = result;
                this.editor.save_current_page();
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
            Annotation.prototype.cancel_edit = function (e, clickType) {
                if (!(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
                    var valref = this.get_valref();
                    var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
                    if (valref && input) {
                        input.set('value', valref);
                    }
                    this.hide_edit();
                    this.apply_visibility_annot();
                    var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
                    if (divprincipale) {
                        divprincipale.detach();
                    }
                }
                return;
            };
            /**
             * remove annotation detail view
             * @param {type} e
             * @param {string} clickType
             */
            Annotation.prototype.hide_edit = function (e, clickType) {
                if (!clickType || !(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
                    var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
                    var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
                    var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
                    var divvisu = this.editor.get_dialogue_element('#' + this.divcartridge + "_visu");
                    var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
                    var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
                    var buttonquestion = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonquestion");
                    var buttonrotation = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonrotation");
                    var buttonremove = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonremove");
                    var buttonstatus = this.editor.get_dialogue_element('#' + this.divcartridge + "_radioContainer");
                    if (divdisplay) {
                        divdisplay.show();
                        divdisplay.set('style', 'display:inline;color:' + this.get_color_cartridge() + ';');
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
                        divprincipale.setStyle('z-index', 1);
                        divprincipale.detach();
                        if (this.editor.get('readonly')) {
                            divprincipale.on('click', this.view_annot, this, 'click');
                        }
                    }
                    if (divedit) {
                        this.enabled_canvas_event();
                    }
                    if (buttonstatus) {
                        buttonstatus.hide();
                    }
                }
            };


            return Annotation;
        });