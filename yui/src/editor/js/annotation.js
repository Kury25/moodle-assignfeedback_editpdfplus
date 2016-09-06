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
    tooltype: null,
    tooltypefamille: null,
    divcartridge: '',
    textannot: '',
    displaylock: 0,
    displayrotation: 0,
    borderstyle: '',
    parent_annot: 0,
    parent_annot_element: null,
    id: 0,
    shape_id: '',
    cartridgex: 0,
    cartridgey: 0,
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
            this.x = parseInt(config.x, 10) || 0;
            this.y = parseInt(config.y, 10) || 0;
            this.endx = parseInt(config.endx, 10) || 0;
            this.endy = parseInt(config.endy, 10) || 0;
            this.cartridgex = parseInt(config.parent_annot_element.cartridgex, 10) || 0;
            this.cartridgey = parseInt(config.parent_annot_element.cartridgey, 10) || 0;
            this.path = config.path || '';
            this.toolid = config.toolid || this.editor.get_dialogue_element(TOOLTYPE.RECTANGLE);
            this.colour = config.parent_annot_element.colour || 'red';
            this.drawable = false;
            this.tooltype = config.tooltype;
            this.textannot = config.parent_annot_element.textannot;
            this.displaylock = config.parent_annot_element.displaylock;
            this.displayrotation = config.parent_annot_element.displayrotation;
            this.borderstyle = config.parent_annot_element.borderstyle || 'solid';
            this.parent_annot = config.parent_annot_element.id;
            this.parent_annot_element = config.parent_annot_element;
            config.parent_annot_element.children.push(this);
        } else {
            this.editor = config.editor || null;
            this.gradeid = parseInt(config.gradeid, 10) || 0;
            this.pageno = parseInt(config.pageno, 10) || 0;
            this.x = parseInt(config.x, 10) || 0;
            this.y = parseInt(config.y, 10) || 0;
            this.endx = parseInt(config.endx, 10) || 0;
            this.endy = parseInt(config.endy, 10) || 0;
            this.cartridgex = parseInt(config.cartridgex, 10) || 0;
            this.cartridgey = parseInt(config.cartridgey, 10) || 0;
            this.path = config.path || '';
            this.toolid = config.toolid || this.editor.get_dialogue_element(TOOLTYPE.RECTANGLE);
            this.colour = config.colour || 'red';
            this.drawable = false;
            this.tooltype = config.tooltype;
            this.textannot = config.textannot;
            this.displaylock = config.displaylock;
            this.displayrotation = config.displayrotation;
            this.borderstyle = config.borderstyle || 'solid';
            this.parent_annot = config.parent_annot;
            this.id = config.id;
        }
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
                parent_annot: this.parent_annot,
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
            parent_annot: this.parent_annot,
            divcartridge: this.divcartridge,
            parent_annot_div: ''
        };
    },
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
    init_div_cartridge_id: function () {
        var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
    },
    get_div_cartridge: function (colorcartridge) {
        var div = "<div ";
        div += "id='" + this.divcartridge + "' ";
        div += "class='assignfeedback_editpdfplus_cartridge' ";
        div += "style='border-color: " + colorcartridge + ";'> ";
        div += "</div>";
        return Y.Node.create(div);
    },
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
    get_div_edition: function () {
        var divedition = "<div ";
        divedition += "id='" + this.divcartridge + "_edit' ";
        divedition += "style='display:none;'> ";
        divedition += "<input id='" + this.divcartridge + "_editinput' type='text' value=\"" + this.get_valref() + "\" />";
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
    get_div_container: function (colorcartridge) {
        var divconteneur = "<div ";
        divconteneur += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_conteneur' >";
        divconteneur += "</div>";
        var divconteneurdisplay = Y.Node.create(divconteneur);
        var divinputdisplay = this.get_div_input(colorcartridge);
        divinputdisplay.addClass('assignfeedback_editpdfplus_' + this.tooltypefamille.label + '_input');
        var inputvalref = this.get_input_valref();
        var onof = 0;
        if (this.displaylock === '1') {
            onof = 1;
        }
        var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
        var readonly = this.editor.get('readonly');
        if (!readonly) {
            divinputdisplay.on('click', this.edit_annot, this);
        }
        divconteneurdisplay.append(divinputdisplay);
        divconteneurdisplay.append(inputvalref);
        divconteneurdisplay.append(inputonof);

        var readonly = this.editor.get('readonly');
        if (!readonly) {
            divconteneurdisplay.append(this.get_button_visibility());
            divconteneurdisplay.append(this.get_button_save());
            divconteneurdisplay.append(this.get_button_cancel());
        }

        return divconteneurdisplay;
    },
    get_button_visibility: function () {
        var buttonvisibility = "<button id='" + this.divcartridge + "_buttonedit' ";
        buttonvisibility += "><img src='";
        if (this.displaylock === 1) {
            buttonvisibility += M.util.image_url('t/left', 'core');
        } else {
            buttonvisibility += M.util.image_url('t/right', 'core');
        }
        buttonvisibility += "' /></button>";
        var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
        buttonvisibilitydisplay.on('click', this.change_visibility_annot, this);
        return buttonvisibilitydisplay;
    },
    get_button_save: function () {
        var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
        var buttonsavedisplay = Y.Node.create(buttonsave);
        buttonsavedisplay.on('click', this.save_annot, this, null);
        return buttonsavedisplay;
    },
    get_button_cancel: function () {
        var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
        var buttoncanceldisplay = Y.Node.create(buttoncancel);
        buttoncanceldisplay.on('click', this.cancel_edit, this);
        return buttoncanceldisplay;
    },
    get_valref: function () {
        if (this.textannot && this.textannot.length > 0 && typeof this.textannot === 'string') {
            return this.textannot;
        }
        return '';
    },
    get_input_valref: function () {
        return Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_valref' value=\"" + this.get_valref() + "\"/>");
    },
    apply_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        if (valref === '') {
            if (this.editor.get('readonly')) {
                divdisplay.setContent('');
            } else {
                divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
            }
        }
        if (interrupt.get('value') === '0') {
            if (valref !== '') {
                divdisplay.setContent(valref.substr(0, 20));
            }
            if (buttonplus) {
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/right', 'core'));
            }
        } else {
            if (valref !== '') {
                divdisplay.setContent(valref);
            }
            if (buttonplus) {
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/left', 'core'));
            }
        }
    },
    change_visibility_annot: function () {
        //var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        // var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        //var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        // if (valref === '') {
        //     divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
        // }
        if (interrupt.get('value') === '0') {
            interrupt.set('value', 1);
            this.displaylock = 1;
        } else {
            interrupt.set('value', 0);
            this.displaylock = 2;
        }
        this.apply_visibility_annot();
        this.editor.save_current_page();
    },
    move_cartridge_begin: function (e) {
        e.preventDefault();

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);

        this.oldx = point.x;
        this.oldy = point.y;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.on('mousemove', this.move_cartridge_continue, this);
        divcartridge.on('mouseup', this.move_cartridge_stop, this);
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
    draw_catridge: function (edit) {
        return true;
    },
    edit_annot: function (e) {
        if (this.tooltype.type <= TOOLTYPE.COMMENTPLUS && !this.parent_annot_element) {
            var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
            var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
            var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
            var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
            var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
            var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
            var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
            divdisplay.hide();
            if (buttonplus) {
                buttonplus.hide();
            }
            divedit.show();
            buttonsave.show();
            buttoncancel.show();
            divprincipale.setStyle('z-index', 1000);
            input.set('focus', 'on');

            this.disabled_canvas_event();
            divprincipale.on('clickoutside', this.cancel_edit, this, 'clickoutside');
        }
    },
    fill_input_edition: function (e, unputtext) {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        if (input) {
            input.set('value', unputtext);
        }
        this.save_annot(unputtext);
    },
    save_annot: function (result) {
        if (typeof result !== 'string') {
            var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
            result = input.get('value');
        }
        this.textannot = result;
        this.editor.save_current_page();
        if (result.length === 0) {
            result = "&nbsp;&nbsp;";
        }
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
        valref.set('value', result);
        this.hide_edit();
        this.apply_visibility_annot();
    },
    cancel_edit: function (e, clickType) {
        if (!(clickType === 'clickoutside' && this.editor.currentannotation === this)) {
            var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
            var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
            if (valref) {
                var result = valref.get('value');
                input.set('value', result);
            }
            this.hide_edit();
            var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
            divprincipale.detach();
        }
        return;
    },
    hide_edit: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        if (divdisplay) {
            divdisplay.show();
            divdisplay.set('style', 'display:inline;color:' + this.get_color_cartridge() + ';');
        }
        buttonplus.show();
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        divprincipale.setStyle('z-index', 1);

        this.enabled_canvas_event();
    },
    /**
     * Delete an annotation
     * @protected
     * @method remove
     * @param event
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
     * @param int newx
     * @param int newy
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
     * @param M.assignfeedback_editpdfplus.edit edit
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
     * @param M.assignfeedback_editpdfplus.edit edit
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
    disabled_canvas_event: function () {
        var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        drawingcanvas.detach();
    },
    enabled_canvas_event: function () {
        var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        drawingcanvas.on('gesturemovestart', this.editor.edit_start, null, this.editor);
        drawingcanvas.on('gesturemove', this.editor.edit_move, null, this.editor);
        drawingcanvas.on('gesturemoveend', this.editor.edit_end, null, this.editor);
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotation = ANNOTATION;
