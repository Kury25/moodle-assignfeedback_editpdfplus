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
 * @module mod_assignfeedback_editpdfplus/annotation
 */
define(['jquery', './global'],
        function ($, global) {
            // I am the internal, static counter for the number of models
            // that have been created in the system. This is used to
            // power the unique identifier of each instance.
            var instanceCount = 0;

            // I get the next instance ID.
            var getNewInstanceID = function () {
                // Precrement the instance count in order to generate the
                // next value instance ID.
                return(++instanceCount);
            };
            // I return an initialized object.
            /**
             * Annotation class.
             *
             * @class Annotation
             */
            function Tool() {
                // Store the private instance id.
                this._instanceID = getNewInstanceID();
                // Return this object reference.
                return(this);

            }
            // I return the current instance count. I am a static method
            // on the Model class.
            Tool.getInstanceCount = function () {
                return(instanceCount);
            };
            Tool.prototype.getInstanceID = function () {
                return(this._instanceID);
            };
            Tool.id = -1;
            Tool.axis = -1;
            Tool.typetool = -1;
            Tool.type = null;
            Tool.colors = "";
            Tool.cartridge = "";
            Tool.cartridgeColor = "";
            Tool.texts = "";
            Tool.label = "";
            Tool.reply = true;
            Tool.enabled = true;
            Tool.orderTool = 1000;
            Tool.prototype.init = function (config) {
                this.id = parseInt(config.id, 10) || 0;
                this.axis = parseInt(config.axis, 10) || 0;
                this.type = config.type;
                this.colors = config.colors;
                this.cartridge = config.cartridge;
                this.cartridgeColor = config.cartridgeColor;
                this.texts = config.texts;
                this.label = config.label;
                this.reply = config.reply;
                this.enabled = config.enabled;
                this.orderTool = config.orderTool;
            };
            Tool.prototype.initAdmin = function (config) {
                this.id = parseInt(config.toolid, 10) || 0;
                this.typetool = config.typetool;
                this.label = config.button;
                this.enabled = config.enable;
                this.orderTool = config.orderTool;
            };
            Tool.prototype.getToolTypeLabel = function () {
                return this.type.label;
            };
            Tool.prototype.getToolTypeCartX = function () {
                return this.type.cartridgeX;
            };
            Tool.prototype.getToolTypeCartY = function () {
                return this.type.cartridgeY;
            };
            /**
             * Get the final color for the annotation
             * @return string
             * @protected
             */
            Tool.prototype.get_color = function () {
                var color = global.ANNOTATIONCOLOUR[this.colors];
                if (!color) {
                    color = this.colors;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                if (!color || color === '') {
                    return this.type.get_color();
                }
                return color;
            };
            /**
             * Get the final color for the cartridge
             * @return string
             * @protected
             */
            Tool.prototype.get_color_cartridge = function () {
                var color = global.ANNOTATIONCOLOUR[this.cartridgeColor];
                if (!color) {
                    color = this.cartridgeColor;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                if (!color || color === '') {
                    return this.type.get_color_cartridge();
                }
                return color;
            };
            Tool.prototype.getButton = function (selectToolId) {
                var classButton = "btn-default";
                var style = "";
                if (this.enabled !== 1) {
                    classButton = "";
                    style = "background-image:none;background-color:#CCCCCC;";
                }
                if (this.id === selectToolId) {
                    classButton = "btn-primary";
                }
                if (this.typetool === 4 || this.typetool === 1) {
                    style += "text-decoration: underline;";
                }
                var label = this.label;
                if (this.typetool === 4 || this.typetool === 5) {
                    label = "| " + label;
                    if (this.typetool === 4) {
                        label += " |";
                    }
                }
                var buttonTmp = "<button class='btn "
                        + classButton
                        + " editpdlplus_tool' id='editpdlplus_tool_"
                        + this.id + "' style='"
                        + style
                        + "' value='"
                        + this.id
                        + "' data-enable='"
                        + this.enabled + "'>"
                        + label
                        + "</button>";
                return buttonTmp;
            };

            return Tool;
        });