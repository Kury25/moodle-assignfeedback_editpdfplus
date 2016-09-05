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
 * Class representing a verticalline.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationverticalline
 * @extends M.assignfeedback_editpdfplus.annotation
 * @module moodle-assignfeedback_editpdfplus-editor
 */
var ANNOTATIONVERTICALLINE = function (config) {
    ANNOTATIONVERTICALLINE.superclass.constructor.apply(this, [config]);
};

ANNOTATIONVERTICALLINE.NAME = "annotationverticalline";
ANNOTATIONVERTICALLINE.ATTRS = {};

Y.extend(ANNOTATIONVERTICALLINE, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a verticalline annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw: function () {
        var drawable,
                shape,
                bounds,
                verticallinecolour;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);
        /*bounds = new M.assignfeedback_editpdfplus.rect();
         bounds.bound([new M.assignfeedback_editpdfplus.point(this.x, this.y),
         new M.assignfeedback_editpdfplus.point(this.endx, this.endy)]);*/

        verticallinecolour = this.get_color();

        shape = this.editor.graphic.addShape({
            type: Y.Path,
            fill: false,
            stroke: {
                weight: STROKEWEIGHT,
                color: verticallinecolour
            }
        });

        shape.moveTo(this.x, this.y);
        if (this.endy - this.y <= 30) {
            this.endy = this.y + 30;
        }
        shape.lineTo(this.x, this.endy);
        shape.end();

        drawable.shapes.push(shape);
        this.drawable = drawable;

        this.draw_catridge();

        return ANNOTATIONVERTICALLINE.superclass.draw.apply(this);
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
                verticallinecolour;

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(edit.start.x, edit.start.y),
            new M.assignfeedback_editpdfplus.point(edit.end.x, edit.end.y)]);

        // Set min. width of verticalline.
        if (!bounds.has_min_width()) {
            bounds.set_min_width();
        }
        if (!bounds.has_min_height()) {
            bounds.set_min_height();
        }

        verticallinecolour = this.get_color();

        // We will draw a box with the current background colour.
        shape = this.editor.graphic.addShape({
            type: Y.Path,
            fill: false,
            stroke: {
                weight: STROKEWEIGHT,
                color: verticallinecolour
            }
        });

        shape.moveTo(edit.start.x, edit.start.y);
        if (edit.end.y - edit.start.y <= 30) {
            shape.lineTo(edit.start.x, edit.start.y + 30);
        } else {
            shape.lineTo(edit.start.x, edit.end.y);
        }
        shape.end();

        drawable.shapes.push(shape);

        return drawable;
    },
    /**
     * Promote the current edit to a real annotation.
     *
     * @public
     * @method init_from_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     * @return bool true if verticalline bound is more than min width/height, else false.
     */
    init_from_edit: function (edit) {
        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = edit.start.x;
        this.y = edit.start.y;
        this.endx = edit.end.x + 4;
        if (edit.end.y - this.y <= 30) {
            this.endy = this.y + 30;
        } else {
            this.endy = edit.end.y;
        }
        this.page = '';
        return !(((this.endx - this.x) === 0) && ((this.endy - this.y) === 0));
    },
    draw_catridge: function (edit) {
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
        if (this.divcartridge === '') {
            this.init_div_cartridge_id();
            var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);

            //init cartridge
            var colorcartridge = this.get_color_cartridge();
            var divdisplay = this.get_div_cartridge(colorcartridge);
            divdisplay.addClass('assignfeedback_editpdfplus_verticalline');

            // inscription entete
            var divcartridge = this.get_div_cartridge_label(colorcartridge);
            divcartridge.addClass('assignfeedback_editpdfplus_verticalline_cartridge');
            divcartridge.on('mousedown', this.move_cartridge_begin, this);
            divdisplay.append(divcartridge);

            //creation input
            var divconteneur = "<div ";
            divconteneur += "class='assignfeedback_editpdfplus_verticalline_conteneur' >";
            divconteneur += "</div>";
            var divconteneurdisplay = Y.Node.create(divconteneur);
            var divinputdisplay = this.get_div_input(colorcartridge);
            divinputdisplay.addClass('assignfeedback_editpdfplus_verticalline_input');
            var inputvalref = this.get_input_valref();
            var onof = 0;
            if (this.displaylock === '1') {
                onof = 1;
            }
            var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
            divinputdisplay.on('click', this.edit_annot, this);
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
            var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
            var buttonsavedisplay = Y.Node.create(buttonsave);
            buttonsavedisplay.on('click', this.save_annot, this, null);
            var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
            var buttoncanceldisplay = Y.Node.create(buttoncancel);
            buttoncanceldisplay.on('click', this.cancel_edit, this);
            divconteneurdisplay.append(divinputdisplay);
            divconteneurdisplay.append(inputvalref);
            divconteneurdisplay.append(inputonof);
            divconteneurdisplay.append(buttonvisibilitydisplay);
            divconteneurdisplay.append(buttonsavedisplay);
            divconteneurdisplay.append(buttoncanceldisplay);
            divdisplay.append(divconteneurdisplay);

            //creation de la div d'edition
            var divedition = "<div ";
            divedition += "id='" + this.divcartridge + "_edit' ";
            divedition += "class='assignfeedback_editpdfplus_verticalline_edition' ";
            divedition += "style='display:none;'> ";
            divedition += "<input id='" + this.divcartridge + "_editinput' type='text' value=\"" + this.get_valref() + "\" />";
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

            //positionnement de la div par rapport a l'annotation
            if (!this.cartridgex || this.cartridgex === 0) {
                this.cartridgex = parseInt(this.tooltypefamille.cartridge_x);
            }
            if (!this.cartridgey || this.cartridgey === 0) {
                this.cartridgey = parseInt(this.tooltypefamille.cartridge_y);
            }
            divdisplay.setX(this.x + this.cartridgex);
            divdisplay.setY(this.y + this.cartridgey);
            drawingregion.append(divdisplay);

            this.apply_visibility_annot();
        } else {
            var divid = '#' + this.divcartridge;
            //Y.log('draw_catridge : ' + divid);
            var divdisplay = this.editor.get_dialogue_element(divid);
            divdisplay.setX(offsetcanvas[0] + this.x + this.cartridgex);
            divdisplay.setY(offsetcanvas[1] + this.y + this.cartridgey);
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
        //Y.log('move_cartridge : drag diff ' + diffx + ' - ' + diffy);
        //Y.log('move_cartridge : drag deplacement ' + (offsetcanvas[0] + this.cartridgex) + ' - ' + (offsetcanvas[0] + this.cartridgex + diffx));

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.x + this.cartridgex + diffx);
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
        divcartridge.setX(offsetcanvas[0] + this.x + this.cartridgex);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey);

        this.editor.save_current_page();
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
M.assignfeedback_editpdfplus.annotationverticalline = ANNOTATIONVERTICALLINE;
