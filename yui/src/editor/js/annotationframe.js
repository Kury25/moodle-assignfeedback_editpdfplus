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
 * @class annotationframe
 * @extends M.assignfeedback_editpdfplus.annotation
 * @module moodle-assignfeedback_editpdfplus-editor
 */
var ANNOTATIONFRAME = function (config) {
    ANNOTATIONFRAME.superclass.constructor.apply(this, [config]);
};

ANNOTATIONFRAME.NAME = "annotationframe";
ANNOTATIONFRAME.ATTRS = {};

Y.extend(ANNOTATIONFRAME, M.assignfeedback_editpdfplus.annotation, {
    children: [],
    oldx: 0,
    oldy: 0,
    /**
     * Draw a highlight annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw: function () {
        var drawable,
                shape,
                bounds,
                highlightcolour;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);
        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(this.x, this.y),
            new M.assignfeedback_editpdfplus.point(this.endx, this.endy)]);

        highlightcolour = this.get_color();

        //var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        this.shape_id = 'ct_frame_' + (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        shape = this.editor.graphic.addShape({
            id: this.shape_id,
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            stroke: {
                weight: 2,
                color: this.get_color()
            },
            x: bounds.x,
            y: bounds.y
        });
        if (this.borderstyle === 'dashed') {
            shape.set("stroke", {
                dashstyle: [5, 3]
            });
        } else if (this.borderstyle === 'dotted') {
            shape.set("stroke", {
                dashstyle: [2, 2]
            });
        }
        //Y.log('draw : ' + this.shape_id);

        drawable.shapes.push(shape);
        this.drawable = drawable;

        this.draw_catridge();

        return ANNOTATIONFRAME.superclass.draw.apply(this);
    },
    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit: function (edit) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
                shape,
                bounds,
                highlightcolour;

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(edit.start.x, edit.start.y),
            new M.assignfeedback_editpdfplus.point(edit.end.x, edit.end.y)]);

        // Set min. width of highlight.
        if (!bounds.has_min_width()) {
            bounds.set_min_width();
        }

        highlightcolour = this.get_color();

        // We will draw a box with the current background colour.
        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: 16,
            stroke: {
                weight: 2,
                color: this.get_color()
            },
            x: bounds.x,
            y: edit.start.y - 8
        });
        if (this.borderstyle === 'dashed') {
            shape.set("stroke", {
                dashstyle: [5, 3]
            });
        } else if (this.borderstyle === 'dotted') {
            shape.set("stroke", {
                dashstyle: [2, 2]
            });
        }

        drawable.shapes.push(shape);

        return drawable;
    },
    /**
     * Promote the current edit to a real annotation.
     *
     * @public
     * @method init_from_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     * @return bool true if highlight bound is more than min width/height, else false.
     */
    init_from_edit: function (edit) {
        var bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([edit.start, edit.end]);

        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = edit.start.y - 8;
        this.endx = bounds.x + bounds.width;
        this.endy = edit.start.y + 16 - 8;
        //this.colour = edit.annotationcolour;
        this.page = '';

        return (bounds.has_min_width());
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
                diffy = newy - this.y;

        this.x += diffx;
        this.y += diffy;
        this.endx += diffx;
        this.endy += diffy;

        if (this.drawable) {
            this.drawable.erase();
        }
        this.editor.drawables.push(this.draw());
    },
    get_color: function () {
        return this.colour;
    },
    draw_catridge: function (edit) {
        if (this.parent_annot_element === null && this.parent_annot === 0) {
            var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
            if (this.divcartridge === '') {
                this.init_div_cartridge_id();
                var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);

                //init cartridge
                var colorcartridge = this.get_color();
                var divdisplay = this.get_div_cartridge(colorcartridge);
                divdisplay.addClass('assignfeedback_editpdfplus_frame');
                divdisplay.setStyles({'border-style': this.borderstyle});
                //divdisplay.set('draggable', 'true');

                // inscription entete
                var divcartridge = this.get_div_cartridge_label(colorcartridge, true);
                divdisplay.append(divcartridge);

                //creation input
                var divconteneurdisplay = this.get_div_container(colorcartridge);
                /*var divconteneur = "<div ";
                 divconteneur += "class='assignfeedback_editpdfplus_frame_conteneur' >";
                 divconteneur += "</div>";
                 var divconteneurdisplay = Y.Node.create(divconteneur);
                 var divinputdisplay = this.get_div_input(colorcartridge);
                 divinputdisplay.addClass('assignfeedback_editpdfplus_frame_input');
                 var inputvalref = this.get_input_valref();
                 var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
                 var buttonsavedisplay = Y.Node.create(buttonsave);
                 buttonsavedisplay.on('click', this.save_annot, this, null);
                 var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
                 var buttoncanceldisplay = Y.Node.create(buttoncancel);
                 buttoncanceldisplay.on('click', this.cancel_edit, this);*/
                if (!this.editor.get('readonly')) {
                    var buttonrender = "<button id='" + this.divcartridge + "_buttonpencil'><img src='";
                    buttonrender += M.util.image_url('e/text_highlight_picker', 'core');
                    buttonrender += "' /></button>";
                    var buttonrenderdisplay = Y.Node.create(buttonrender);
                    buttonrenderdisplay.on('click', this.display_picker, this);
                    var buttonadd = "<button id='" + this.divcartridge + "_buttonadd'><img src='";
                    buttonadd += M.util.image_url('t/add', 'core');
                    buttonadd += "' /></button>";
                    var buttonadddisplay = Y.Node.create(buttonadd);
                    buttonadddisplay.on('click', this.add_annot, this);
                    //divconteneurdisplay.append(divinputdisplay);
                    //divconteneurdisplay.append(inputvalref);
                    //divconteneurdisplay.append(buttonsavedisplay);
                    //divconteneurdisplay.append(buttoncanceldisplay);
                    divconteneurdisplay.append(buttonrenderdisplay);
                    divconteneurdisplay.append(buttonadddisplay);
                }
                //divdisplay.append(divconteneurdisplay);
                divdisplay.append(divconteneurdisplay);

                //creation de la div d'edition
                if (!this.editor.get('readonly')) {
                    var diveditiondisplay = this.get_div_edition();
                    diveditiondisplay.addClass('assignfeedback_editpdfplus_frame_edition');
                    divconteneurdisplay.append(diveditiondisplay);
                }

                //creation de la div palette
                if (!this.editor.get('readonly')) {
                    var diveditionrender = "<div ";
                    diveditionrender += "id='" + this.divcartridge + "_picker' ";
                    diveditionrender += "class='assignfeedback_editpdfplus_frame_picker' ";
                    diveditionrender += "style='display:none;text-align:right;'> ";
                    diveditionrender += "</div>";
                    var diveditionrenderdisplay = Y.Node.create(diveditionrender);
                    divconteneurdisplay.append(diveditionrenderdisplay);
                    var diveditioncolordisplay = Y.Node.create("<div style='display:inline-block;vertical-align:top;'></div>");
                    var diveditionframedisplay = Y.Node.create("<div style='display:inline-block;vertical-align:top;'></div>");
                    diveditionrenderdisplay.append(diveditioncolordisplay);
                    diveditionrenderdisplay.append(diveditionframedisplay);
                    var diveditionwhitedisplay = Y.Node.create("<div style='margin:5px;background-color:#FFFFFF;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionwhitedisplay.on('click', this.change_color, this, 'white');
                    var diveditionyellowdisplay = Y.Node.create("<div style='margin:5px;background-color:#FFCF35;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionyellowdisplay.on('click', this.change_color, this, '#FFCF35');
                    var diveditionreddisplay = Y.Node.create("<div style='margin:5px;background-color:#EF4540;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionreddisplay.on('click', this.change_color, this, '#EF4540');
                    var diveditiongreendisplay = Y.Node.create("<div style='margin:5px;background-color:#99CA3E;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditiongreendisplay.on('click', this.change_color, this, '#99CA3E');
                    var diveditionbluedisplay = Y.Node.create("<div style='margin:5px;background-color:#7D9FD3;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionbluedisplay.on('click', this.change_color, this, '#7D9FD3');
                    var diveditionblackdisplay = Y.Node.create("<div style='margin:5px;background-color:#333333;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionblackdisplay.on('click', this.change_color, this, 'black');
                    diveditioncolordisplay.append(diveditionwhitedisplay);
                    diveditioncolordisplay.append(diveditionyellowdisplay);
                    diveditioncolordisplay.append(diveditionreddisplay);
                    diveditioncolordisplay.append(diveditiongreendisplay);
                    diveditioncolordisplay.append(diveditionbluedisplay);
                    diveditioncolordisplay.append(diveditionblackdisplay);
                    var diveditionsoliddisplay = Y.Node.create("<div style='margin:5px;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionsoliddisplay.on('click', this.change_border, this, 'solid');
                    var diveditiondotteddisplay = Y.Node.create("<div style='margin:5px;border:2px dotted #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditiondotteddisplay.on('click', this.change_border, this, 'dotted');
                    var diveditiondasheddisplay = Y.Node.create("<div style='margin:5px;border:2px dashed #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditiondasheddisplay.on('click', this.change_border, this, 'dashed');
                    diveditionframedisplay.append(diveditionsoliddisplay);
                    diveditionframedisplay.append(diveditiondotteddisplay);
                    diveditionframedisplay.append(diveditiondasheddisplay);
                }

                //positionnement de la div par rapport a l'annotation
                if (!this.cartridgex || this.cartridgex === 0) {
                    this.cartridgex = parseInt(this.tooltypefamille.cartridge_x);
                }
                if (!this.cartridgey || this.cartridgey === 0) {
                    this.cartridgey = parseInt(this.tooltypefamille.cartridge_y);
                }
                divdisplay.setX(this.cartridgex);
                divdisplay.setY(this.y + this.cartridgey);
                drawingregion.append(divdisplay);

                this.apply_visibility_annot();
                if (!this.editor.get('readonly')) {
                    var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
                    buttonplus.hide();
                }

            } else {
                var divid = '#' + this.divcartridge;
                var divdisplay = this.editor.get_dialogue_element(divid);
                divdisplay.setX(offsetcanvas[0] + this.cartridgex);
                divdisplay.setY(offsetcanvas[1] + this.y + this.cartridgey);
            }
        }
        return true;
    },
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
        divcartridge.setX(offsetcanvas[0] + this.cartridgex + diffx);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey + diffy);
    },
    move_cartridge_stop: function (e) {
        e.preventDefault();

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.detach('mousemove', this.move_cartridge_continue, this);
        divcartridge.detach('mouseup', this.move_cartridge_stop, this);

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        this.cartridgex += diffx;
        this.cartridgey += diffy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.cartridgex);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey);

        this.editor.save_current_page();
    },
    /*apply_visibility_annot: function () {
     var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
     var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
     if (valref === '') {
     if (this.editor.get('readonly')) {
     divdisplay.setContent('');
     } else {
     divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
     }
     } else if (valref !== '') {
     divdisplay.setContent(valref);
     }
     },*/
    add_annot: function (e) {
        this.editor.currentedit.parent_annot_element = this;
        this.editor.handle_tool_button(e, TOOLTYPELIB.FRAME, 'ctbutton' + this.toolid, 1);
    },
    display_picker: function () {
        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        var buttonrenderdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
        divcartridge.setStyle('z-index', 1000);
        divpalette.show();
        //divpalette.setStyle('z-index', 1000);
        buttonrenderdisplay.on('click', this.hide_picker, this);
    },
    hide_picker: function () {
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        var buttonrenderdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divpalette.hide();
        //divcartridge.setStyle('z-index', 0);
        divcartridge.setStyle('z-index', 0);
        buttonrenderdisplay.on('click', this.display_picker, this);
    },
    change_color: function (e, colour) {
        this.colour = colour;
        var shape = this.editor.graphic.getShapeById(this.shape_id);
        shape.set("stroke", {
            color: this.colour
        });
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] && (this.children[i].parent_annot === this.id || this.children[i].parent_annot_element.divcartridge === this.divcartridge)) {
                this.children[i].colour = colour;
                var shapechd = this.editor.graphic.getShapeById(this.children[i].shape_id);
                if (shapechd) {
                    shapechd.set("stroke", {
                        color: this.colour
                    });
                }
            }
        }
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        divprincipale.setStyles({
            'border-color': this.colour,
            'color': this.colour
        });
        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.setStyles({
            'border-color': this.colour,
            'color': this.colour
        });
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        divdisplay.setStyles({
            'color': this.colour
        });
        this.hide_picker();
        this.editor.save_current_page();
    },
    change_border: function (e, border) {
        this.borderstyle = border;
        var shape = this.editor.graphic.getShapeById(this.shape_id);
        if (this.borderstyle === 'solid') {
            shape.set("stroke", {
                dashstyle: 'none'
            });
        } else if (this.borderstyle === 'dashed') {
            shape.set("stroke", {
                dashstyle: [5, 3]
            });
        } else {
            shape.set("stroke", {
                dashstyle: [2, 2]
            });
        }
        for (i = 0; i < this.children.length; i++) {
            if (this.children[i] && (this.children[i].parent_annot === this.id || this.children[i].parent_annot_element.divcartridge === this.divcartridge)) {
                this.children[i].borderstyle = border;
                var shapechd = this.editor.graphic.getShapeById(this.children[i].shape_id);
                if (shapechd) {
                    if (this.borderstyle === 'solid') {
                        shapechd.set("stroke", {
                            dashstyle: 'none'
                        });
                    } else if (this.borderstyle === 'dashed') {
                        shapechd.set("stroke", {
                            dashstyle: [5, 3]
                        });
                    } else {
                        shapechd.set("stroke", {
                            dashstyle: [2, 2]
                        });
                    }
                }
            }
        }
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        divprincipale.setStyles({
            'border-style': this.borderstyle
        });
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        divpalette.hide();
        //Y.log('change_border : ' + this.borderstyle);
        this.editor.save_current_page();
    },
    edit_annot: function (e) {
        if (!this.parent_annot_element) {
            var buttonrender = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
            var buttonadd = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonadd");
            this.hide_picker();
            buttonrender.hide();
            buttonadd.hide();
            ANNOTATIONFRAME.superclass.edit_annot.call(this);
        }
    },
    hide_edit: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        var buttonrender = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
        var buttonadd = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonadd");
        divdisplay.show();
        divdisplay.set('style', 'display:inline;color:' + this.get_color() + ';');
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        buttonrender.show();
        buttonadd.show();
        divdisplay.setStyle('z-index', 1);

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
                if (this.divcartridge !== '') {
                    var divid = '#' + this.divcartridge;
                    //Y.log('draw_catridge : ' + divid);
                    var divdisplay = this.editor.get_dialogue_element(divid);
                    divdisplay.remove();
                }
                annotations.splice(i, 1);
                if (this.drawable) {
                    this.drawable.erase();
                }
                if (this.children && this.children.length > 0) {
                    for (i = 0; i < this.children.length; i++) {
                        if (this.children[i] && (this.children[i].parent_annot === this.id || this.children[i].parent_annot_element.divcartridge === this.divcartridge)) {
                            for (var j = 0; j < annotations.length; j++) {
                                if (annotations[j] === this.children[i]) {
                                    annotations.splice(j, 1);
                                    if (this.children[i].drawable) {
                                        this.children[i].drawable.erase();
                                    }
                                }
                            }
                        }
                    }
                }
                this.editor.currentannotation = false;
                this.editor.save_current_page();
                return;
            }
        }
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationframe = ANNOTATIONFRAME;
