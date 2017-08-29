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
            function ToolType() {
                // Store the private instance id.
                this._instanceID = getNewInstanceID();
                // Return this object reference.
                return(this);

            }
            // I return the current instance count. I am a static method
            // on the Model class.
            ToolType.getInstanceCount = function () {
                return(instanceCount);
            };
            ToolType.prototype.getInstanceID = function () {
                return(this._instanceID);
            };
            ToolType.id = -1;
            ToolType.label = "";
            ToolType.color = "";
            ToolType.cartridgeColor = "";
            ToolType.cartridgeX = 0;
            ToolType.cartridgeY = 0;
            ToolType.configurableCartridge = 1;
            ToolType.configurableCartridgeColor = 1;
            ToolType.configurableColor = 1;
            ToolType.configurableTexts = 1;
            ToolType.configurableQuestion = 1;
            ToolType.prototype.init = function (config) {
                this.id = parseInt(config.id, 10) || 0;
            };
            ToolType.prototype.initAdmin = function (config) {
                this.id = parseInt(config.id, 10) || 0;
                this.label = config.label;
                this.color = config.color;
                this.cartridgeColor = config.cartridge_color;
                this.cartridgeX = config.cartridge_x;
                this.cartridgeY = config.cartridge_y;
                this.configurableCartridge = config.configurable_cartridge;
                this.configurableCartridgeColor = config.configurable_cartridge_color;
                this.configurableColor = config.configurable_color;
                this.configurableTexts = config.configurable_texts;
                this.configurableQuestion = config.configurable_question;
            };
            /**
             * Get the final color for the annotation
             * @return string
             * @protected
             */
            ToolType.prototype.get_color = function () {
                var color = global.ANNOTATIONCOLOUR[this.color];
                if (!color) {
                    color = this.color;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                return color;
            };
            /**
             * Get the final color for the cartridge
             * @return string
             * @protected
             */
            ToolType.prototype.get_color_cartridge = function () {
                var color = global.ANNOTATIONCOLOUR[this.cartridgeColor];
                if (!color) {
                    color = this.cartridgeColor;
                } else {
                    // Add an alpha channel to the rgb colour.
                    color = color.replace('rgb', 'rgba');
                    color = color.replace(')', ',0.5)');
                }
                return color;
            };

            return ToolType;
        });