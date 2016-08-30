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

        this.shape_id = 'ct_frame_' + (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        position = this.editor.get_window_coordinates(new M.assignfeedback_editpdfplus.point(this.x, this.y));
        node = Y.Node.create('<div id="' + this.shape_id + '"/>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            'backgroundImage': 'url(' + M.util.image_url('twoway_h', 'assignfeedback_editpdfplus') + ')',
            'width': (this.endx - this.x),
            'height': (this.endy - this.y),
            'backgroundSize': '100% 100%'
        });
        if (this.displayrotation > 0) {
            node.setStyles({
                'backgroundImage': 'url(' + M.util.image_url('twoway_v', 'assignfeedback_editpdfplus') + ')'
            });
        }

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
            'backgroundSize': '100% 100%'
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

        if (bounds.width < 30) {
            bounds.width = 30;
        }
        if (bounds.height < 30) {
            bounds.height = 30;
        }
        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x - 20;
        this.y = bounds.y - 25;
        this.endx = bounds.x + bounds.width - 20;
        this.endy = bounds.y + bounds.height - 25;
        this.colour = edit.annotationcolour;
        this.path = edit.stampcomment;

        // Min width and height is always more than 40px.
        return true;
    },
    draw_catridge: function (edit) {
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
        if (this.divcartridge === '') {
            this.init_div_cartridge_id();
            var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);

            //init cartridge
            var colorcartridge = this.get_color_cartridge();
            var divdisplay = this.get_div_cartridge(colorcartridge);
            divdisplay.addClass('assignfeedback_editpdfplus_stampcomment');

            // inscription entete
            var divcartridge = this.get_div_cartridge_label(colorcartridge);
            divcartridge.addClass('assignfeedback_editpdfplus_stampcomment_cartridge');
            divdisplay.append(divcartridge);

            //creation input
            var divconteneur = "<div ";
            divconteneur += "class='assignfeedback_editpdfplus_stampcomment_conteneur' >";
            divconteneur += "</div>";
            var divconteneurdisplay = Y.Node.create(divconteneur);
            var divinputdisplay = this.get_div_input(colorcartridge);
            divinputdisplay.addClass('assignfeedback_editpdfplus_stampcomment_input');
            var inputvalref = this.get_input_valref();
            var onof = 0;
            if (this.displaylock === '1') {
                onof = 1;
            }
            var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
            divinputdisplay.on('click', this.edit_annot, this);
            var rotationvalue = 0;
            if (this.displayrotation > 0) {
                rotationvalue = 1;
            }
            var inputrotationdisplay = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_rotation' value=" + rotationvalue + " />");
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
            buttonsavedisplay.on('click', this.save_annot, this);
            var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/delete', 'core') + "' /></button>";
            var buttoncanceldisplay = Y.Node.create(buttoncancel);
            buttoncanceldisplay.on('click', this.hide_edit, this);
            var buttonrotation = "<button id='" + this.divcartridge + "_buttonrotation'><img src='" + M.util.image_url('e/restore_draft', 'core') + "' /></button>";
            var buttonrotationdisplay = Y.Node.create(buttonrotation);
            buttonrotationdisplay.on('click', this.change_stamp, this);
            divconteneurdisplay.append(divinputdisplay);
            divconteneurdisplay.append(inputvalref);
            divconteneurdisplay.append(inputonof);
            divconteneurdisplay.append(inputrotationdisplay);
            divconteneurdisplay.append(buttonvisibilitydisplay);
            divconteneurdisplay.append(buttonsavedisplay);
            divconteneurdisplay.append(buttoncanceldisplay);
            divconteneurdisplay.append(buttonrotationdisplay);
            divdisplay.append(divconteneurdisplay);

            //creation de la div d'edition
            var divedition = "<div ";
            divedition += "id='" + this.divcartridge + "_edit' ";
            divedition += "class='assignfeedback_editpdfplus_stampcomment_edition' ";
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

            //Y.log('draw_cartridge : ' + this.editor.typetools[this.toolid].label);
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
    change_stamp: function () {
        var rotationstate = this.editor.get_dialogue_element('#' + this.divcartridge + "_rotation");
        var divstamp = this.editor.get_dialogue_element('#' + this.shape_id);
        if (rotationstate.get('value') === '0') {
            this.displayrotation = 1;
            rotationstate.set('value', 1);
            divstamp.setStyles({
                'backgroundImage': 'url(' + M.util.image_url('twoway_v', 'assignfeedback_editpdfplus') + ')'
            });
        } else {
            rotationstate.set('value', 0);
            divstamp.setStyles({
                'backgroundImage': 'url(' + M.util.image_url('twoway_h', 'assignfeedback_editpdfplus') + ')'
            });
            this.displayrotation = 0;
        }
        this.editor.save_current_page();
    },
    change_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        //var lockdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_lockdisplay");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        //Y.log('change_visibility_annot : ' + interrupt.get('value') + ' - ' + valref + ' - ' + lockdisplay.get('value'));
        //if (lockdisplay.get('value') === '0') {
        if (valref === '') {
            divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
        }
        if (interrupt.get('value') === '0') {
            if (valref !== '') {
                divdisplay.setContent(valref);
            }
            interrupt.set('value', 1);
            buttonplus.one('img').setAttribute('src', M.util.image_url('t/left', 'core'));
        } else {
            if (valref !== '') {
                divdisplay.setContent(valref.substr(0, 20));
            }
            interrupt.set('value', 0);
            buttonplus.one('img').setAttribute('src', M.util.image_url('t/right', 'core'));
        }
    },
    edit_annot: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        //var buttonlock = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonlock");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        divdisplay.hide();
        buttonplus.hide();
        //buttonlock.hide();
        divedit.show();
        buttonsave.show();
        buttoncancel.show();
        divprincipale.setStyle('z-index', 1000);

        this.disabled_canvas_event();
    },
    fill_input_edition: function (e, unputtext) {
        //Y.log('fill_input_edition : ' + unputtext);
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        if (input) {
            input.set('value', unputtext);
        }
    },
    hide_edit: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        //var buttonlock = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonlock");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        //var lockdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_lockdisplay");
        divdisplay.show();
        divdisplay.set('style', 'display:inline;color:' + this.get_color_cartridge() + ';');
        //if (lockdisplay.get('value') === '0') {
        buttonplus.show();
        //} else {
        //    buttonplus.hide();
        //}
        //buttonlock.show();
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        divprincipale.setStyle('z-index', 1);

        this.enabled_canvas_event();
    },
    save_annot: function () {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        var result = input.get('value');
        //Y.log('save_annot : ' + result);
        this.textannot = result;
        this.editor.save_current_page();
        if (result.length === 0) {
            result = "&nbsp;&nbsp;";
        }
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
        valref.set('value', result);
        this.apply_visibility_annot();
        this.hide_edit();
        return;
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
M.assignfeedback_editpdfplus.annotationstampcomment = ANNOTATIONSTAMPCOMMENT;