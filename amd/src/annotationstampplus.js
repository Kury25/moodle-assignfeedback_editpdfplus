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
 * @module mod_assignfeedback_editpdfplus/annotationstampplus
 */
define(['jquery', './annotation'],
        function ($, Annotation) {
            // I return an initialized object.
            function AnnotationStampplus() {
                // Call the super constructor.
                Annotation.call(this);
                // Return this object reference.
                return(this);
            }
            // The Friend class extends the base Model class.
            AnnotationStampplus.prototype = Object.create(Annotation.prototype);

            AnnotationStampplus.prototype.initAdminDemo = function (currentTool, typetoolEntity) {
                Annotation.prototype.initAdminDemo.call(this, currentTool, typetoolEntity);
                this.x = 60;
                this.y = 100;
            };
            /**
             * Draw a highlight annotation
             * @protected
             * @method draw
             * @return M.assignfeedback_editpdfplus.drawable
             */
            AnnotationStampplus.prototype.draw = function (canevas) {
                if (canevas) {
                    var divStamp = "<div id='" + this.id + "'></div>";
                    canevas.append(divStamp);
                    $("#" + this.id).css('position', 'relative');
                    $("#" + this.id).css('top', this.y);
                    $("#" + this.id).css('left', this.x);
                    $("#" + this.id).css('color', this.colour);
                    $("#" + this.id).css('border', '2px solid ' + this.colour);
                    $("#" + this.id).css('padding', '0 2px');
                    $("#" + this.id).css('display', 'inline-block');
                    $("#" + this.id).append(this.tooltype.label);
                }
                return this;
            };

            return AnnotationStampplus;
        });