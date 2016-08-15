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
 * Class representing a stampcomment.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationstampcomment
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONSTAMPCOMMENT = function (config) {
    ANNOTATIONSTAMPCOMMENT.superclass.constructor.apply(this, [config]);
};

ANNOTATIONSTAMPCOMMENT.NAME = "annotationstampcomment";
ANNOTATIONSTAMPCOMMENT.ATTRS = {};

Y.extend(ANNOTATIONSTAMPCOMMENT, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a stampcomment annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw: function () {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
                drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                node,
                position;

        position = this.editor.get_window_coordinates(new M.assignfeedback_editpdfplus.point(this.x, this.y));
        node = Y.Node.create('<div/>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            'backgroundImage': 'url(' + M.util.image_url('twoway_h', 'assignfeedback_editpdfplus') + ')',
            'width': (this.endx - this.x),
            'height': (this.endy - this.y),
            'backgroundSize': '100% 100%',
            'zIndex': 50
        });

        drawingcanvas.append(node);
        node.setX(position.x);
        node.setY(position.y);
        drawable.store_position(node, position.x, position.y);
        drawable.nodes.push(node);

        this.drawable = drawable;

        this.draw_catridge();
        return ANNOTATIONSTAMPCOMMENT.superclass.draw.apply(this);
    },
    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit: function (edit) {
        var bounds = new M.assignfeedback_editpdfplus.rect(),
                drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
                drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION),
                node,
                position;

        bounds.bound([edit.start, edit.end]);
        position = this.editor.get_window_coordinates(new M.assignfeedback_editpdfplus.point(bounds.x, bounds.y));

        node = Y.Node.create('<div/>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            'backgroundImage': 'url(' + M.util.image_url('twoway_h', 'assignfeedback_editpdfplus') + ')',
            'width': bounds.width,
            'height': bounds.height,
            'backgroundSize': '100% 100%',
            'zIndex': 50
        });

        drawingregion.append(node);
        node.setX(position.x);
        node.setY(position.y);
        drawable.store_position(node, position.x, position.y);

        drawable.nodes.push(node);

        return drawable;
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

        if (bounds.width < 40) {
            bounds.width = 40;
        }
        if (bounds.height < 40) {
            bounds.height = 40;
        }
        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = bounds.y;
        this.endx = bounds.x + bounds.width;
        this.endy = bounds.y + bounds.height;
        this.colour = edit.annotationcolour;
        this.path = edit.stampcomment;

        // Min width and height is always more than 40px.
        return true;
    },get_color_cartridge: function () {
        var highlightcolour = ANNOTATIONCOLOUR[this.tooltype.cartridge_color];
        if (!highlightcolour) {
            highlightcolour = this.tooltype.cartridge_color;
        } else {
            // Add an alpha channel to the rgb colour.
            highlightcolour = highlightcolour.replace('rgb', 'rgba');
            highlightcolour = highlightcolour.replace(')', ',0.5)');
        }
        if (highlightcolour === '') {
            return TOOLTYPEDEFAULTCOLOR.STAMPCOMMENTCARTRIDGE;
        }
        //Y.log('get_color_cartridge : ' + highlightcolour);
        return highlightcolour;
    },
    draw_catridge: function (edit) {
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
        if (this.divcartridge === '') {
            var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
            this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
            var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION);
            var cartridge = this.tooltype.cartridge;
            //Y.log('draw_catridge : ' + cartridge);
            var colorcartridge = this.get_color_cartridge();
            var div = "<div ";
            div += "id='" + this.divcartridge + "' ";
            div += "class='assignfeedback_editpdfplus_stampcomment' ";
            div += "style='border-color: " + colorcartridge + ";'> ";
            div += "</div>";
            var divdisplay = Y.Node.create(div);

            // inscription entete
            var divcartridge = "<div ";
            divcartridge += "class='assignfeedback_editpdfplus_stampcomment_cartridge' ";
            divcartridge += "style='border-right-color: " + colorcartridge + ";color:" + colorcartridge + ";'> ";
            divcartridge += cartridge;
            divcartridge += "</div>";
            divdisplay.append(Y.Node.create(divcartridge));

            //creation input
            var divconteneur = "<div ";
            divconteneur += "class='assignfeedback_editpdfplus_stampcomment_conteneur' >";
            divconteneur += "</div>";
            var divconteneurdisplay = Y.Node.create(divconteneur);
            var divinput = "<div ";
            divinput += "id='" + this.divcartridge + "_display' ";
            divinput += "class='assignfeedback_editpdfplus_stampcomment_input' ";
            divinput += "style='color:" + colorcartridge + ";'> ";
            if (this.textannot && this.textannot.length > 0) {
                divinput += this.textannot.substr(0, 20);
            } else {
                divinput += '&nbsp;&nbsp;';
            }
            divinput += "</div>";
            var onof = 0;
            if (this.displaylock === '1') {
                onof = 1;
            }
            var divinputdisplay = Y.Node.create(divinput);
            var inputvalref = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_valref' value=\"" + this.textannot + "\"/>");
            var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
            var lockvalue = 0;
            if (this.displaylock > 0) {
                lockvalue = 1;
            }
            var inputlockdisplay = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_lockdisplay' value=" + lockvalue + " />");
            divinputdisplay.on('click', this.edit_annot, this);
            var buttonvisibility = "<button id='" + this.divcartridge + "_buttonedit' ";
            if (lockvalue > 0) {
                buttonvisibility += "style='display:none;' ";
            }
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
            buttonsavedisplay.on('click', this.save_annot, this);
            var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/delete', 'core') + "' /></button>";
            var buttoncanceldisplay = Y.Node.create(buttoncancel);
            buttoncanceldisplay.on('click', this.hide_edit, this);
            //var buttonlock = "<button id='" + this.divcartridge + "_buttonlock'><img src='";
            //if (this.displaylock > 0) {
            //    buttonlock += M.util.image_url('t/locked', 'core');
            //} else {
            //    buttonlock += M.util.image_url('t/lock', 'core');
            //}
            //buttonlock += "' /></button>";
            //var buttonlockdisplay = Y.Node.create(buttonlock);
            //buttonlockdisplay.on('click', this.lock_display, this);
            divconteneurdisplay.append(divinputdisplay);
            divconteneurdisplay.append(inputvalref);
            divconteneurdisplay.append(inputonof);
            divconteneurdisplay.append(inputlockdisplay);
            divconteneurdisplay.append(buttonvisibilitydisplay);
            divconteneurdisplay.append(buttonsavedisplay);
            divconteneurdisplay.append(buttoncanceldisplay);
            //divconteneurdisplay.append(buttonlockdisplay);
            divdisplay.append(divconteneurdisplay);

            //creation de la div d'edition
            var divedition = "<div ";
            divedition += "id='" + this.divcartridge + "_edit' ";
            divedition += "class='assignfeedback_editpdfplus_stampcomment_edition' ";
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

            //positionnement de la div par rapport a l'annotation
            divdisplay.setX(offsetcanvas[0] + this.x + 40);
            divdisplay.setY(this.y + 12);
            drawingregion.append(divdisplay);

            //this.apply_visibility_annot();
        } else {
            var divid = '#' + this.divcartridge;
            //Y.log('draw_catridge : ' + divid);
            var divdisplay = this.editor.get_dialogue_element(divid);
            divdisplay.setX(offsetcanvas[0] + this.x+40);
            divdisplay.setY(offsetcanvas[1] + this.y + 12);
        }
        return true;
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
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationstampcomment = ANNOTATIONSTAMPCOMMENT;
