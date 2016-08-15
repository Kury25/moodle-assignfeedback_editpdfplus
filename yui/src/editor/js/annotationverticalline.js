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
        shape.lineTo(edit.start.x, edit.end.y);
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
        this.endy = edit.end.y;
        this.page = '';
        return !(((this.endx - this.x) === 0) && ((this.endy - this.y) === 0));
    },
    get_color: function () {
        var verticallinecolour = ANNOTATIONCOLOUR[this.colour];
        if (!verticallinecolour) {
            verticallinecolour = this.colour;
        } else {
            // Add an alpha channel to the rgb colour.
            verticallinecolour = verticallinecolour.replace('rgb', 'rgba');
            verticallinecolour = verticallinecolour.replace(')', ',0.5)');
        }
        //Y.log('get_color : ' + verticallinecolour);
        return verticallinecolour;
    },
    get_color_cartridge: function () {
        var verticallinecolour = ANNOTATIONCOLOUR[this.tooltype.cartridge_color];
        if (!verticallinecolour) {
            verticallinecolour = this.tooltype.cartridge_color;
        } else {
            // Add an alpha channel to the rgb colour.
            verticallinecolour = verticallinecolour.replace('rgb', 'rgba');
            verticallinecolour = verticallinecolour.replace(')', ',0.5)');
        }
        if (verticallinecolour === '') {
            return TOOLTYPEDEFAULTCOLOR.VERTICALLINECARTRIDGE;
        }
        //Y.log('get_color_cartridge : ' + verticallinecolour);
        return verticallinecolour;
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
            div += "class='assignfeedback_editpdfplus_verticalline' ";
            div += "style='border-color: " + colorcartridge + ";'> ";
            div += "</div>";
            var divdisplay = Y.Node.create(div);

            //inscription entete
            var divcartridge = "<div ";
            divcartridge += "class='assignfeedback_editpdfplus_verticalline_cartridge' ";
            divcartridge += "style='border-right-color: " + colorcartridge + ";color:" + colorcartridge + ";'> ";
            divcartridge += cartridge;
            divcartridge += "</div>";
            divdisplay.append(Y.Node.create(divcartridge));

            //creation input
            var divconteneur = "<div ";
            divconteneur += "class='assignfeedback_editpdfplus_verticalline_conteneur' >";
            divconteneur += "</div>";
            var divconteneurdisplay = Y.Node.create(divconteneur);
            var divinput = "<div ";
            divinput += "id='" + this.divcartridge + "_display' ";
            divinput += "class='assignfeedback_editpdfplus_verticalline_input' ";
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
            var buttonlock = "<button id='" + this.divcartridge + "_buttonlock'><img src='";
            if (this.displaylock > 0) {
                buttonlock += M.util.image_url('t/locked', 'core');
            } else {
                buttonlock += M.util.image_url('t/lock', 'core');
            }
            buttonlock += "' /></button>";
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
            divedition += "class='assignfeedback_editpdfplus_verticalline_edition' ";
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
            divdisplay.setX(offsetcanvas[0] + this.x + 5);
            divdisplay.setY(this.y);
            drawingregion.append(divdisplay);

            //this.apply_visibility_annot();
        } else {
            var divid = '#' + this.divcartridge;
            //Y.log('draw_catridge : ' + divid);
            var divdisplay = this.editor.get_dialogue_element(divid);
            divdisplay.setX(offsetcanvas[0] + this.x + 5);
            divdisplay.setY(offsetcanvas[1] + this.y);
        }
        return true;
    },
    change_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var lockdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_lockdisplay");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        //Y.log('change_visibility_annot : ' + interrupt.get('value') + ' - ' + valref + ' - ' + lockdisplay.get('value'));
        if (lockdisplay.get('value') === '0') {
            if (interrupt.get('value') === '0') {
                divdisplay.setContent(valref);
                interrupt.set('value', 1);
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/left', 'core'));
            } else {
                divdisplay.setContent(valref.substr(0, 20));
                interrupt.set('value', 0);
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/right', 'core'));
            }
        } else {
            if (interrupt.get('value') === '0') {
                divdisplay.setContent(valref.substr(0, 20));
            } else {
                divdisplay.setContent(valref);
            }
        }
    },
    apply_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var lockdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_lockdisplay");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        //Y.log('apply_visibility_annot : ' + interrupt.get('value') + ' - ' + valref + ' - ' + lockdisplay.get('value'));
        if (lockdisplay.get('value') === '0') {
            if (interrupt.get('value') === '0') {
                divdisplay.setContent(valref.substr(0, 20));
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/right', 'core'));
            } else {
                divdisplay.setContent(valref);
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/left', 'core'));
            }
        } else {
            if (interrupt.get('value') === '0') {
                divdisplay.setContent(valref.substr(0, 20));
            } else {
                divdisplay.setContent(valref);
            }
        }
    },
    lock_display: function () {
        var lockdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_lockdisplay");
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        //var buttonlock = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonlock");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        if (lockdisplay.get('value') === '0') {
            lockdisplay.set('value', 1);
            buttonplus.hide();
            //buttonlock.one('img').setAttribute('src', M.util.image_url('t/locked', 'core'));
            if (interrupt.get('value') === '0') {
                this.displaylock = 2;
            } else {
                this.displaylock = 1;
            }
            this.editor.save_current_page();
        } else {
            lockdisplay.set('value', 0);
            buttonplus.show();
            //buttonlock.one('img').setAttribute('src', M.util.image_url('t/lock', 'core'));
            this.displaylock = 0;
            this.editor.save_current_page();
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
        var lockdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_lockdisplay");
        divdisplay.show();
        divdisplay.set('style', 'display:inline;color:' + this.get_color_cartridge() + ';');
        if (lockdisplay.get('value') === '0') {
            buttonplus.show();
        } else {
            buttonplus.hide();
        }
        //buttonlock.show();
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        divprincipale.setStyle('z-index', 1);
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
