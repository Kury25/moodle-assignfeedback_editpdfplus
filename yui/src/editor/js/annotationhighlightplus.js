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
        if (highlightcolour === '')
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
            div += "style='position:absolute;border:2px solid " + colorcartridge + ";'> ";
            //div += cartridge;
            div += "</div>";
            var divdisplay = Y.Node.create(div);

            // inscription entete
            var divcartridge = "<div ";
            //divcartridge += "id='" + this.divcartridge + "' ";
            divcartridge += "style='display:inline;border-right:2px solid " + colorcartridge + ";padding-left:2px; padding-right:2px;color:" + colorcartridge + ";font-size:10px;'> ";
            divcartridge += cartridge;
            divcartridge += "</div>";
            //var divcartridgedisplay = ;
            divdisplay.append(Y.Node.create(divcartridge));

            //creation input
            var divconteneur = "<div ";
            divconteneur += "style='display:inline;'> ";
            divconteneur += "</div>";
            var divconteneurdisplay = Y.Node.create(divconteneur);
            var divinput = "<div ";
            divinput += "id='" + this.divcartridge + "_display' ";
            divinput += "style='display:inline;padding-left:2px; padding-right:2px;color:" + colorcartridge + ";font-size:10px;'> ";
            if (this.commentaire.length > 0)
                divinput += this.commentaire.substr(0, 20);
            else
                divinput += '&nbsp;&nbsp;';
            divinput += "</div>";
            //divinput += "<button style='margin:0;margin-left:2px;padding:0;'>...</button>";
            var inputvalref = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_valref' value='" + this.commentaire + "'/>");
            var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=0 />");
            var divinputdisplay = Y.Node.create(divinput);
            divinputdisplay.on('click', this.edit_annot, this);
            var buttonvisibility = "<button style='margin:0;margin-left:2px;padding:0;'>...</button>";
            var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
            buttonvisibilitydisplay.on('click', this.change_visibility_annot, this);
            divconteneurdisplay.append(divinputdisplay);
            divconteneurdisplay.append(inputvalref);
            divconteneurdisplay.append(inputonof);
            divconteneurdisplay.append(buttonvisibilitydisplay);
            divdisplay.append(divconteneurdisplay);
            
            //creation de la div d'edition
            var divedition = "<div ";
            divedition += "id='" + this.divcartridge + "_edit' ";
            divedition += "style='display:none;padding-left:2px; padding-right:2px;font-size:12px;'> ";
            divedition += "<input id='" + this.divcartridge + "_editinput' type='text' value='' />";
            divedition += "</div>";
            divconteneurdisplay.append(divedition);

            //positionnement de la div par rapport a l'annotation
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
    change_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        console.log('change_visibility_annot : ' + interrupt.get('value') + ' - ' + valref);
        if (interrupt.get('value') === '0') {
            divdisplay.setContent(valref);
            interrupt.set('value', 1);
        } else {
            divdisplay.setContent(valref.substr(0, 20));
            interrupt.set('value', 0);
        }
    },
    edit_annot:function (){
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        divdisplay.hide();
        divedit.show();
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
