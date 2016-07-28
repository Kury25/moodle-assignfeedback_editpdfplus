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
 * @class annotationhighlightplus
 * @extends M.assignfeedback_editpdfplus.annotation
 * @module moodle-assignfeedback_editpdfplus-editor
 */
var ANNOTATIONHIGHLIGHTPLUS = function (config) {
    ANNOTATIONHIGHLIGHTPLUS.superclass.constructor.apply(this, [config]);
};

ANNOTATIONHIGHLIGHTPLUS.NAME = "annotationhighlightplus";
ANNOTATIONHIGHLIGHTPLUS.ATTRS = {};

Y.extend(ANNOTATIONHIGHLIGHTPLUS, M.assignfeedback_editpdfplus.annotation, {
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

        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            stroke: false,
            fill: {
                color: highlightcolour,
                opacity: 0.5
            },
            x: bounds.x,
            y: bounds.y
        });

        drawable.shapes.push(shape);
        this.drawable = drawable;

        this.draw_catridge();

        return ANNOTATIONHIGHLIGHTPLUS.superclass.draw.apply(this);
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
            stroke: false,
            fill: {
                color: highlightcolour,
                opacity: 0.5
            },
            x: bounds.x,
            y: edit.start.y - 8
        });

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
    get_color: function () {
        var highlightcolour = ANNOTATIONCOLOUR[this.colour];
        if (!highlightcolour) {
            highlightcolour = this.colour;
        } else {
            // Add an alpha channel to the rgb colour.
            highlightcolour = highlightcolour.replace('rgb', 'rgba');
            highlightcolour = highlightcolour.replace(')', ',0.5)');
        }
        console.log('get_color : ' + highlightcolour);
        return highlightcolour;
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
        if (highlightcolour ==='')
            return TOOLTYPEDEFAULTCOLOR.HIGHLIGHTPLUSCARTRIDGE;
        console.log('get_color_cartridge : ' + highlightcolour);
        return highlightcolour;
    },
    draw_catridge: function (edit) {
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
        if (this.divcartridge === '') {
            var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
            this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
            var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION);
            var cartridge = this.tooltype.cartridge;
            console.log('draw_catridge : ' + cartridge);
            var colorcartridge = this.get_color_cartridge();
            var div = "<div ";
            div += "id='" + this.divcartridge + "' ";
            div += "style='position:absolute;border:2px solid " + colorcartridge + ";padding-left:2px; padding-right:2px;color:" + colorcartridge + ";font-size:10px;'> ";
            div += cartridge;
            div += "</div>";
            var divdisplay = Y.Node.create(div);
            divdisplay.setX(offsetcanvas[0] + this.x);
            divdisplay.setY(this.y - 16 - 8);
            drawingregion.append(divdisplay);
        } else {
            var divid = '#' + this.divcartridge;
            console.log('draw_catridge : ' + divid);
            var divdisplay = this.editor.get_dialogue_element(divid);
            divdisplay.setX(offsetcanvas[0] + this.x);
            divdisplay.setY(offsetcanvas[1] + this.y - 16 - 8);
        }
        return true;
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
                    console.log('draw_catridge : ' + divid);
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
M.assignfeedback_editpdfplus.annotationhighlightplus = ANNOTATIONHIGHLIGHTPLUS;
