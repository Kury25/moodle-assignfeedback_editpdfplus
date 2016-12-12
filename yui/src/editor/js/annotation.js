/* global Y, M, SELECTOR, TOOLTYPE, STROKEWEIGHT, SELECTEDBORDERCOLOUR, SELECTEDFILLCOLOUR, ANNOTATIONCOLOUR */

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

/**
 * Provides an in browser PDF editor.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */

/**
 * Class representing a highlight.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotation
 * @constructor
 */
var ANNOTATION = function (config) {
    ANNOTATION.superclass.constructor.apply(this, [config]);
};
ANNOTATION.NAME = "annotation";
ANNOTATION.ATTRS = {};
Y.extend(ANNOTATION, Y.Base, {
    /**
     * Reference to M.assignfeedback_editpdfplus.editor.
     * @property editor
     * @type M.assignfeedback_editpdfplus.editor
     * @public
     */
    editor: null,
    /**
     * Grade id
     * @property gradeid
     * @type Int
     * @public
     */
    gradeid: 0,
    /**
     * Comment page number
     * @property pageno
     * @type Int
     * @public
     */
    pageno: 0,
    /**
     * X position
     * @property x
     * @type Int
     * @public
     */
    x: 0,
    /**
     * Y position
     * @property y
     * @type Int
     * @public
     */
    y: 0,
    /**
     * Ending x position
     * @property endx
     * @type Int
     * @public
     */
    endx: 0,
    /**
     * Ending y position
     * @property endy
     * @type Int
     * @public
     */
    endy: 0,
    /**
     * Path
     * @property path
     * @type String - list of points like x1,y1:x2,y2
     * @public
     */
    path: '',
    /**
     * Tool.
     * @property toolid
     * @type Int
     * @public
     */
    toolid: 0,
    /**
     * Annotation colour.
     * @property colour
     * @type String
     * @public
     */
    colour: 'red',
    /**
     * Reference to M.assignfeedback_editpdfplus.drawable
     * @property drawable
     * @type M.assignfeedback_editpdfplus.drawable
     * @public
     */
    drawable: false,
    /**
     * Reference to M.assignfeedback_editpdfplus.tool
     * @property tooltype
     * @type M.assignfeedback_editpdfplus.tool
     * @public
     */
    tooltype: null,
    /**
     * Reference to M.assignfeedback_editpdfplus.type_tool
     * @property tooltypefamille
     * @type M.assignfeedback_editpdfplus.type_tool
     * @public
     */
    tooltypefamille: null,
    /**
     * HTML id for the cartridge.
     * @property divcartridge
     * @type String
     * @public
     */
    divcartridge: '',
    /**
     * Text annotation
     * @property textannot
     * @type String
     * @public
     */
    textannot: '',
    /**
     * Get the information of display (3 positions).
     * @property displaylock
     * @type Int
     * @public
     */
    displaylock: 1,
    /**
     * Display the orientation of the stamp
     * @property displayrotation
     * @type Int
     * @public
     */
    displayrotation: 0,
    /**
     * Border style for cartridge and other element (frame...)
     * @property borderstyle
     * @type String
     * @public
     */
    borderstyle: '',
    /**
     * Parent annotation ID.
     * @property parent_annot
     * @type Int
     * @public
     */
    parent_annot: 0,
    /**
     * Reference to M.assignfeedback_editpdfplus.annotation
     * @property parent_annot_element
     * @type M.assignfeedback_editpdfplus.annotation
     * @public
     */
    parent_annot_element: null,
    /**
     * id of the annotation in BDD.
     * @property id
     * @type Int
     * @public
     */
    id: 0,
    /**
     * Shape HTML id
     * @property shape_id
     * @type String
     * @public
     */
    shape_id: '',
    /**
     * position x of the cartridge.
     * @property cartridgex
     * @type Int
     * @public
     */
    cartridgex: 0,
    /**
     * position y of the cartridge.
     * @property cartridgey
     * @type Int
     * @public
     */
    cartridgey: 0,
    /**
     * If the annotation is an question or not.
     * @property answerrequested
     * @type Int
     * @public
     */
    answerrequested: 0,
    /**
     * Student status of the annotation.
     * @property studentstatus
     * @type Int
     * @public
     */
    studentstatus: 0,
    /**
     * Student answer for the comment in this annotation
     * @property studentanswer
     * @type String
     * @public
     */
    studentanswer: "",
    /**
     * Initialise the annotation.
     *
     * @method initializer
     * @return void
     */
    initializer: function (config) {
        if (config.parent_annot_element) {
            this.editor = config.parent_annot_element.editor || null;
            this.gradeid = parseInt(config.parent_annot_element.gradeid, 10) || 0;
            this.pageno = parseInt(config.parent_annot_element.pageno, 10) || 0;
            this.cartridgex = parseInt(config.parent_annot_element.cartridgex, 10) || 0;
            this.cartridgey = parseInt(config.parent_annot_element.cartridgey, 10) || 0;
            this.colour = config.parent_annot_element.colour || 'red';
            this.tooltype = config.tooltype;
            this.textannot = config.parent_annot_element.textannot;
            this.displaylock = parseInt(config.parent_annot_element.displaylock);
            this.displayrotation = config.parent_annot_element.displayrotation;
            this.borderstyle = config.parent_annot_element.borderstyle || 'solid';
            this.parent_annot = parseInt(config.parent_annot_element.id);
            this.studentstatus = parseInt(config.parent_annot_element.studentstatus, 10) || 0;
            this.parent_annot_element = config.parent_annot_element;
            //config.parent_annot_element.children.push(this);
        } else {
            this.editor = config.editor || null;
            this.gradeid = parseInt(config.gradeid, 10) || 0;
            this.pageno = parseInt(config.pageno, 10) || 0;
            this.cartridgex = parseInt(config.cartridgex, 10) || 0;
            this.cartridgey = parseInt(config.cartridgey, 10) || 0;
            this.colour = config.colour || 'red';
            this.tooltype = config.tooltype;
            this.textannot = config.textannot;
            this.displaylock = parseInt(config.displaylock);
            this.displayrotation = config.displayrotation;
            this.borderstyle = config.borderstyle || 'solid';
            this.parent_annot = parseInt(config.parent_annot);
            this.answerrequested = parseInt(config.answerrequested, 10) || 0;
            this.studentstatus = parseInt(config.studentstatus, 10) || 0;
            this.studentanswer = config.studentanswer;
        }
        this.id = config.id;
        this.x = parseInt(config.x, 10) || 0;
        this.y = parseInt(config.y, 10) || 0;
        this.endx = parseInt(config.endx, 10) || 0;
        this.endy = parseInt(config.endy, 10) || 0;
        this.path = config.path || '';
        this.toolid = config.toolid || this.editor.get_dialogue_element(TOOLTYPE.RECTANGLE);
        this.drawable = false;
        this.tooltypefamille = this.editor.typetools[this.tooltype.type];
    },
    /**
     * Clean a comment record, returning an oject with only fields that are valid.
     * @public
     * @method clean
     * @return {}
     */
    clean: function () {
        if (this.parent_annot_element) {
            return {
                gradeid: this.gradeid,
                x: parseInt(this.x, 10),
                y: parseInt(this.y, 10),
                endx: parseInt(this.endx, 10),
                endy: parseInt(this.endy, 10),
                cartridgex: parseInt(this.cartridgex, 10),
                cartridgey: parseInt(this.cartridgey, 10),
                toolid: this.toolid,
                path: this.path,
                pageno: this.pageno,
                colour: this.colour,
                textannot: this.textannot,
                displaylock: parseInt(this.displaylock, 10),
                displayrotation: parseInt(this.displayrotation, 10),
                borderstyle: this.borderstyle,
                parent_annot: parseInt(this.parent_annot, 10),
                divcartridge: this.divcartridge,
                parent_annot_div: this.parent_annot_element.divcartridge
            };
        }
        return {
            gradeid: this.gradeid,
            x: parseInt(this.x, 10),
            y: parseInt(this.y, 10),
            endx: parseInt(this.endx, 10),
            endy: parseInt(this.endy, 10),
            cartridgex: parseInt(this.cartridgex, 10),
            cartridgey: parseInt(this.cartridgey, 10),
            toolid: this.toolid,
            path: this.path,
            pageno: this.pageno,
            colour: this.colour,
            textannot: this.textannot,
            displaylock: parseInt(this.displaylock, 10),
            displayrotation: parseInt(this.displayrotation, 10),
            borderstyle: this.borderstyle,
            parent_annot: parseInt(this.parent_annot, 10),
            divcartridge: this.divcartridge,
            parent_annot_div: '',
            answerrequested: parseInt(this.answerrequested),
            studentstatus: parseInt(this.studentstatus)
        };
    },
    /**
     * Clean a comment record, returning an oject with only fields that are valid.
     * @public
     * @method clean
     * @return {}
     */
    light_clean: function () {
        return {
            id: this.id,
            studentstatus: parseInt(this.studentstatus),
            studentanswer: this.studentanswer
        };
    },
    /**
     * Draw a selection around this annotation if it is selected.
     * @public
     * @method draw_highlight
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw_highlight: function () {
        var bounds,
                drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION),
                offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY(),
                shape;
        if (this.editor.currentannotation === this) {
            // Draw a highlight around the annotation.
            bounds = new M.assignfeedback_editpdfplus.rect();
            bounds.bound([new M.assignfeedback_editpdfplus.point(this.x - 10, this.y - 10),
                new M.assignfeedback_editpdfplus.point(this.endx + 10, this.endy + 10)]);
            shape = this.editor.graphic.addShape({
                type: Y.Rect,
                width: bounds.width,
                height: bounds.height,
                stroke: {
                    weight: STROKEWEIGHT,
                    color: SELECTEDBORDERCOLOUR
                },
                fill: {
                    color: SELECTEDFILLCOLOUR
                },
                x: bounds.x,
                y: bounds.y
            });
            this.drawable.shapes.push(shape);
            shape.editor = this.editor;
            shape.on('clickoutside', Y.rbind(this.editor.redraw_annotation, this.editor));
            // Add a delete X to the annotation.
            var deleteicon = Y.Node.create('<img src="' + M.util.image_url('trash', 'assignfeedback_editpdfplus') + '"/>'),
                    deletelink = Y.Node.create('<a href="#" role="button"></a>');
            deleteicon.setAttrs({
                'alt': M.util.get_string('deleteannotation', 'assignfeedback_editpdfplus')
            });
            deleteicon.setStyles({
                'backgroundColor': 'white'
            });
            deletelink.addClass('deleteannotationbutton');
            deletelink.append(deleteicon);
            drawingregion.append(deletelink);
            deletelink.setData('annotation', this);
            deletelink.setStyle('zIndex', '200');
            deletelink.on('click', this.remove, this);
            deletelink.on('key', this.remove, 'space,enter', this);
            deletelink.setX(offsetcanvas[0] + bounds.x + bounds.width - 18);
            deletelink.setY(offsetcanvas[1] + bounds.y + bounds.height - 18);
            this.drawable.nodes.push(deletelink);
        }
        return this.drawable;
    },
    /**
     * Draw an annotation
     * @public
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable|false
     */
    draw: function () {
        // Should be overridden by the subclass.
        this.draw_highlight();
        return this.drawable;
    },
    /**
     * Get the final color for the annotation
     * @return string
     * @protected
     */
    get_color: function () {
        var color = ANNOTATIONCOLOUR[this.colour];
        if (!color) {
            color = this.colour;
        } else {
            // Add an alpha channel to the rgb colour.
            color = color.replace('rgb', 'rgba');
            color = color.replace(')', ',0.5)');
        }
        return color;
    },
    /**
     * Get the final color for the cartridge
     * @return string
     * @protected
     */
    get_color_cartridge: function () {
        var color = ANNOTATIONCOLOUR[this.tooltype.cartridge_color];
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
    },
    /**
     * Init the HTML id for the annotation
     * @protected
     */
    init_div_cartridge_id: function () {
        var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
    },
    /**
     * get the html node for the cartridge
     * @param {string} colorcartridge
     * @return node
     */
    get_div_cartridge: function (colorcartridge) {
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
    },
    /**
     * get the html node for the label cartridge
     * @param {string} colorcartridge
     * @param {boolean} draggable
     * @return node
     */
    get_div_cartridge_label: function (colorcartridge, draggable) {
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
        if (draggable && !this.editor.get('readonly')) {
            divcartridgedisplay.on('mousedown', this.move_cartridge_begin, this);
            return divcartridgedisplay;
        }
        return divcartridgedisplay;
    },
    /**
     * get the html node for the textannot associated to the annotation
     * @param {string} colorcartridge
     * @return node
     */
    get_div_input: function (colorcartridge) {
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
    },
    /**
     * get the html node for the edition of comment and parameters
     * @return node
     */
    get_div_edition: function () {
        var divedition = "<div ";
        divedition += "id='" + this.divcartridge + "_edit' ";
        divedition += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_edition' ";
        divedition += "style='display:none;'> ";
        divedition += "<textarea id='" + this.divcartridge + "_editinput' type='text' value=\"" + this.get_valref() + "\" >" + this.get_valref() + "</textarea>";
        divedition += "</div>";
        var diveditiondisplay = Y.Node.create(divedition);
        var propositions = this.tooltype.texts;
        if (propositions && propositions.length > 0) {
            var divproposition = "<div></div>";
            var divpropositiondisplay = Y.Node.create(divproposition);
            var propositionarray = propositions.split('","');
            for (i = 0; i < propositionarray.length; i++) {
                var buttontmp = "<p class='btn btn-default'>" + propositionarray[i].replace('"', '') + "</p>";
                var buttontmpdisplay = Y.Node.create(buttontmp);
                buttontmpdisplay.on('click', this.fill_input_edition, this, propositionarray[i].replace('"', ''));
                divpropositiondisplay.append(buttontmpdisplay);
            }
            diveditiondisplay.append(divpropositiondisplay);
        }
        return diveditiondisplay;
    },
    /**
     * get the html node for the visualisation of comment and question
     * @param {string} colorcartridge
     * @return node
     */
    get_div_visu: function (colorcartridge) {
        var divvisu = "<div ";
        divvisu += "id='" + this.divcartridge + "_visu' ";
        divvisu += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_visu' ";
        divvisu += "style='display:none;color:" + colorcartridge + ";'> ";
        divvisu += this.get_valref().replace(/\n/g, "<br/>");
        divvisu += "</div>";
        var divvisudisplay = Y.Node.create(divvisu);

        if (this.answerrequested === 1) {
            var divinput = Y.Node.create("<div></div>");
            var hr = Y.Node.create("<hr style='margin-bottom:0px;'/>");
            var label = Y.Node.create("<label style='display:inline;'>" + M.util.get_string('student_answer_lib', 'assignfeedback_editpdfplus') + "</label>");
            var rep = "";
            if (this.studentanswer && this.studentanswer !== "0" && this.studentanswer !== "1") {
                rep = this.studentanswer;
            }
            var textarea = Y.Node.create("<br/><textarea id='" + this.divcartridge + "_studentanswer' type='text' value=\"" + rep + "\" >" + rep + "</textarea>");
            rep = this.studentanswer;
            var buttonsave = "<button id='" + this.divcartridge + "_buttonsavestudentanswer' style='margin-left:110px;'><img src='" + M.util.image_url('e/save', 'core') + "' /></button>";
            var buttonsavedisplay = Y.Node.create(buttonsave);
            buttonsavedisplay.on('click', this.save_studentanswer, this, null);

            divinput.append(hr);
            divinput.append(label);
            divinput.append(buttonsavedisplay);
            divinput.append(textarea);
            divvisudisplay.append(divinput);
        }
        return divvisudisplay;
    },
    /**
     * get the html node for the text annotation, tools and options
     * @param {string} colorcartridge
     * @return node
     */
    get_div_container: function (colorcartridge) {
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
        //divconteneurdisplay.append(inputvalref);
        divconteneurdisplay.append(inputonof);
        divconteneurdisplay.append(this.get_input_question());
        var readonly = this.editor.get('readonly');
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
    },
    /**
     * get the html node for student button to set status
     * @return node
     */
    get_button_student_status: function () {
        var buttonstatus1 = '<label style="padding-left:20px;" class="radio-inline"><input type="radio" name="' + this.divcartridge + '_status" value=0 >' + M.util.get_string('student_statut_nc', 'assignfeedback_editpdfplus') + '</label>';
        var buttonstatus2 = '<label class="radio-inline"><input type="radio" name="' + this.divcartridge + '_status" value=1 ><img style="width:15px;" src=\'' + M.util.image_url('tick', 'assignfeedback_editpdfplus') + '\' /></label>';
        var buttonstatus3 = '<label class="radio-inline"><input type="radio" name="' + this.divcartridge + '_status" value=2 ><img style="width:15px;" src=\'' + M.util.image_url('cross', 'assignfeedback_editpdfplus') + '\' /></label> ';
        var buttonstatus1display = Y.Node.create(buttonstatus1);
        var buttonstatus2display = Y.Node.create(buttonstatus2);
        var buttonstatus3display = Y.Node.create(buttonstatus3);

        buttonstatus1display.on('click', this.change_status, this, 0);
        buttonstatus2display.on('click', this.change_status, this, 1);
        buttonstatus3display.on('click', this.change_status, this, 2);

        var buttonstatusdisplay = Y.Node.create("<div id='" + this.divcartridge + "_radioContainer' style='display:inline;'></div>");
        buttonstatusdisplay.append(buttonstatus1display);
        buttonstatusdisplay.append(buttonstatus2display);
        buttonstatusdisplay.append(buttonstatus3display);
        return buttonstatusdisplay;
    },
    /**
     * get the html node for the button to set visibility on right
     * @return node
     */
    get_button_visibility_right: function () {
        var buttonvisibility = "<button id='" + this.divcartridge + "_buttonedit_right' ";
        buttonvisibility += "><img src='";
        buttonvisibility += M.util.image_url('t/right', 'core');
        buttonvisibility += "' /></button>";
        var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
        buttonvisibilitydisplay.on('click', this.change_visibility_annot, this, 'r');
        return buttonvisibilitydisplay;
    },
    /**
     * get the html node for the button to set visibility on left
     * @return node
     */
    get_button_visibility_left: function () {
        var buttonvisibility = "<button id='" + this.divcartridge + "_buttonedit_left' ";
        buttonvisibility += "><img src='";
        buttonvisibility += M.util.image_url('t/left', 'core');
        buttonvisibility += "' /></button>";
        var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
        buttonvisibilitydisplay.on('click', this.change_visibility_annot, this, 'l');
        return buttonvisibilitydisplay;
    },
    /**
     * get the html node for the button to save the text in the annotation
     * @return node
     */
    get_button_save: function () {
        var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
        var buttonsavedisplay = Y.Node.create(buttonsave);
        buttonsavedisplay.on('click', this.save_annot, this, null);
        return buttonsavedisplay;
    },
    /**
     * get the html node for the button to cancel the text edition of the annotation
     * @return node
     */
    get_button_cancel: function () {
        var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
        var buttoncanceldisplay = Y.Node.create(buttoncancel);
        buttoncanceldisplay.on('click', this.cancel_edit, this);
        return buttoncanceldisplay;
    },
    /**
     * get the html node for the button to set a question
     * @return node
     */
    get_button_question: function () {
        var buttonquestion = "<button id='" + this.divcartridge + "_buttonquestion' style='display:none;margin-left:10px;'><img src='" + M.util.image_url('help_no', 'assignfeedback_editpdfplus') + "' /></button>";
        var buttonquestiondisplay = Y.Node.create(buttonquestion);
        buttonquestiondisplay.on('click', this.change_question_status, this);
        return buttonquestiondisplay;
    },
    /**
     * get the html node for the button to remove the annotation
     * @return node
     */
    get_button_remove: function () {
        var buttontrash = "<button id='" + this.divcartridge + "_buttonremove' style='display:none;margin-left:10px;'><img src='" + M.util.image_url('trash', 'assignfeedback_editpdfplus') + "' /></button>";
        var buttontrashdisplay = Y.Node.create(buttontrash);
        buttontrashdisplay.on('click', this.remove_by_trash, this);
        return buttontrashdisplay;
    },
    /**
     * get the html node for the hidden input to keep information about question state
     * @return node
     */
    get_input_question: function () {
        var qst = 0;
        if (this.answerrequested && this.answerrequested === 1) {
            qst = 1;
        }
        return Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_question' value='" + qst + "'/>");
    },
    /**
     * get the final reference text value
     * @return node
     */
    get_valref: function () {
        if (this.textannot && this.textannot.length > 0 && typeof this.textannot === 'string') {
            return this.textannot;
        }
        return '';
    },
    /**
     * get the html node for the hidden input to keep real reference text value
     * @return node
     * @deprecated since 11/16
     */
    get_input_valref: function () {
        return Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_valref' value=\"" + this.get_valref() + "\"/>");
    },
    /**
     * display the annotation according to parameters and profile
     * @return node
     */
    apply_visibility_annot: function () {
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
    },
    /**
     * get the html node for the text to display for the annotation, according to parameters
     * @return node
     */
    get_text_to_diplay_in_cartridge: function () {
        //var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
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
    },
    /**
     * change the visibility of the annotation according to parameters and variable sens
     * @param {type} e
     * @param {char} sens
     */
    change_visibility_annot: function (e, sens) {
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var finalvalue = parseInt(interrupt.get('value'));
        if (sens === 'r') {
            finalvalue += 1;
        } else {
            finalvalue -= 1;
        }
        interrupt.set('value', finalvalue);
        this.displaylock = finalvalue;
        this.apply_visibility_annot();
        this.editor.save_current_page();
    },
    /**
     * change question status of the annotation (with or not)
     */
    change_question_status: function () {
        var questionvalue = this.editor.get_dialogue_element('#' + this.divcartridge + "_question");
        var value = parseInt(questionvalue.get('value'));
        var finalvalue = 0;
        if (value === 0) {
            finalvalue = 1;
        }
        questionvalue.set('value', finalvalue);
        this.answerrequested = finalvalue;
        this.apply_question_status();
        this.editor.save_current_page();
    },
    /**
     * change student status of the annotation
     * @param {type} e
     * @param {int} idclick value of new status
     */
    change_status: function (e, idclick) {
        this.studentstatus = idclick;
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_studentanswer");
        if (input) {
            this.studentanswer = input.get('value');
        }

        var shapesChildren = this.editor.annotationsparent[this.id];
        if (shapesChildren) {
            for (var i = 0; i < shapesChildren.length; i++) {
                shapesChildren[i].studentstatus = idclick;
            }
        }

        this.editor.save_current_page_edited();
        this.hide_edit();
    },
    /**
     * change question set of the annotation
     * @return null
     */
    apply_question_status: function () {
        var buttonquestion = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonquestion");
        var questionvalue = this.editor.get_dialogue_element('#' + this.divcartridge + "_question");
        var value = 0;
        if (questionvalue) {
            value = parseInt(questionvalue.get('value'));
        }
        if (buttonquestion) {
            if (value === 1) {
                buttonquestion.one('img').setAttribute('src', M.util.image_url('help', 'core'));
            } else {
                buttonquestion.one('img').setAttribute('src', M.util.image_url('help_no', 'assignfeedback_editpdfplus'));
            }
        }
        return;
    },
    /**
     * drag-and-drop start
     * @param {type} e
     */
    move_cartridge_begin: function (e) {
        e.preventDefault();
        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        this.oldx = point.x;
        this.oldy = point.y;
        /*var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
         divcartridge.on('mousemove', this.move_cartridge_continue, this);
         divcartridge.on('mouseup', this.move_cartridge_stop, this);*/
        canvas.on('mousemove', this.move_cartridge_continue, this);
        canvas.on('mouseup', this.move_cartridge_stop, this);
    },
    /**
     * drag-and-drop process
     * @param {type} e
     */
    move_cartridge_continue: function (e) {
        e.preventDefault();

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.x + this.cartridgex + diffx);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey + diffy);
    },
    /**
     * drag-and-drop stop
     * @param {type} e
     */
    move_cartridge_stop: function (e) {
        e.preventDefault();

        /*var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
         divcartridge.detach('mousemove', this.move_cartridge_continue, this);
         divcartridge.detach('mouseup', this.move_cartridge_stop, this);*/
        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        //var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        canvas.detach('mousemove', this.move_cartridge_continue, this);
        canvas.detach('mouseup', this.move_cartridge_stop, this);

        //var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
        var clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        this.cartridgex += diffx;
        this.cartridgey += diffy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.x + this.cartridgex);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey);

        this.editor.save_current_page();
    },
    /**
     * global method, draw empty cartridge
     * @param {type} edit
     */
    draw_catridge: function (edit) {
        return true;
    },
    /**
     * display annotation view
     * @param {type} e
     * @param {string} clickType
     */
    view_annot: function (e, clickType) {
        if (!clickType || !(clickType === 'click' && this.editor.currentannotationreview === this)) {
            this.editor.currentannotationreview = this;
            if (this.tooltype.type <= TOOLTYPE.COMMENTPLUS && !this.parent_annot_element) {
                var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
                var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
                var divvisu = this.editor.get_dialogue_element('#' + this.divcartridge + "_visu");
                var buttonstatus = this.editor.get_dialogue_element('#' + this.divcartridge + "_radioContainer");
                var studentstatusinput = Y.all("[name=" + this.divcartridge + "_status]");
                divdisplay.hide();
                divvisu.show();
                if (this.answerrequested === 1) {
                    var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_studentanswer");
                    if (input) {
                        input.set(this.studentanswer);
                    }
                }
                for (var i = 0; i < studentstatusinput.size(); i++) {
                    var tmp = studentstatusinput.item(i);
                    if (parseInt(tmp.get('value')) === this.studentstatus) {
                        tmp.set('checked', true);
                    } else {
                        tmp.set('checked', false);
                    }
                }
                buttonstatus.show();
                buttonstatus.set('style', 'display:inline;color:' + this.get_color_cartridge() + ';');
                divprincipale.setStyle('z-index', 1000);
                this.disabled_canvas_event();
                divprincipale.detach();
                divprincipale.on('clickoutside', this.hide_edit, this, 'clickoutside');
            }
        } else {
            this.editor.currentannotationreview = null;
        }
    },
    /**
     * display annotation edditing view
     * @param {type} e
     */
    edit_annot: function (e) {
        if (this.tooltype.type <= TOOLTYPE.COMMENTPLUS && !this.parent_annot_element) {
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
    },
    /**
     * fill input edition with new text
     * @param {type} e
     * @param {string} unputtext
     */
    fill_input_edition: function (e, unputtext) {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        if (input) {
            input.set('value', unputtext);
        }
        this.save_annot(unputtext);
    },
    save_annot_clickout: function (e, clickType) {
        if (!(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
            this.save_annot(null);
        }
        return;
    },
    /**
     * save text annotation
     * @param {string} result
     */
    save_annot: function (result) {
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
        //var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
        //valref.set('value', result);
        this.hide_edit();
        this.apply_visibility_annot();
    },
    /**
     * save student answer
     * @param {type} e
     */
    save_studentanswer: function (e) {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_studentanswer");
        if (input) {
            this.studentanswer = input.get('value');
            this.editor.save_current_page_edited();
        }
        this.hide_edit();
        this.apply_visibility_annot();
    },
    /**
     * cancel annotation detail view
     * @param {type} e
     * @param {string} clickType
     */
    cancel_edit: function (e, clickType) {
        if (!(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
            //var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
            var valref = this.get_valref();
            var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
            if (valref && input) {
                //var result = valref.get('value');
                //input.set('value', result);
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
    },
    /**
     * remove annotation detail view
     * @param {type} e
     * @param {string} clickType
     */
    hide_edit: function (e, clickType) {
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
    },
    /**
     * remove annotation by clicking on a button
     * @param {type} e
     */
    remove_by_trash: function (e) {
        this.cancel_edit();
        this.remove(e);
    },
    /**
     * Delete an annotation
     * @protected
     * @method remove
     * @param {event} e
     */
    remove: function (e) {
        var annotations,
                i;
        e.preventDefault();
        annotations = this.editor.pages[this.editor.currentpage].annotations;
        for (i = 0; i < annotations.length; i++) {
            if (annotations[i] === this) {
                annotations.splice(i, 1);
                if (this.drawable) {
                    this.drawable.erase();
                }
                this.editor.currentannotation = false;
                this.editor.save_current_page();
                return;
            }
        }
    },
    /**
     * Move an annotation to a new location.
     * @public
     * @param {int} newx
     * @param {int} newy
     * @method move_annotation
     */
    move: function (newx, newy) {
        var diffx = newx - this.x,
                diffy = newy - this.y,
                newpath, oldpath, xy,
                x, y;
        this.x += diffx;
        this.y += diffy;
        this.endx += diffx;
        this.endy += diffy;
        if (this.path) {
            newpath = [];
            oldpath = this.path.split(':');
            Y.each(oldpath, function (position) {
                xy = position.split(',');
                x = parseInt(xy[0], 10);
                y = parseInt(xy[1], 10);
                newpath.push((x + diffx) + ',' + (y + diffy));
            });
            this.path = newpath.join(':');
        }
        if (this.drawable) {
            this.drawable.erase();
        }
        this.editor.drawables.push(this.draw());
    },
    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param {M.assignfeedback_editpdfplus.edit} edit
     */
    draw_current_edit: function (edit) {
        var noop = edit && false;
        // Override me please.
        return noop;
    },
    /**
     * Promote the current edit to a real annotation.
     *
     * @public
     * @method init_from_edit
     * @param {M.assignfeedback_editpdfplus.edit} edit
     * @return bool if width/height is more than min. required.
     */
    init_from_edit: function (edit) {
        var bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([edit.start, edit.end]);
        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = bounds.y;
        this.endx = bounds.x + bounds.width;
        this.endy = bounds.y + bounds.height;
        this.colour = edit.annotationcolour;
        this.path = '';
        return (bounds.has_min_width() && bounds.has_min_height());
    },
    /**
     * Disable canvas event (click on other tool or annotation)
     */
    disabled_canvas_event: function () {
        var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        drawingcanvas.detach();
    },
    /**
     * Enable canvas event (click on other tool or annotation)
     */
    enabled_canvas_event: function () {
        var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        drawingcanvas.on('gesturemovestart', this.editor.edit_start, null, this.editor);
        drawingcanvas.on('gesturemove', this.editor.edit_move, null, this.editor);
        drawingcanvas.on('gesturemoveend', this.editor.edit_end, null, this.editor);
    }

});
M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotation = ANNOTATION;
