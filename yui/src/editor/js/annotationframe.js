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
    shape_id: '',
    children: [],
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
        Y.log('draw : ' + this.shape_id);

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
    get_color_cartridge: function () {
        var highlightcolour = ANNOTATIONCOLOUR[this.tooltype.cartridge_color];
        if (!highlightcolour) {
            highlightcolour = this.tooltype.cartridge_color;
        } else {
            // Add an alpha channel to the rgb colour.
            highlightcolour = highlightcolour.replace('rgb', 'rgba');
            highlightcolour = highlightcolour.replace(')', ',0.5)');
        }
        if (highlightcolour === '') {
            return TOOLTYPEDEFAULTCOLOR.FRAMECARTRIDGE;
        }
        //Y.log('get_color_cartridge : ' + highlightcolour);
        return highlightcolour;
    },
    draw_catridge: function (edit) {
        if (this.parent_annot_element === null && this.parent_annot === 0) {
            var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
            if (this.divcartridge === '') {
                var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
                this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
                var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION);
                var cartridge = this.tooltype.cartridge;
                //Y.log('draw_catridge : ' + cartridge);
                var colorcartridge = this.get_color();
                var div = "<div ";
                div += "id='" + this.divcartridge + "' ";
                div += "class='assignfeedback_editpdfplus_frame' ";
                div += "style='border-color: " + colorcartridge + ";border-style: " + this.borderstyle + "'> ";
                div += "</div>";
                var divdisplay = Y.Node.create(div);

                // inscription entete
                var divcartridge = "<div ";
                divcartridge += "id='" + this.divcartridge + "_cartridge' ";
                divcartridge += "class='assignfeedback_editpdfplus_frame_cartridge' ";
                divcartridge += "style='border-right-color: " + colorcartridge + ";color:" + colorcartridge + ";'> ";
                divcartridge += cartridge;
                divcartridge += "</div>";
                divdisplay.append(Y.Node.create(divcartridge));

                //creation input
                var divconteneur = "<div ";
                divconteneur += "class='assignfeedback_editpdfplus_frame_conteneur' >";
                divconteneur += "</div>";
                var divconteneurdisplay = Y.Node.create(divconteneur);
                var divinput = "<div ";
                divinput += "id='" + this.divcartridge + "_display' ";
                divinput += "class='assignfeedback_editpdfplus_frame_input' ";
                divinput += "style='color:" + colorcartridge + ";'> ";
                if (this.textannot && this.textannot.length > 0) {
                    divinput += this.textannot.substr(0, 20);
                } else {
                    divinput += '&nbsp;&nbsp;';
                }
                divinput += "</div>";
                var divinputdisplay = Y.Node.create(divinput);
                divinputdisplay.on('click', this.edit_annot, this);
                var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
                var buttonsavedisplay = Y.Node.create(buttonsave);
                buttonsavedisplay.on('click', this.save_annot, this);
                var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/delete', 'core') + "' /></button>";
                var buttoncanceldisplay = Y.Node.create(buttoncancel);
                buttoncanceldisplay.on('click', this.hide_edit, this);
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
                divconteneurdisplay.append(divinputdisplay);
                divconteneurdisplay.append(buttonsavedisplay);
                divconteneurdisplay.append(buttoncanceldisplay);
                divconteneurdisplay.append(buttonrenderdisplay);
                divconteneurdisplay.append(buttonadddisplay);
                divdisplay.append(divconteneurdisplay);

                //creation de la div d'edition
                var divedition = "<div ";
                divedition += "id='" + this.divcartridge + "_edit' ";
                divedition += "class='assignfeedback_editpdfplus_frame_edition' ";
                divedition += "style='display:none;'> ";
                divedition += "<input id='" + this.divcartridge + "_editinput' type='text' value=\"" + this.textannot + "\" />";
                divedition += "</div>";
                var diveditiondisplay = Y.Node.create(divedition);
                divconteneurdisplay.append(diveditiondisplay);
                var propositions = this.tooltype.texts;
                //Y.log('draw_catridge : ' + propositions);
                var divproposition = "<div></div>";
                var divpropositiondisplay = Y.Node.create(divproposition);
                if (propositions && propositions.length > 0) {
                    var propositionarray = propositions.split('","');
                    for (i = 0; i < propositionarray.length; i++) {
                        var buttontmp = "<p class='btn btn-default'>" + propositionarray[i].replace('"', '') + "</p>";
                        var buttontmpdisplay = Y.Node.create(buttontmp);
                        buttontmpdisplay.on('click', this.fill_input_edition, this, propositionarray[i].replace('"', ''));
                        divpropositiondisplay.append(buttontmpdisplay);
                    }

                }
                diveditiondisplay.append(divpropositiondisplay);

                //creation de la div palette
                var divedition = "<div ";
                divedition += "id='" + this.divcartridge + "_picker' ";
                divedition += "class='assignfeedback_editpdfplus_frame_picker' ";
                divedition += "style='display:none;text-align:right;'> ";
                divedition += "</div>";
                var diveditiondisplay = Y.Node.create(divedition);
                divdisplay.append(diveditiondisplay);
                var diveditioncolordisplay = Y.Node.create("<div style='display:inline-block;vertical-align:top;'></div>");
                var diveditionframedisplay = Y.Node.create("<div style='display:inline-block;vertical-align:top;'></div>");
                diveditiondisplay.append(diveditioncolordisplay);
                diveditiondisplay.append(diveditionframedisplay);
                var diveditionwhitedisplay = Y.Node.create("<div style='margin:5px;background-color:white;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                diveditionwhitedisplay.on('click', this.change_color, this, 'white');
                var diveditionyellowdisplay = Y.Node.create("<div style='margin:5px;background-color:orange;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                diveditionyellowdisplay.on('click', this.change_color, this, 'orange');
                var diveditionreddisplay = Y.Node.create("<div style='margin:5px;background-color:red;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                diveditionreddisplay.on('click', this.change_color, this, 'red');
                var diveditiongreendisplay = Y.Node.create("<div style='margin:5px;background-color:green;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                diveditiongreendisplay.on('click', this.change_color, this, 'green');
                var diveditionbluedisplay = Y.Node.create("<div style='margin:5px;background-color:blue;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                diveditionbluedisplay.on('click', this.change_color, this, 'blue');
                var diveditionblackdisplay = Y.Node.create("<div style='margin:5px;background-color:black;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
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

                //positionnement de la div par rapport a l'annotation
                divdisplay.setX(offsetcanvas[0] + 5);
                divdisplay.setY(this.y - 8);
                drawingregion.append(divdisplay);

            } else {
                var divid = '#' + this.divcartridge;
                //Y.log('draw_catridge : ' + divid);
                var divdisplay = this.editor.get_dialogue_element(divid);
                divdisplay.setX(offsetcanvas[0] + 5);
                divdisplay.setY(offsetcanvas[1] + this.y - 8);
            }
        }
        return true;
    },
    add_annot: function (e) {
        //var new_frame = this.clone();
        this.editor.currentedit.parent_annot_element = this;
        this.editor.handle_tool_button(e, TOOLTYPELIB.FRAME, 'ctbutton' + this.toolid);
        /*var annotation = new M.assignfeedback_editpdfplus.annotationframe(new_frame);
         if (annotation) {
         if (annotation.init_from_edit(this.editor.currentedit)) {
         if (this.editor.currentdrawable) {
         this.editor.currentdrawable.erase();
         }
         annotation.draw_catridge(this.editor.currentedit);
         this.editor.pages[this.editor.currentpage].annotations.push(annotation);
         this.editor.drawables.push(annotation.draw());
         }
         }*/
    },
    display_picker: function () {
        Y.log('display_picker : ' + this.children.length);
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        divpalette.show();
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
                shapechd.set("stroke", {
                    color: this.colour
                });
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
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        divpalette.hide();
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
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        divprincipale.setStyles({
            'border-style': this.borderstyle
        });
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        divpalette.hide();
        Y.log('change_border : ' + this.borderstyle);
        this.editor.save_current_page();
    },
    edit_annot: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        divdisplay.hide();
        divedit.show();
        buttonsave.show();
        buttoncancel.show();
        divprincipale.setStyles({
            'z-index': 1000,
        });
    },
    fill_input_edition: function (e, unputtext) {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        if (input) {
            input.set('value', unputtext);
        }
    },
    hide_edit: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        divdisplay.show();
        divdisplay.set('style', 'display:inline;color:' + this.get_color() + ';');
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        divprincipale.setStyle('z-index', 1);
    },
    save_annot: function () {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        var result = input.get('value');
        this.textannot = result;
        this.editor.save_current_page();
        if (result.length === 0) {
            result = "&nbsp;&nbsp;";
        }
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        divdisplay.setContent(result);
        this.hide_edit();
        return;
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
                this.editor.currentannotation = false;
                this.editor.save_current_page();
                return;
            }
        }
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationframe = ANNOTATIONFRAME;
