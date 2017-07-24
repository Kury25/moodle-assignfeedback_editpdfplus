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
            function AnnotationHighlightplus() {
                // Call the super constructor.
                Annotation.call(this);
                // Return this object reference.
                return(this);
            }
            // The Friend class extends the base Model class.
            AnnotationHighlightplus.prototype = Object.create(Annotation.prototype);
            /**
             * Draw a highlight annotation
             * @protected
             * @method draw
             * @return M.assignfeedback_editpdfplus.drawable
             */
            AnnotationHighlightplus.prototype.draw = function (canevas) {
                if (canevas) {
                    var divHighlight = "<div id='" + this.id + "'></div>";
                    canevas.append(divHighlight);
                    $("#" + this.id).css('background-color', this.colour);
                    $("#" + this.id).css('width', this.endx - this.x);
                    $("#" + this.id).css('height', this.endy - this.y);
                    $("#" + this.id).css('opacity', .5);
                    $("#" + this.id).css('float', 'left');
                    $("#" + this.id).css('margin-top', this.x);
                    $("#" + this.id).css('margin-left', this.y);
                }


                /* shape = this.editor.graphic.addShape({
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
                 });*/

                /*drawable.shapes.push(shape);
                 this.drawable = drawable;*/

                //this.draw_catridge();

                return;
            };

            return AnnotationHighlightplus;
        });