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
/*
 * @package    assignfeedback_editpdfplus
 * @copyright  2017 Université de Lausanne
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
/**
 * @module mod_assignfeedback_editpdfplus/annotationhighlightplus
 */
define(['jquery', './annotation'],
        function ($, Annotation) {
            // I return an initialized object.
            function AnnotationFrame() {
                // Call the super constructor.
                Annotation.call(this);
                // Return this object reference.
                return(this);
            }
            // The Friend class extends the base Model class.
            AnnotationFrame.prototype = Object.create(Annotation.prototype);
            /**
             * Draw a highlight annotation
             * @protected
             * @method draw
             * @return M.assignfeedback_editpdfplus.drawable
             */
            AnnotationFrame.prototype.draw = function (canevas) {
                //this.shape_id = 'ct_frame_' + (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
                if (canevas) {
                    var divFrame = "<div id='" + this.id + "'></div>";
                    canevas.append(divFrame);
                    $("#" + this.id).css('width', this.endx - this.x);
                    $("#" + this.id).css('height', this.endy - this.y);
                    $("#" + this.id).css('border', 'solid 2px red');
                    $("#" + this.id).css('position', 'relative');
                    $("#" + this.id).css('display', 'inline-block');
                    $("#" + this.id).css('left', this.x);
                    $("#" + this.id).css('top', this.y);
                }
                this.draw_catridge(canevas);
                return this;
            };
            /**
             * Display cartridge and toolbox for the annotation
             * @returns {Boolean} res
             */
            AnnotationFrame.prototype.draw_catridge = function (canevas) {
                if (!this.parent_annot_element && this.parent_annot === 0) {
                    var divdisplay;
                    if (!this.divcartridge || this.divcartridge === '') {
                        this.init_div_cartridge_id();

                        //rattachement de la shape
                        var shapechd = $("#" + this.id);
                        if (shapechd) {
                            shapechd.addClass('class_' + this.divcartridge);
                        }

                        //init cartridge
                        var colorcartridge = this.get_color();
                        divdisplay = this.get_div_cartridge(colorcartridge, canevas);
                        divdisplay.addClass('assignfeedback_editpdfplus_frame');

                        // inscription entete
                        this.get_div_cartridge_label(colorcartridge, divdisplay, true);

                        //creation input
                        var divconteneurdisplay = this.get_div_container(colorcartridge, divdisplay);
                        //if (!this.editor.get('readonly')) {
                        var buttonrender = "<button id='"
                                + this.divcartridge
                                + "_buttonpencil' class='btn btn-default' type='button'>";
                        buttonrender += '<i class="fa fa-eyedropper" aria-hidden="true"></i>';
                        buttonrender += "</button>";
                        //var buttonrenderdisplay = Y.Node.create(buttonrender);
                        //buttonrenderdisplay.on('click', this.display_picker, this);
                        var buttonadd = "<button id='"
                                + this.divcartridge
                                + "_buttonadd' class='btn btn-default' type='button'>";
                        buttonadd += '<i class="fa fa-plus" aria-hidden="true"></i>';
                        buttonadd += "</button>";
                        //var buttonadddisplay = Y.Node.create(buttonadd);
                        //buttonadddisplay.on('click', this.add_annot, this);
                        divconteneurdisplay.append(buttonrender);
                        divconteneurdisplay.append(buttonadd);
                        //}

                        //creation de la div d'edition
                        //if (!this.editor.get('readonly')) {
                        this.get_div_edition(divconteneurdisplay);
                        //} else {
                        //var divvisudisplay = this.get_div_visu(colorcartridge);
                        //divconteneurdisplay.append(divvisudisplay);
                        //}

                        //positionnement de la div par rapport a l'annotation
                        if (!this.cartridgex || this.cartridgex === 0) {
                            this.cartridgex = parseInt(this.tooltypefamille.cartridge_x, 10);
                        }
                        if (!this.cartridgey || this.cartridgey === 0) {
                            this.cartridgey = parseInt(this.tooltypefamille.cartridge_y, 10);
                        }
                        divdisplay.css('left', this.cartridgex + 15);
                        divdisplay.css('top', this.y + this.cartridgey);

                        this.apply_visibility_annot();
                    } else {
                        //divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge);
                        //divdisplay.setX(offsetcanvas[0] + this.x + this.cartridgex);
                        //divdisplay.setY(offsetcanvas[1] + this.y + this.cartridgey);
                    }
                }
                return true;
            };

            return AnnotationFrame;
        });