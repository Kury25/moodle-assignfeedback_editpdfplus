YUI.add('moodle-assignfeedback_editpdfplus-editor', function (Y, NAME) {

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
 * A list of globals used by this module.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */
var AJAXBASE = M.cfg.wwwroot + '/mod/assign/feedback/editpdfplus/ajax.php',
        AJAXBASEPROGRESS = M.cfg.wwwroot + '/mod/assign/feedback/editpdfplus/ajax_progress.php',
        CSS = {
            DIALOGUE: 'assignfeedback_editpdfplus_widget'
        },
SELECTOR = {
    PREVIOUSBUTTON: '.navigate-previous-button',
    NEXTBUTTON: ' .navigate-next-button',
    SEARCHCOMMENTSBUTTON: '.searchcommentsbutton',
    SEARCHFILTER: '.assignfeedback_editpdfplus_commentsearch input',
    SEARCHCOMMENTSLIST: '.assignfeedback_editpdfplus_commentsearch ul',
    PAGESELECT: '.navigate-page-select',
    LOADINGICON: '.loading',
    PROGRESSBARCONTAINER: '.progress-info.progress-striped',
    DRAWINGREGION: '.drawingregion',
    DRAWINGCANVAS: '.drawingcanvas',
    SAVE: '.savebutton',
    COMMENTCOLOURBUTTON: '.commentcolourbutton',
    COMMENTMENU: '.commentdrawable a',
    ANNOTATIONCOLOURBUTTON: '.annotationcolourbutton',
    DELETEANNOTATIONBUTTON: '.deleteannotationbutton',
    UNSAVEDCHANGESDIV: '.assignfeedback_editpdfplus_unsavedchanges',
    UNSAVEDCHANGESINPUT: 'input[name="assignfeedback_editpdfplus_haschanges"]',
    STAMPSBUTTON: '.currentstampbutton',
    DIALOGUE: '.' + CSS.DIALOGUE,
    CUSTOMTOOLBARID: '#toolbaraxis',
    CUSTOMTOOLBARS: '.customtoolbar',
    AXISCUSTOMTOOLBAR: '.menuaxisselection',
    CUSTOMTOOLBARBUTTONS: '.costumtoolbarbutton'
},
SELECTEDBORDERCOLOUR = 'rgba(200, 200, 255, 0.9)',
        SELECTEDFILLCOLOUR = 'rgba(200, 200, 255, 0.5)',
        COMMENTTEXTCOLOUR = 'rgb(51, 51, 51)',
        COMMENTCOLOUR = {
            'white': 'rgb(255,255,255)',
            'yellow': 'rgb(255,236,174)',
            'red': 'rgb(249,181,179)',
            'green': 'rgb(214,234,178)',
            'blue': 'rgb(203,217,237)',
            'clear': 'rgba(255,255,255, 0)'
        },
ANNOTATIONCOLOUR = {
    'white': 'rgb(255,255,255)',
    'yellow': 'rgb(255,207,53)',
    'red': 'rgb(239,69,64)',
    'green': 'rgb(152,202,62)',
    'blue': 'rgb(125,159,211)',
    'black': 'rgb(51,51,51)'
},
CLICKTIMEOUT = 300,
        TOOLSELECTOR = {
            'pen': '.penbutton',
            'line': '.linebutton',
            'rectangle': '.rectanglebutton',
            'oval': '.ovalbutton',
            'select': '.selectbutton',
            'drag': '.dragbutton',
            'highlight': '.highlightbutton'
        },
TOOLTYPE = {
    'HIGHLIGHTPLUS': 1,
    'LINEPLUS': 2,
    'STAMPPLUS': 3,
    'FRAME': 4,
    'VERTICALLINE': 5,
    'STAMPCOMMENT': 6,
    'COMMENTPLUS': 7,
    'PEN': 8,
    'LINE': 9,
    'RECTANGLE': 10,
    'OVAL': 11,
    'HIGHLIGHT': 12
},
TOOLTYPELIB = {
    'HIGHLIGHTPLUS': 'highlightplus',
    'LINEPLUS': 'lineplus',
    'STAMPPLUS': 'stampplus',
    'FRAME': 'frame',
    'VERTICALLINE': 'verticalline',
    'STAMPCOMMENT': 'stampcomment',
    'COMMENTPLUS': 'commentplus',
    'PEN': 'pen',
    'LINE': 'line',
    'RECTANGLE': 'rectangle',
    'OVAL': 'oval',
    'HIGHLIGHT': 'highlight'
},
STROKEWEIGHT = 4;// This file is part of Moodle - http://moodle.org/
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
 * Class representing a 2d point.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @param Number x
 * @param Number y
 * @class point
 */
var POINT = function(x, y) {

    /**
     * X coordinate.
     * @property x
     * @type int
     * @public
     */
    this.x = parseInt(x, 10);

    /**
     * Y coordinate.
     * @property y
     * @type int
     * @public
     */
    this.y = parseInt(y, 10);

    /**
     * Clip this point to the rect
     * @method clip
     * @param M.assignfeedback_editpdfplus.point
     * @public
     */
    this.clip = function(bounds) {
        if (this.x < bounds.x) {
            this.x = bounds.x;
        }
        if (this.x > (bounds.x + bounds.width)) {
            this.x = bounds.x + bounds.width;
        }
        if (this.y < bounds.y) {
            this.y = bounds.y;
        }
        if (this.y > (bounds.y + bounds.height)) {
            this.y = bounds.y + bounds.height;
        }
        // For chaining.
        return this;
    };
};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.point = POINT;
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
 * Class representing a 2d rect.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @param int x
 * @param int y
 * @param int width
 * @param int height
 * @class rect
 */
var RECT = function(x, y, width, height) {

    /**
     * X coordinate.
     * @property x
     * @type int
     * @public
     */
    this.x = x;

    /**
     * Y coordinate.
     * @property y
     * @type int
     * @public
     */
    this.y = y;

    /**
     * Width
     * @property width
     * @type int
     * @public
     */
    this.width = width;

    /**
     * Height
     * @property height
     * @type int
     * @public
     */
    this.height = height;

    /**
     * Set this rect to represent the smallest possible rectangle containing this list of points.
     * @method bounds
     * @param M.assignfeedback_editpdfplus.point[]
     * @public
     */
    this.bound = function(points) {
        var minx = 0,
            maxx = 0,
            miny = 0,
            maxy = 0,
            i = 0,
            point;

        for (i = 0; i < points.length; i++) {
            point = points[i];
            if (point.x < minx || i === 0) {
                minx = point.x;
            }
            if (point.x > maxx || i === 0) {
                maxx = point.x;
            }
            if (point.y < miny || i === 0) {
                miny = point.y;
            }
            if (point.y > maxy || i === 0) {
                maxy = point.y;
            }
        }
        this.x = minx;
        this.y = miny;
        this.width = maxx - minx;
        this.height = maxy - miny;
        // Allow chaining.
        return this;
    };

    /**
     * Checks if rect has min width.
     * @method has_min_width
     * @return bool true if width is more than 5px.
     * @public
     */
    this.has_min_width = function() {
        return (this.width >= 5);
    };

    /**
     * Checks if rect has min height.
     * @method has_min_height
     * @return bool true if height is more than 5px.
     * @public
     */
    this.has_min_height = function() {
        return (this.height >= 5);
    };

    /**
     * Set min. width of annotation bound.
     * @method set_min_width
     * @public
     */
    this.set_min_width = function() {
        this.width = 5;
    };

    /**
     * Set min. height of annotation bound.
     * @method set_min_height
     * @public
     */
    this.set_min_height = function() {
        this.height = 5;
    };
};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.rect = RECT;
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
 * EDIT
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class edit
 */
var EDIT = function() {

    /**
     * Starting point for the edit.
     * @property start
     * @type M.assignfeedback_editpdfplus.point|false
     * @public
     */
    this.start = false;

    /**
     * Finishing point for the edit.
     * @property end
     * @type M.assignfeedback_editpdfplus.point|false
     * @public
     */
    this.end = false;

    /**
     * Starting time for the edit.
     * @property starttime
     * @type int
     * @public
     */
    this.starttime = 0;

    /**
     * Starting point for the currently selected annotation.
     * @property annotationstart
     * @type M.assignfeedback_editpdfplus.point|false
     * @public
     */
    this.annotationstart = false;

    /**
     * The currently selected tool
     * @property tool
     * @type String
     * @public
     */
    this.tool = "drag";

    /**
     * The currently comment colour
     * @property commentcolour
     * @type String
     * @public
     */
    this.commentcolour = 'yellow';

    /**
     * The currently annotation colour
     * @property annotationcolour
     * @type String
     * @public
     */
    this.annotationcolour = 'red';

    /**
     * The current stamp image.
     * @property stamp
     * @type String
     * @public
     */
    this.stamp = '';

    /**
     * List of points the the current drawing path.
     * @property path
     * @type M.assignfeedback_editpdfplus.point[]
     * @public
     */
    this.path = [];
};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.edit = EDIT;
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
 * Class representing a drawable thing which contains both Y.Nodes, and Y.Shapes.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @param M.assignfeedback_editpdfplus.editor editor
 * @class drawable
 */
var DRAWABLE = function(editor) {

    /**
     * Reference to M.assignfeedback_editpdfplus.editor.
     * @property editor
     * @type M.assignfeedback_editpdfplus.editor
     * @public
     */
    this.editor = editor;

    /**
     * Array of Y.Shape
     * @property shapes
     * @type Y.Shape[]
     * @public
     */
    this.shapes = [];

    /**
     * Array of Y.Node
     * @property nodes
     * @type Y.Node[]
     * @public
     */
    this.nodes = [];

    /**
     * Delete the shapes from the drawable.
     * @protected
     * @method erase_drawable
     */
    this.erase = function() {
        if (this.shapes) {
            while (this.shapes.length > 0) {
                this.editor.graphic.removeShape(this.shapes.pop());
            }
        }
        if (this.nodes) {
            while (this.nodes.length > 0) {
                this.nodes.pop().remove();
            }
        }
    };

    /**
     * Update the positions of all absolutely positioned nodes, when the drawing canvas is scrolled
     * @public
     * @method scroll_update
     * @param scrollx int
     * @param scrolly int
     */
    this.scroll_update = function(scrollx, scrolly) {
        var i, x, y;
        for (i = 0; i < this.nodes.length; i++) {
            x = this.nodes[i].getData('x');
            y = this.nodes[i].getData('y');
            if (x !== undefined && y !== undefined) {
                this.nodes[i].setX(parseInt(x, 10) - scrollx);
                this.nodes[i].setY(parseInt(y, 10) - scrolly);
            }
        }
    };

    /**
     * Store the initial position of the node, so it can be updated when the drawing canvas is scrolled
     * @public
     * @method store_position
     * @param container
     * @param x
     * @param y
     */
    this.store_position = function(container, x, y) {
        var drawingregion, scrollx, scrolly;

        drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION);
        scrollx = parseInt(drawingregion.get('scrollLeft'), 10);
        scrolly = parseInt(drawingregion.get('scrollTop'), 10);
        container.setData('x', x + scrollx);
        container.setData('y', y + scrolly);
    };
};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.drawable = DRAWABLE;
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
 * @class annotation
 * @constructor
 */
var ANNOTATION = function (config) {
    ANNOTATION.superclass.constructor.apply(this, [config]);
};

ANNOTATION.NAME = "annotation";
ANNOTATION.ATTRS = {};

Y.extend(ANNOTATION, Y.Base, {
    /**
     * Reference to M.assignfeedback_editpdfplus.editor.
     * @property editor
     * @type M.assignfeedback_editpdfplus.editor
     * @public
     */
    editor: null,
    /**
     * Grade id
     * @property gradeid
     * @type Int
     * @public
     */
    gradeid: 0,
    /**
     * Comment page number
     * @property pageno
     * @type Int
     * @public
     */
    pageno: 0,
    /**
     * X position
     * @property x
     * @type Int
     * @public
     */
    x: 0,
    /**
     * Y position
     * @property y
     * @type Int
     * @public
     */
    y: 0,
    /**
     * Ending x position
     * @property endx
     * @type Int
     * @public
     */
    endx: 0,
    /**
     * Ending y position
     * @property endy
     * @type Int
     * @public
     */
    endy: 0,
    /**
     * Path
     * @property path
     * @type String - list of points like x1,y1:x2,y2
     * @public
     */
    path: '',
    /**
     * Tool.
     * @property toolid
     * @type Int
     * @public
     */
    toolid: 0,
    /**
     * Annotation colour.
     * @property colour
     * @type String
     * @public
     */
    colour: 'red',
    /**
     * Reference to M.assignfeedback_editpdfplus.drawable
     * @property drawable
     * @type M.assignfeedback_editpdfplus.drawable
     * @public
     */
    drawable: false,
    tooltype: null,
    tooltypefamille: null,
    divcartridge: '',
    textannot: '',
    displaylock: 0,
    displayrotation: 0,
    borderstyle: '',
    parent_annot: 0,
    parent_annot_element: null,
    id: 0,
    shape_id: '',
    cartridgex: 0,
    cartridgey: 0,
    /**
     * Initialise the annotation.
     *
     * @method initializer
     * @return void
     */
    initializer: function (config) {
        if (config.parent_annot_element) {
            this.editor = config.parent_annot_element.editor || null;
            this.gradeid = parseInt(config.parent_annot_element.gradeid, 10) || 0;
            this.pageno = parseInt(config.parent_annot_element.pageno, 10) || 0;
            this.x = parseInt(config.x, 10) || 0;
            this.y = parseInt(config.y, 10) || 0;
            this.endx = parseInt(config.endx, 10) || 0;
            this.endy = parseInt(config.endy, 10) || 0;
            this.cartridgex = parseInt(config.parent_annot_element.cartridgex, 10) || 0;
            this.cartridgey = parseInt(config.parent_annot_element.cartridgey, 10) || 0;
            this.path = config.path || '';
            this.toolid = config.toolid || this.editor.get_dialogue_element(TOOLTYPE.RECTANGLE);
            this.colour = config.parent_annot_element.colour || 'red';
            this.drawable = false;
            this.tooltype = config.tooltype;
            this.textannot = config.parent_annot_element.textannot;
            this.displaylock = config.parent_annot_element.displaylock;
            this.displayrotation = config.parent_annot_element.displayrotation;
            this.borderstyle = config.parent_annot_element.borderstyle || 'solid';
            this.parent_annot = config.parent_annot_element.id;
            this.parent_annot_element = config.parent_annot_element;
            config.parent_annot_element.children.push(this);
        } else {
            this.editor = config.editor || null;
            this.gradeid = parseInt(config.gradeid, 10) || 0;
            this.pageno = parseInt(config.pageno, 10) || 0;
            this.x = parseInt(config.x, 10) || 0;
            this.y = parseInt(config.y, 10) || 0;
            this.endx = parseInt(config.endx, 10) || 0;
            this.endy = parseInt(config.endy, 10) || 0;
            this.cartridgex = parseInt(config.cartridgex, 10) || 0;
            this.cartridgey = parseInt(config.cartridgey, 10) || 0;
            this.path = config.path || '';
            this.toolid = config.toolid || this.editor.get_dialogue_element(TOOLTYPE.RECTANGLE);
            this.colour = config.colour || 'red';
            this.drawable = false;
            this.tooltype = config.tooltype;
            this.textannot = config.textannot;
            this.displaylock = config.displaylock;
            this.displayrotation = config.displayrotation;
            this.borderstyle = config.borderstyle || 'solid';
            this.parent_annot = config.parent_annot;
            this.id = config.id;
        }
        this.tooltypefamille = this.editor.typetools[this.tooltype.type];
    },
    /**
     * Clean a comment record, returning an oject with only fields that are valid.
     * @public
     * @method clean
     * @return {}
     */
    clean: function () {
        if (this.parent_annot_element) {
            return {
                gradeid: this.gradeid,
                x: parseInt(this.x, 10),
                y: parseInt(this.y, 10),
                endx: parseInt(this.endx, 10),
                endy: parseInt(this.endy, 10),
                cartridgex: parseInt(this.cartridgex, 10),
                cartridgey: parseInt(this.cartridgey, 10),
                toolid: this.toolid,
                path: this.path,
                pageno: this.pageno,
                colour: this.colour,
                textannot: this.textannot,
                displaylock: parseInt(this.displaylock, 10),
                displayrotation: parseInt(this.displayrotation, 10),
                borderstyle: this.borderstyle,
                parent_annot: this.parent_annot,
                divcartridge: this.divcartridge,
                parent_annot_div: this.parent_annot_element.divcartridge
            };
        }
        return {
            gradeid: this.gradeid,
            x: parseInt(this.x, 10),
            y: parseInt(this.y, 10),
            endx: parseInt(this.endx, 10),
            endy: parseInt(this.endy, 10),
            cartridgex: parseInt(this.cartridgex, 10),
            cartridgey: parseInt(this.cartridgey, 10),
            toolid: this.toolid,
            path: this.path,
            pageno: this.pageno,
            colour: this.colour,
            textannot: this.textannot,
            displaylock: parseInt(this.displaylock, 10),
            displayrotation: parseInt(this.displayrotation, 10),
            borderstyle: this.borderstyle,
            parent_annot: this.parent_annot,
            divcartridge: this.divcartridge,
            parent_annot_div: ''
        };
    },
    get_color: function () {
        var color = ANNOTATIONCOLOUR[this.colour];
        if (!color) {
            color = this.colour;
        } else {
            // Add an alpha channel to the rgb colour.
            color = color.replace('rgb', 'rgba');
            color = color.replace(')', ',0.5)');
        }
        return color;
    },
    get_color_cartridge: function () {
        var color = ANNOTATIONCOLOUR[this.tooltype.cartridge_color];
        if (!color) {
            color = this.tooltype.cartridge_color;
        } else {
            // Add an alpha channel to the rgb colour.
            color = color.replace('rgb', 'rgba');
            color = color.replace(')', ',0.5)');
        }
        if (color === '') {
            return this.tooltypefamille.cartridge_color;
        }
        return color;
    },
    init_div_cartridge_id: function () {
        var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        this.divcartridge = 'ct_' + this.tooltype.id + '_' + date;
    },
    get_div_cartridge: function (colorcartridge) {
        var div = "<div ";
        div += "id='" + this.divcartridge + "' ";
        div += "class='assignfeedback_editpdfplus_cartridge' ";
        div += "style='border-color: " + colorcartridge + ";'> ";
        div += "</div>";
        return Y.Node.create(div);
    },
    get_div_cartridge_label: function (colorcartridge) {
        var divcartridge = "<div ";
        divcartridge += "id='" + this.divcartridge + "_cartridge' ";
        divcartridge += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_cartridge' ";
        if (this.editor.get('readonly') && this.get_valref() === '') {
            divcartridge += "style='border-right:none;padding-right:0px;color:" + colorcartridge + ";' ";
        } else {
            divcartridge += "style='border-right-color: " + colorcartridge + ";color:" + colorcartridge + ";' ";
        }
        divcartridge += "> ";
        divcartridge += this.tooltype.cartridge;
        divcartridge += "</div>";
        return Y.Node.create(divcartridge);
    },
    get_div_input: function (colorcartridge) {
        var divinput = "<div ";
        divinput += "id='" + this.divcartridge + "_display' ";
        divinput += "style='color:" + colorcartridge + "; ";
        if (this.editor.get('readonly') && this.get_valref() === '') {
            divinput += "padding:0px;";
        }
        divinput += "'></div>";
        var divinputdisplay = Y.Node.create(divinput);
        if (!this.editor.get('readonly')) {
            divinputdisplay.on('click', this.edit_annot, this);
        }
        return divinputdisplay;
    },
    get_div_edition: function () {
        var divedition = "<div ";
        divedition += "id='" + this.divcartridge + "_edit' ";
        divedition += "style='display:none;'> ";
        divedition += "<input id='" + this.divcartridge + "_editinput' type='text' value=\"" + this.get_valref() + "\" />";
        divedition += "</div>";
        var diveditiondisplay = Y.Node.create(divedition);
        var propositions = this.tooltype.texts;
        if (propositions && propositions.length > 0) {
            var divproposition = "<div></div>";
            var divpropositiondisplay = Y.Node.create(divproposition);
            var propositionarray = propositions.split('","');
            for (i = 0; i < propositionarray.length; i++) {
                var buttontmp = "<p class='btn btn-default'>" + propositionarray[i].replace('"', '') + "</p>";
                var buttontmpdisplay = Y.Node.create(buttontmp);
                buttontmpdisplay.on('click', this.fill_input_edition, this, propositionarray[i].replace('"', ''));
                divpropositiondisplay.append(buttontmpdisplay);
            }
            diveditiondisplay.append(divpropositiondisplay);
        }
        return diveditiondisplay;
    },
    get_div_container: function (colorcartridge) {
        var divconteneur = "<div ";
        divconteneur += "class='assignfeedback_editpdfplus_" + this.tooltypefamille.label + "_conteneur' >";
        divconteneur += "</div>";
        var divconteneurdisplay = Y.Node.create(divconteneur);
        var divinputdisplay = this.get_div_input(colorcartridge);
        divinputdisplay.addClass('assignfeedback_editpdfplus_' + this.tooltypefamille.label + '_input');
        var inputvalref = this.get_input_valref();
        var onof = 0;
        if (this.displaylock === '1') {
            onof = 1;
        }
        var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
        var readonly = this.editor.get('readonly');
        if (!readonly) {
            divinputdisplay.on('click', this.edit_annot, this);
        }
        divconteneurdisplay.append(divinputdisplay);
        divconteneurdisplay.append(inputvalref);
        divconteneurdisplay.append(inputonof);

        var readonly = this.editor.get('readonly');
        if (!readonly) {
            divconteneurdisplay.append(this.get_button_visibility());
            divconteneurdisplay.append(this.get_button_save());
            divconteneurdisplay.append(this.get_button_cancel());
        }

        return divconteneurdisplay;
    },
    get_button_visibility: function () {
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
        return buttonvisibilitydisplay;
    },
    get_button_save: function () {
        var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
        var buttonsavedisplay = Y.Node.create(buttonsave);
        buttonsavedisplay.on('click', this.save_annot, this, null);
        return buttonsavedisplay;
    },
    get_button_cancel: function () {
        var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
        var buttoncanceldisplay = Y.Node.create(buttoncancel);
        buttoncanceldisplay.on('click', this.cancel_edit, this);
        return buttoncanceldisplay;
    },
    get_valref: function () {
        if (this.textannot && this.textannot.length > 0 && typeof this.textannot === 'string') {
            return this.textannot;
        }
        return '';
    },
    get_input_valref: function () {
        return Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_valref' value=\"" + this.get_valref() + "\"/>");
    },
    apply_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        if (valref === '') {
            if (this.editor.get('readonly')) {
                divdisplay.setContent('');
            } else {
                divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
            }
        }
        if (interrupt.get('value') === '0') {
            if (valref !== '') {
                divdisplay.setContent(valref.substr(0, 20));
            }
            if (buttonplus) {
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/right', 'core'));
            }
        } else {
            if (valref !== '') {
                divdisplay.setContent(valref);
            }
            if (buttonplus) {
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/left', 'core'));
            }
        }
    },
    change_visibility_annot: function () {
        //var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        // var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        //var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        // if (valref === '') {
        //     divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
        // }
        if (interrupt.get('value') === '0') {
            interrupt.set('value', 1);
            this.displaylock = 1;
        } else {
            interrupt.set('value', 0);
            this.displaylock = 2;
        }
        this.apply_visibility_annot();
        this.editor.save_current_page();
    },
    move_cartridge_begin: function (e) {
        e.preventDefault();

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);

        this.oldx = point.x;
        this.oldy = point.y;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.on('mousemove', this.move_cartridge_continue, this);
        divcartridge.on('mouseup', this.move_cartridge_stop, this);
    },
    /**
     * Draw a selection around this annotation if it is selected.
     * @public
     * @method draw_highlight
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw_highlight: function () {
        var bounds,
                drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGREGION),
                offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY(),
                shape;

        if (this.editor.currentannotation === this) {
            // Draw a highlight around the annotation.
            bounds = new M.assignfeedback_editpdfplus.rect();
            bounds.bound([new M.assignfeedback_editpdfplus.point(this.x - 10, this.y - 10),
                new M.assignfeedback_editpdfplus.point(this.endx + 10, this.endy + 10)]);

            shape = this.editor.graphic.addShape({
                type: Y.Rect,
                width: bounds.width,
                height: bounds.height,
                stroke: {
                    weight: STROKEWEIGHT,
                    color: SELECTEDBORDERCOLOUR
                },
                fill: {
                    color: SELECTEDFILLCOLOUR
                },
                x: bounds.x,
                y: bounds.y
            });
            this.drawable.shapes.push(shape);

            // Add a delete X to the annotation.
            var deleteicon = Y.Node.create('<img src="' + M.util.image_url('trash', 'assignfeedback_editpdfplus') + '"/>'),
                    deletelink = Y.Node.create('<a href="#" role="button"></a>');

            deleteicon.setAttrs({
                'alt': M.util.get_string('deleteannotation', 'assignfeedback_editpdfplus')
            });
            deleteicon.setStyles({
                'backgroundColor': 'white'
            });
            deletelink.addClass('deleteannotationbutton');
            deletelink.append(deleteicon);

            drawingregion.append(deletelink);
            deletelink.setData('annotation', this);
            deletelink.setStyle('zIndex', '200');

            deletelink.on('click', this.remove, this);
            deletelink.on('key', this.remove, 'space,enter', this);

            deletelink.setX(offsetcanvas[0] + bounds.x + bounds.width - 18);
            deletelink.setY(offsetcanvas[1] + bounds.y + bounds.height - 18);
            this.drawable.nodes.push(deletelink);
        }
        return this.drawable;
    },
    /**
     * Draw an annotation
     * @public
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable|false
     */
    draw: function () {
        // Should be overridden by the subclass.
        this.draw_highlight();
        return this.drawable;
    },
    draw_catridge: function (edit) {
        return true;
    },
    edit_annot: function (e) {
        if (this.tooltype.type <= TOOLTYPE.COMMENTPLUS && !this.parent_annot_element) {
            var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
            var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
            var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
            var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
            var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
            var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
            var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
            divdisplay.hide();
            if (buttonplus) {
                buttonplus.hide();
            }
            divedit.show();
            buttonsave.show();
            buttoncancel.show();
            divprincipale.setStyle('z-index', 1000);
            input.set('focus', 'on');

            this.disabled_canvas_event();
            divprincipale.on('clickoutside', this.cancel_edit, this);
        }
    },
    fill_input_edition: function (e, unputtext) {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        if (input) {
            input.set('value', unputtext);
        }
        this.save_annot(unputtext);
    },
    save_annot: function (result) {
        if (typeof result !== 'string') {
            var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
            result = input.get('value');
        }
        this.textannot = result;
        this.editor.save_current_page();
        if (result.length === 0) {
            result = "&nbsp;&nbsp;";
        }
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
        valref.set('value', result);
        this.hide_edit();
        this.apply_visibility_annot();
    },
    cancel_edit: function () {
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref");
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        if (valref) {
            var result = valref.get('value');
            input.set('value', result);
        }
        this.hide_edit();
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        divprincipale.detach();
    },
    hide_edit: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        if (divdisplay) {
            divdisplay.show();
            divdisplay.set('style', 'display:inline;color:' + this.get_color_cartridge() + ';');
        }
        buttonplus.show();
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        divprincipale.setStyle('z-index', 1);

        this.enabled_canvas_event();
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
                annotations.splice(i, 1);
                if (this.drawable) {
                    this.drawable.erase();
                }
                this.editor.currentannotation = false;
                this.editor.save_current_page();
                return;
            }
        }
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
                diffy = newy - this.y,
                newpath, oldpath, xy,
                x, y;

        this.x += diffx;
        this.y += diffy;
        this.endx += diffx;
        this.endy += diffy;

        if (this.path) {
            newpath = [];
            oldpath = this.path.split(':');
            Y.each(oldpath, function (position) {
                xy = position.split(',');
                x = parseInt(xy[0], 10);
                y = parseInt(xy[1], 10);
                newpath.push((x + diffx) + ',' + (y + diffy));
            });

            this.path = newpath.join(':');

        }
        if (this.drawable) {
            this.drawable.erase();
        }
        this.editor.drawables.push(this.draw());
    },
    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit: function (edit) {
        var noop = edit && false;
        // Override me please.
        return noop;
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

        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = bounds.y;
        this.endx = bounds.x + bounds.width;
        this.endy = bounds.y + bounds.height;
        this.colour = edit.annotationcolour;
        this.path = '';
        return (bounds.has_min_width() && bounds.has_min_height());
    },
    disabled_canvas_event: function () {
        var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        drawingcanvas.detach();
    },
    enabled_canvas_event: function () {
        var drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        drawingcanvas.on('gesturemovestart', this.editor.edit_start, null, this.editor);
        drawingcanvas.on('gesturemove', this.editor.edit_move, null, this.editor);
        drawingcanvas.on('gesturemoveend', this.editor.edit_end, null, this.editor);
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotation = ANNOTATION;
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
 * Class representing a line.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationline
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONLINE = function(config) {
    ANNOTATIONLINE.superclass.constructor.apply(this, [config]);
};

ANNOTATIONLINE.NAME = "annotationline";
ANNOTATIONLINE.ATTRS = {};

Y.extend(ANNOTATIONLINE, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a line annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw : function() {
        var drawable,
            shape;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);

        shape = this.editor.graphic.addShape({
        type: Y.Path,
            fill: false,
            stroke: {
                weight: STROKEWEIGHT,
                color: ANNOTATIONCOLOUR[this.colour]
            }
        });

        shape.moveTo(this.x, this.y);
        shape.lineTo(this.endx, this.endy);
        shape.end();
        drawable.shapes.push(shape);
        this.drawable = drawable;

        return ANNOTATIONLINE.superclass.draw.apply(this);
    },

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit : function(edit) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            shape;

        shape = this.editor.graphic.addShape({
           type: Y.Path,
            fill: false,
            stroke: {
                weight: STROKEWEIGHT,
                color: ANNOTATIONCOLOUR[edit.annotationcolour]
            }
        });

        shape.moveTo(edit.start.x, edit.start.y);
        shape.lineTo(edit.end.x, edit.end.y);
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
     * @return bool true if line bound is more than min width/height, else false.
     */
    init_from_edit : function(edit) {
        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = edit.start.x;
        this.y = edit.start.y;
        this.endx = edit.end.x;
        this.endy = edit.end.y;
        this.colour = edit.annotationcolour;
        this.path = '';

        return !(((this.endx - this.x) === 0) && ((this.endy - this.y) === 0));
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationline = ANNOTATIONLINE;
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
 * Class representing a rectangle.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationrectangle
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONRECTANGLE = function(config) {
    ANNOTATIONRECTANGLE.superclass.constructor.apply(this, [config]);
};

ANNOTATIONRECTANGLE.NAME = "annotationrectangle";
ANNOTATIONRECTANGLE.ATTRS = {};

Y.extend(ANNOTATIONRECTANGLE, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a rectangle annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw : function() {
        var drawable,
            bounds,
            shape;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(this.x, this.y),
                      new M.assignfeedback_editpdfplus.point(this.endx, this.endy)]);

        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            stroke: {
               weight: STROKEWEIGHT,
               color: ANNOTATIONCOLOUR[this.colour]
            },
            x: bounds.x,
            y: bounds.y
        });
        drawable.shapes.push(shape);
        this.drawable = drawable;

        return ANNOTATIONRECTANGLE.superclass.draw.apply(this);
    },

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit : function(edit) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            shape,
            bounds;

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(edit.start.x, edit.start.y),
                      new M.assignfeedback_editpdfplus.point(edit.end.x, edit.end.y)]);

        // Set min. width and height of rectangle.
        if (!bounds.has_min_width()) {
            bounds.set_min_width();
        }
        if (!bounds.has_min_height()) {
            bounds.set_min_height();
        }

        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            stroke: {
               weight: STROKEWEIGHT,
               color: ANNOTATIONCOLOUR[edit.annotationcolour]
            },
            x: bounds.x,
            y: bounds.y
        });

        drawable.shapes.push(shape);

        return drawable;
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationrectangle = ANNOTATIONRECTANGLE;
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
 * Class representing a oval.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationoval
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONOVAL = function(config) {
    ANNOTATIONOVAL.superclass.constructor.apply(this, [config]);
};

ANNOTATIONOVAL.NAME = "annotationoval";
ANNOTATIONOVAL.ATTRS = {};

Y.extend(ANNOTATIONOVAL, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a oval annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw : function() {
        var drawable,
            bounds,
            shape;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(this.x, this.y),
                      new M.assignfeedback_editpdfplus.point(this.endx, this.endy)]);

        shape = this.editor.graphic.addShape({
            type: Y.Ellipse,
            width: bounds.width,
            height: bounds.height,
            stroke: {
               weight: STROKEWEIGHT,
               color: ANNOTATIONCOLOUR[this.colour]
            },
            x: bounds.x,
            y: bounds.y
        });
        drawable.shapes.push(shape);
        this.drawable = drawable;

        return ANNOTATIONOVAL.superclass.draw.apply(this);
    },

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit : function(edit) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            shape,
            bounds;

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(edit.start.x, edit.start.y),
                      new M.assignfeedback_editpdfplus.point(edit.end.x, edit.end.y)]);

        // Set min. width and height of oval.
        if (!bounds.has_min_width()) {
            bounds.set_min_width();
        }
        if (!bounds.has_min_height()) {
            bounds.set_min_height();
        }

        shape = this.editor.graphic.addShape({
            type: Y.Ellipse,
            width: bounds.width,
            height: bounds.height,
            stroke: {
               weight: STROKEWEIGHT,
               color: ANNOTATIONCOLOUR[edit.annotationcolour]
            },
            x: bounds.x,
            y: bounds.y
        });

        drawable.shapes.push(shape);

        return drawable;
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationoval = ANNOTATIONOVAL;
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
 * Class representing a pen.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationpen
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONPEN = function(config) {
    ANNOTATIONPEN.superclass.constructor.apply(this, [config]);
};

ANNOTATIONPEN.NAME = "annotationpen";
ANNOTATIONPEN.ATTRS = {};

Y.extend(ANNOTATIONPEN, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a pen annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw : function() {
        var drawable,
            shape,
            first,
            positions,
            xy;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);

        shape = this.editor.graphic.addShape({
           type: Y.Path,
            fill: false,
            stroke: {
                weight: STROKEWEIGHT,
                color: ANNOTATIONCOLOUR[this.colour]
            }
        });

        first = true;
        // Recreate the pen path array.
        positions = this.path.split(':');
        // Redraw all the lines.
        Y.each(positions, function(position) {
            xy = position.split(',');
            if (first) {
                shape.moveTo(xy[0], xy[1]);
                first = false;
            } else {
                shape.lineTo(xy[0], xy[1]);
            }
        }, this);

        shape.end();

        drawable.shapes.push(shape);
        this.drawable = drawable;

        return ANNOTATIONPEN.superclass.draw.apply(this);
    },

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit : function(edit) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            shape,
            first;

        shape = this.editor.graphic.addShape({
           type: Y.Path,
            fill: false,
            stroke: {
                weight: STROKEWEIGHT,
                color: ANNOTATIONCOLOUR[edit.annotationcolour]
            }
        });

        first = true;
        // Recreate the pen path array.
        // Redraw all the lines.
        Y.each(edit.path, function(position) {
            if (first) {
                shape.moveTo(position.x, position.y);
                first = false;
            } else {
                shape.lineTo(position.x, position.y);
            }
        }, this);

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
     * @return bool true if pen bound is more than min width/height, else false.
     */
    init_from_edit : function(edit) {
        var bounds = new M.assignfeedback_editpdfplus.rect(),
            pathlist = [],
            i = 0;

        // This will get the boundaries of all points in the path.
        bounds.bound(edit.path);

        for (i = 0; i < edit.path.length; i++) {
            pathlist.push(parseInt(edit.path[i].x, 10) + ',' + parseInt(edit.path[i].y, 10));
        }

        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = bounds.y;
        this.endx = bounds.x + bounds.width;
        this.endy = bounds.y + bounds.height;
        this.colour = edit.annotationcolour;
        this.path = pathlist.join(':');

        return (bounds.has_min_width() || bounds.has_min_height());
    }


});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationpen = ANNOTATIONPEN;
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
 * @class annotationhighlight
 * @extends M.assignfeedback_editpdfplus.annotation
 * @module moodle-assignfeedback_editpdfplus-editor
 */
var ANNOTATIONHIGHLIGHT = function(config) {
    ANNOTATIONHIGHLIGHT.superclass.constructor.apply(this, [config]);
};

ANNOTATIONHIGHLIGHT.NAME = "annotationhighlight";
ANNOTATIONHIGHLIGHT.ATTRS = {};

Y.extend(ANNOTATIONHIGHLIGHT, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a highlight annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw : function() {
        var drawable,
            shape,
            bounds,
            highlightcolour;

        drawable = new M.assignfeedback_editpdfplus.drawable(this.editor);
        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([new M.assignfeedback_editpdfplus.point(this.x, this.y),
                      new M.assignfeedback_editpdfplus.point(this.endx, this.endy)]);

        highlightcolour = ANNOTATIONCOLOUR[this.colour];

        // Add an alpha channel to the rgb colour.

        highlightcolour = highlightcolour.replace('rgb', 'rgba');
        highlightcolour = highlightcolour.replace(')', ',0.5)');

        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            stroke: false,
            fill: {
                color: highlightcolour
            },
            x: bounds.x,
            y: bounds.y
        });

        drawable.shapes.push(shape);
        this.drawable = drawable;

        return ANNOTATIONHIGHLIGHT.superclass.draw.apply(this);
    },

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit : function(edit) {
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

        highlightcolour = ANNOTATIONCOLOUR[edit.annotationcolour];
        // Add an alpha channel to the rgb colour.

        highlightcolour = highlightcolour.replace('rgb', 'rgba');
        highlightcolour = highlightcolour.replace(')', ',0.5)');

        // We will draw a box with the current background colour.
        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: 16,
            stroke: false,
            fill: {
               color: highlightcolour
            },
            x: bounds.x,
            y: edit.start.y
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
    init_from_edit : function(edit) {
        var bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([edit.start, edit.end]);

        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = edit.start.y;
        this.endx = bounds.x + bounds.width;
        this.endy = edit.start.y + 16;
        this.colour = edit.annotationcolour;
        this.page = '';

        return (bounds.has_min_width());
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationhighlight = ANNOTATIONHIGHLIGHT;
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
        this.page = '';

        return (bounds.has_min_width());
    },
    draw_catridge: function (edit) {
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
        if (this.divcartridge === '') {
            this.init_div_cartridge_id();
            var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);

            //init cartridge
            var colorcartridge = this.get_color_cartridge();
            var divdisplay = this.get_div_cartridge(colorcartridge);
            divdisplay.addClass('assignfeedback_editpdfplus_hightlightplus');

            // inscription entete
            var divcartridge = this.get_div_cartridge_label(colorcartridge);
            divdisplay.append(divcartridge);

            //creation input
            /*var divconteneur = "<div ";
             divconteneur += "class='assignfeedback_editpdfplus_hightlightplus_conteneur' >";
             divconteneur += "</div>";
             var divconteneurdisplay = Y.Node.create(divconteneur);*/
            //divconteneurdisplay.on('click', this.edit_annot, this);
            /*var divinputdisplay = this.get_div_input(colorcartridge);
             divinputdisplay.addClass('assignfeedback_editpdfplus_hightlightplus_input');
             var inputvalref = this.get_input_valref();
             var onof = 0;
             if (this.displaylock === '1') {
             onof = 1;
             }
             var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
             divinputdisplay.on('click', this.edit_annot, this);
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
             buttonsavedisplay.on('click', this.save_annot, this, null);
             var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
             var buttoncanceldisplay = Y.Node.create(buttoncancel);
             buttoncanceldisplay.on('click', this.cancel_edit, this);
             divconteneurdisplay.append(divinputdisplay);
             divconteneurdisplay.append(inputvalref);
             divconteneurdisplay.append(inputonof);
             divconteneurdisplay.append(buttonvisibilitydisplay);
             divconteneurdisplay.append(buttonsavedisplay);
             divconteneurdisplay.append(buttoncanceldisplay);*/
            var divconteneurdisplay = this.get_div_container(colorcartridge);
            divdisplay.append(divconteneurdisplay);

            //creation de la div d'edition
            if (!this.editor.get('readonly')) {
                var diveditiondisplay = this.get_div_edition();
                diveditiondisplay.addClass('assignfeedback_editpdfplus_hightlightplus_edition');
                divconteneurdisplay.append(diveditiondisplay);
            }

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
            var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge);
            divdisplay.setX(offsetcanvas[0] + this.x + this.cartridgex);
            divdisplay.setY(offsetcanvas[1] + this.y + this.cartridgey);
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
                    var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge);
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
 * Class representing a stamp.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationstamp
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONSTAMP = function(config) {
    ANNOTATIONSTAMP.superclass.constructor.apply(this, [config]);
};

ANNOTATIONSTAMP.NAME = "annotationstamp";
ANNOTATIONSTAMP.ATTRS = {};

Y.extend(ANNOTATIONSTAMP, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a stamp annotation
     * @protected
     * @method draw
     * @return M.assignfeedback_editpdfplus.drawable
     */
    draw : function() {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
            node,
            position;

        position = this.editor.get_window_coordinates(new M.assignfeedback_editpdfplus.point(this.x, this.y));
        node = Y.Node.create('<div/>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            'backgroundImage': 'url(' + this.editor.get_stamp_image_url(this.path) + ')',
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
        return ANNOTATIONSTAMP.superclass.draw.apply(this);
    },

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    draw_current_edit : function(edit) {
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
            'backgroundImage': 'url(' + this.editor.get_stamp_image_url(edit.stamp) + ')',
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
    init_from_edit : function(edit) {
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
        this.path = edit.stamp;

        // Min width and height is always more than 40px.
        return true;
    },

    /**
     * Move an annotation to a new location.
     * @public
     * @param int newx
     * @param int newy
     * @method move_annotation
     */
    move : function(newx, newy) {
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
M.assignfeedback_editpdfplus.annotationstamp = ANNOTATIONSTAMP;
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
 * Class representing a stamp.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationstampplus
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONSTAMPPLUS = function (config) {
    ANNOTATIONSTAMPPLUS.superclass.constructor.apply(this, [config]);
};

ANNOTATIONSTAMPPLUS.NAME = "annotationstampplus";
ANNOTATIONSTAMPPLUS.ATTRS = {};

Y.extend(ANNOTATIONSTAMPPLUS, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a stamp annotation
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
        node = Y.Node.create('<div>' + this.tooltype.label + '</div>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            //'zIndex': 50,
            'color': this.colour,
            'border': '2px solid ' + this.colour,
            'padding': '0 2px'
        });

        drawingcanvas.append(node);
        node.setX(position.x);
        node.setY(position.y);
        drawable.store_position(node, position.x, position.y);
        drawable.nodes.push(node);

        this.drawable = drawable;
        return ANNOTATIONSTAMPPLUS.superclass.draw.apply(this);
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

        node = Y.Node.create('<div>' + this.tooltype.label + '</div>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            //'zIndex': 50,
            'color': this.colour,
            'border': '2px solid ' + this.colour,
            'padding': '0 2px'
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
        this.x = bounds.x - 20;
        this.y = bounds.y - 10;
        this.endx = bounds.x + bounds.width;
        this.endy = bounds.y + bounds.height;

        // Min width and height is always more than 40px.
        return true;
    },
    edit_annot: function (e) {
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
M.assignfeedback_editpdfplus.annotationstampplus = ANNOTATIONSTAMPPLUS;
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
            divdisplay.append(divcartridge);

            //creation input
            var divconteneurdisplay = this.get_div_container(colorcartridge);
            divdisplay.append(divconteneurdisplay);
            /*var divconteneur = "<div ";
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
             buttonsavedisplay.on('click', this.save_annot, this, null);
             var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
             var buttoncanceldisplay = Y.Node.create(buttoncancel);
             buttoncanceldisplay.on('click', this.cancel_edit, this);
             divconteneurdisplay.append(divinputdisplay);
             divconteneurdisplay.append(inputvalref);
             divconteneurdisplay.append(inputonof);
             divconteneurdisplay.append(inputrotationdisplay);
             divconteneurdisplay.append(buttonvisibilitydisplay);
             divconteneurdisplay.append(buttonsavedisplay);
             divconteneurdisplay.append(buttoncanceldisplay);
             divconteneurdisplay.append(buttonrotationdisplay);
             divdisplay.append(divconteneurdisplay);*/
            if (!this.editor.get('readonly')) {
                var rotationvalue = 0;
                if (this.displayrotation > 0) {
                    rotationvalue = 1;
                }
                var inputrotationdisplay = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_rotation' value=" + rotationvalue + " />");
                divconteneurdisplay.append(inputrotationdisplay);
                var buttonrotation = "<button id='" + this.divcartridge + "_buttonrotation'><img src='" + M.util.image_url('e/restore_draft', 'core') + "' /></button>";
                var buttonrotationdisplay = Y.Node.create(buttonrotation);
                buttonrotationdisplay.on('click', this.change_stamp, this);
                divconteneurdisplay.append(buttonrotationdisplay);
            }

            //creation de la div d'edition
            if (!this.editor.get('readonly')) {
                var diveditiondisplay = this.get_div_edition();
                diveditiondisplay.addClass('assignfeedback_editpdfplus_stampcomment_edition');
                divconteneurdisplay.append(diveditiondisplay);
            }

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
            var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge);
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
 * @class annotationframe
 * @extends M.assignfeedback_editpdfplus.annotation
 * @module moodle-assignfeedback_editpdfplus-editor
 */
var ANNOTATIONFRAME = function (config) {
    ANNOTATIONFRAME.superclass.constructor.apply(this, [config]);
};

ANNOTATIONFRAME.NAME = "annotationframe";
ANNOTATIONFRAME.ATTRS = {};

Y.extend(ANNOTATIONFRAME, M.assignfeedback_editpdfplus.annotation, {
    children: [],
    oldx: 0,
    oldy: 0,
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

        //var date = (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        this.shape_id = 'ct_frame_' + (new Date().toJSON()).replace(/:/g, '').replace(/\./g, '');
        shape = this.editor.graphic.addShape({
            id: this.shape_id,
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            stroke: {
                weight: 2,
                color: this.get_color()
            },
            x: bounds.x,
            y: bounds.y
        });
        if (this.borderstyle === 'dashed') {
            shape.set("stroke", {
                dashstyle: [5, 3]
            });
        } else if (this.borderstyle === 'dotted') {
            shape.set("stroke", {
                dashstyle: [2, 2]
            });
        }
        //Y.log('draw : ' + this.shape_id);

        drawable.shapes.push(shape);
        this.drawable = drawable;

        this.draw_catridge();

        return ANNOTATIONFRAME.superclass.draw.apply(this);
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
            stroke: {
                weight: 2,
                color: this.get_color()
            },
            x: bounds.x,
            y: edit.start.y - 8
        });
        if (this.borderstyle === 'dashed') {
            shape.set("stroke", {
                dashstyle: [5, 3]
            });
        } else if (this.borderstyle === 'dotted') {
            shape.set("stroke", {
                dashstyle: [2, 2]
            });
        }

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
    get_color: function () {
        return this.colour;
    },
    draw_catridge: function (edit) {
        if (this.parent_annot_element === null && this.parent_annot === 0) {
            var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
            if (this.divcartridge === '') {
                this.init_div_cartridge_id();
                var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);

                //init cartridge
                var colorcartridge = this.get_color();
                var divdisplay = this.get_div_cartridge(colorcartridge);
                divdisplay.addClass('assignfeedback_editpdfplus_frame');
                divdisplay.setStyles({'border-style': this.borderstyle});
                divdisplay.set('draggable', 'true');

                // inscription entete
                var divcartridge = this.get_div_cartridge_label(colorcartridge);
                divcartridge.on('mousedown', this.move_cartridge_begin, this);
                divdisplay.append(divcartridge);

                //creation input
                var divconteneurdisplay = this.get_div_container(colorcartridge);
                /*var divconteneur = "<div ";
                 divconteneur += "class='assignfeedback_editpdfplus_frame_conteneur' >";
                 divconteneur += "</div>";
                 var divconteneurdisplay = Y.Node.create(divconteneur);
                 var divinputdisplay = this.get_div_input(colorcartridge);
                 divinputdisplay.addClass('assignfeedback_editpdfplus_frame_input');
                 var inputvalref = this.get_input_valref();
                 var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
                 var buttonsavedisplay = Y.Node.create(buttonsave);
                 buttonsavedisplay.on('click', this.save_annot, this, null);
                 var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
                 var buttoncanceldisplay = Y.Node.create(buttoncancel);
                 buttoncanceldisplay.on('click', this.cancel_edit, this);*/
                if (!this.editor.get('readonly')) {
                    var buttonrender = "<button id='" + this.divcartridge + "_buttonpencil'><img src='";
                    buttonrender += M.util.image_url('e/text_highlight_picker', 'core');
                    buttonrender += "' /></button>";
                    var buttonrenderdisplay = Y.Node.create(buttonrender);
                    buttonrenderdisplay.on('click', this.display_picker, this);
                    var buttonadd = "<button id='" + this.divcartridge + "_buttonadd'><img src='";
                    buttonadd += M.util.image_url('t/add', 'core');
                    buttonadd += "' /></button>";
                    var buttonadddisplay = Y.Node.create(buttonadd);
                    buttonadddisplay.on('click', this.add_annot, this);
                    //divconteneurdisplay.append(divinputdisplay);
                    //divconteneurdisplay.append(inputvalref);
                    //divconteneurdisplay.append(buttonsavedisplay);
                    //divconteneurdisplay.append(buttoncanceldisplay);
                    divconteneurdisplay.append(buttonrenderdisplay);
                    divconteneurdisplay.append(buttonadddisplay);
                }
                //divdisplay.append(divconteneurdisplay);
                divdisplay.append(divconteneurdisplay);

                //creation de la div d'edition
                if (!this.editor.get('readonly')) {
                    var diveditiondisplay = this.get_div_edition();
                    diveditiondisplay.addClass('assignfeedback_editpdfplus_frame_edition');
                    divconteneurdisplay.append(diveditiondisplay);
                }

                //creation de la div palette
                if (!this.editor.get('readonly')) {
                    var diveditionrender = "<div ";
                    diveditionrender += "id='" + this.divcartridge + "_picker' ";
                    diveditionrender += "class='assignfeedback_editpdfplus_frame_picker' ";
                    diveditionrender += "style='display:none;text-align:right;'> ";
                    diveditionrender += "</div>";
                    var diveditionrenderdisplay = Y.Node.create(diveditionrender);
                    divconteneurdisplay.append(diveditionrenderdisplay);
                    var diveditioncolordisplay = Y.Node.create("<div style='display:inline-block;vertical-align:top;'></div>");
                    var diveditionframedisplay = Y.Node.create("<div style='display:inline-block;vertical-align:top;'></div>");
                    diveditionrenderdisplay.append(diveditioncolordisplay);
                    diveditionrenderdisplay.append(diveditionframedisplay);
                    var diveditionwhitedisplay = Y.Node.create("<div style='margin:5px;background-color:#FFFFFF;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionwhitedisplay.on('click', this.change_color, this, 'white');
                    var diveditionyellowdisplay = Y.Node.create("<div style='margin:5px;background-color:#FFCF35;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionyellowdisplay.on('click', this.change_color, this, '#FFCF35');
                    var diveditionreddisplay = Y.Node.create("<div style='margin:5px;background-color:#EF4540;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionreddisplay.on('click', this.change_color, this, '#EF4540');
                    var diveditiongreendisplay = Y.Node.create("<div style='margin:5px;background-color:#99CA3E;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditiongreendisplay.on('click', this.change_color, this, '#99CA3E');
                    var diveditionbluedisplay = Y.Node.create("<div style='margin:5px;background-color:#7D9FD3;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionbluedisplay.on('click', this.change_color, this, '#7D9FD3');
                    var diveditionblackdisplay = Y.Node.create("<div style='margin:5px;background-color:#333333;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionblackdisplay.on('click', this.change_color, this, 'black');
                    diveditioncolordisplay.append(diveditionwhitedisplay);
                    diveditioncolordisplay.append(diveditionyellowdisplay);
                    diveditioncolordisplay.append(diveditionreddisplay);
                    diveditioncolordisplay.append(diveditiongreendisplay);
                    diveditioncolordisplay.append(diveditionbluedisplay);
                    diveditioncolordisplay.append(diveditionblackdisplay);
                    var diveditionsoliddisplay = Y.Node.create("<div style='margin:5px;border:2px solid #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditionsoliddisplay.on('click', this.change_border, this, 'solid');
                    var diveditiondotteddisplay = Y.Node.create("<div style='margin:5px;border:2px dotted #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditiondotteddisplay.on('click', this.change_border, this, 'dotted');
                    var diveditiondasheddisplay = Y.Node.create("<div style='margin:5px;border:2px dashed #ccc;min-width:20px;min-height:20px;'></div>");
                    diveditiondasheddisplay.on('click', this.change_border, this, 'dashed');
                    diveditionframedisplay.append(diveditionsoliddisplay);
                    diveditionframedisplay.append(diveditiondotteddisplay);
                    diveditionframedisplay.append(diveditiondasheddisplay);
                }

                //positionnement de la div par rapport a l'annotation
                if (!this.cartridgex || this.cartridgex === 0) {
                    this.cartridgex = parseInt(this.tooltypefamille.cartridge_x);
                }
                if (!this.cartridgey || this.cartridgey === 0) {
                    this.cartridgey = parseInt(this.tooltypefamille.cartridge_y);
                }
                divdisplay.setX(this.cartridgex);
                divdisplay.setY(this.y + this.cartridgey);
                drawingregion.append(divdisplay);

                this.apply_visibility_annot();
                if (!this.editor.get('readonly')) {
                    var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
                    buttonplus.hide();
                }

            } else {
                var divid = '#' + this.divcartridge;
                var divdisplay = this.editor.get_dialogue_element(divid);
                divdisplay.setX(offsetcanvas[0] + this.cartridgex);
                divdisplay.setY(offsetcanvas[1] + this.y + this.cartridgey);
            }
        }
        return true;
    },
    move_cartridge_continue: function (e) {
        e.preventDefault();

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.cartridgex + diffx);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey + diffy);
    },
    move_cartridge_stop: function (e) {
        e.preventDefault();

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.detach('mousemove', this.move_cartridge_continue, this);
        divcartridge.detach('mouseup', this.move_cartridge_stop, this);

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        this.cartridgex += diffx;
        this.cartridgey += diffy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.cartridgex);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey);

        this.editor.save_current_page();
    },
    /*apply_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        if (valref === '') {
            if (this.editor.get('readonly')) {
                divdisplay.setContent('');
            } else {
                divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
            }
        } else if (valref !== '') {
            divdisplay.setContent(valref);
        }
    },*/
    add_annot: function (e) {
        this.editor.currentedit.parent_annot_element = this;
        this.editor.handle_tool_button(e, TOOLTYPELIB.FRAME, 'ctbutton' + this.toolid, 1);
    },
    display_picker: function () {
        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        var buttonrenderdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
        divcartridge.setStyle('z-index', 1000);
        divpalette.show();
        //divpalette.setStyle('z-index', 1000);
        buttonrenderdisplay.on('click', this.hide_picker, this);
    },
    hide_picker: function () {
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        var buttonrenderdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divpalette.hide();
        //divcartridge.setStyle('z-index', 0);
        divcartridge.setStyle('z-index', 0);
        buttonrenderdisplay.on('click', this.display_picker, this);
    },
    change_color: function (e, colour) {
        this.colour = colour;
        var shape = this.editor.graphic.getShapeById(this.shape_id);
        shape.set("stroke", {
            color: this.colour
        });
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] && (this.children[i].parent_annot === this.id || this.children[i].parent_annot_element.divcartridge === this.divcartridge)) {
                this.children[i].colour = colour;
                var shapechd = this.editor.graphic.getShapeById(this.children[i].shape_id);
                if (shapechd) {
                    shapechd.set("stroke", {
                        color: this.colour
                    });
                }
            }
        }
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        divprincipale.setStyles({
            'border-color': this.colour,
            'color': this.colour
        });
        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.setStyles({
            'border-color': this.colour,
            'color': this.colour
        });
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        divdisplay.setStyles({
            'color': this.colour
        });
        this.hide_picker();
        this.editor.save_current_page();
    },
    change_border: function (e, border) {
        this.borderstyle = border;
        var shape = this.editor.graphic.getShapeById(this.shape_id);
        if (this.borderstyle === 'solid') {
            shape.set("stroke", {
                dashstyle: 'none'
            });
        } else if (this.borderstyle === 'dashed') {
            shape.set("stroke", {
                dashstyle: [5, 3]
            });
        } else {
            shape.set("stroke", {
                dashstyle: [2, 2]
            });
        }
        for (i = 0; i < this.children.length; i++) {
            if (this.children[i] && (this.children[i].parent_annot === this.id || this.children[i].parent_annot_element.divcartridge === this.divcartridge)) {
                this.children[i].borderstyle = border;
                var shapechd = this.editor.graphic.getShapeById(this.children[i].shape_id);
                if (shapechd) {
                    if (this.borderstyle === 'solid') {
                        shapechd.set("stroke", {
                            dashstyle: 'none'
                        });
                    } else if (this.borderstyle === 'dashed') {
                        shapechd.set("stroke", {
                            dashstyle: [5, 3]
                        });
                    } else {
                        shapechd.set("stroke", {
                            dashstyle: [2, 2]
                        });
                    }
                }
            }
        }
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        divprincipale.setStyles({
            'border-style': this.borderstyle
        });
        var divpalette = this.editor.get_dialogue_element('#' + this.divcartridge + "_picker");
        divpalette.hide();
        //Y.log('change_border : ' + this.borderstyle);
        this.editor.save_current_page();
    },
    edit_annot: function (e) {
        if (!this.parent_annot_element) {
            var buttonrender = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
            var buttonadd = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonadd");
            this.hide_picker();
            buttonrender.hide();
            buttonadd.hide();
            ANNOTATIONFRAME.superclass.edit_annot.call(this);
        }
    },
    hide_edit: function () {
        var divprincipale = this.editor.get_dialogue_element('#' + this.divcartridge);
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var divedit = this.editor.get_dialogue_element('#' + this.divcartridge + "_edit");
        var buttonsave = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonsave");
        var buttoncancel = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttoncancel");
        var buttonrender = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonpencil");
        var buttonadd = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonadd");
        divdisplay.show();
        divdisplay.set('style', 'display:inline;color:' + this.get_color() + ';');
        divedit.hide();
        buttonsave.hide();
        buttoncancel.hide();
        buttonrender.show();
        buttonadd.show();
        divdisplay.setStyle('z-index', 1);

        this.enabled_canvas_event();
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
                if (this.children && this.children.length > 0) {
                    for (i = 0; i < this.children.length; i++) {
                        if (this.children[i] && (this.children[i].parent_annot === this.id || this.children[i].parent_annot_element.divcartridge === this.divcartridge)) {
                            for (var j = 0; j < annotations.length; j++) {
                                if (annotations[j] === this.children[i]) {
                                    annotations.splice(j, 1);
                                    if (this.children[i].drawable) {
                                        this.children[i].drawable.erase();
                                    }
                                }
                            }
                        }
                    }
                }
                this.editor.currentannotation = false;
                this.editor.save_current_page();
                return;
            }
        }
    }

});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.annotationframe = ANNOTATIONFRAME;
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
        if (this.endy - this.y <= 30) {
            this.endy = this.y + 30;
        }
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
        if (!bounds.has_min_height()) {
            bounds.set_min_height();
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
        if (edit.end.y - edit.start.y <= 30) {
            shape.lineTo(edit.start.x, edit.start.y + 30);
        } else {
            shape.lineTo(edit.start.x, edit.end.y);
        }
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
        if (edit.end.y - this.y <= 30) {
            this.endy = this.y + 30;
        } else {
            this.endy = edit.end.y;
        }
        this.page = '';
        return !(((this.endx - this.x) === 0) && ((this.endy - this.y) === 0));
    },
    draw_catridge: function (edit) {
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();
        if (this.divcartridge === '') {
            this.init_div_cartridge_id();
            var drawingregion = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS);

            //init cartridge
            var colorcartridge = this.get_color_cartridge();
            var divdisplay = this.get_div_cartridge(colorcartridge);
            divdisplay.addClass('assignfeedback_editpdfplus_verticalline');

            // inscription entete
            var divcartridge = this.get_div_cartridge_label(colorcartridge);
            divcartridge.on('mousedown', this.move_cartridge_begin, this);
            divdisplay.append(divcartridge);

            //creation input
            var divconteneurdisplay = this.get_div_container(colorcartridge);
            divdisplay.append(divconteneurdisplay);
            /*var divconteneur = "<div ";
             divconteneur += "class='assignfeedback_editpdfplus_verticalline_conteneur' >";
             divconteneur += "</div>";
             var divconteneurdisplay = Y.Node.create(divconteneur);
             var divinputdisplay = this.get_div_input(colorcartridge);
             divinputdisplay.addClass('assignfeedback_editpdfplus_verticalline_input');
             var inputvalref = this.get_input_valref();
             var onof = 0;
             if (this.displaylock === '1') {
             onof = 1;
             }
             var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
             divinputdisplay.on('click', this.edit_annot, this);
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
             buttonsavedisplay.on('click', this.save_annot, this, null);
             var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
             var buttoncanceldisplay = Y.Node.create(buttoncancel);
             buttoncanceldisplay.on('click', this.cancel_edit, this);
             divconteneurdisplay.append(divinputdisplay);
             divconteneurdisplay.append(inputvalref);
             divconteneurdisplay.append(inputonof);
             divconteneurdisplay.append(buttonvisibilitydisplay);
             divconteneurdisplay.append(buttonsavedisplay);
             divconteneurdisplay.append(buttoncanceldisplay);
             divdisplay.append(divconteneurdisplay);*/

            //creation de la div d'edition
            if (!this.editor.get('readonly')) {
                var diveditiondisplay = this.get_div_edition();
                diveditiondisplay.addClass('assignfeedback_editpdfplus_verticalline_edition');
                divconteneurdisplay.append(diveditiondisplay);
            }

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
            var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge);
            divdisplay.setX(offsetcanvas[0] + this.x + this.cartridgex);
            divdisplay.setY(offsetcanvas[1] + this.y + this.cartridgey);
        }
        return true;
    },
    move_cartridge_continue: function (e) {
        e.preventDefault();

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.x + this.cartridgex + diffx);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey + diffy);
    },
    move_cartridge_stop: function (e) {
        e.preventDefault();

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge + "_cartridge");
        divcartridge.detach('mousemove', this.move_cartridge_continue, this);
        divcartridge.detach('mouseup', this.move_cartridge_stop, this);

        var canvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.editor.get_canvas_coordinates(clientpoint);
        var offsetcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS).getXY();

        var diffx = point.x - this.oldx;
        var diffy = point.y - this.oldy;

        this.cartridgex += diffx;
        this.cartridgey += diffy;

        var divcartridge = this.editor.get_dialogue_element('#' + this.divcartridge);
        divcartridge.setX(offsetcanvas[0] + this.x + this.cartridgex);
        divcartridge.setY(offsetcanvas[1] + this.y + this.cartridgey);

        this.editor.save_current_page();
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
 * Class representing a comment.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class annotationcommentplus
 * @extends M.assignfeedback_editpdfplus.annotation
 */
var ANNOTATIONCOMMENTPLUS = function (config) {
    ANNOTATIONCOMMENTPLUS.superclass.constructor.apply(this, [config]);
};

ANNOTATIONCOMMENTPLUS.NAME = "annotationcommentplus";
ANNOTATIONCOMMENTPLUS.ATTRS = {};

Y.extend(ANNOTATIONCOMMENTPLUS, M.assignfeedback_editpdfplus.annotation, {
    /**
     * Draw a comment annotation
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
        node = Y.Node.create('<div><img src=\'' + M.util.image_url('comment', 'assignfeedback_editpdfplus') + '\' /></div>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            'zIndex': 50,
            'color': this.colour,
            'padding': '0 2px'
        });

        drawingcanvas.append(node);
        node.setX(position.x);
        node.setY(position.y);
        drawable.store_position(node, position.x, position.y);
        drawable.nodes.push(node);

        this.drawable = drawable;

        this.draw_catridge();

        return ANNOTATIONCOMMENTPLUS.superclass.draw.apply(this);
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

        node = Y.Node.create('<div>' + this.tooltype.label + '</div>');
        node.setStyles({
            'position': 'absolute',
            'display': 'inline-block',
            'zIndex': 50,
            'color': this.colour,
            'padding': '0 2px'
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

        if (bounds.width < 20) {
            bounds.width = 20;
        }
        if (bounds.height < 20) {
            bounds.height = 20;
        }
        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x - 20;
        this.y = bounds.y - 10;
        this.endx = bounds.x + bounds.width;
        this.endy = bounds.y + bounds.height;

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
            divdisplay.addClass('assignfeedback_editpdfplus_commentplus');

            // inscription entete
            var divcartridge = this.get_div_cartridge_label(colorcartridge);
            divdisplay.append(divcartridge);

            //creation input
            var divconteneurdisplay = this.get_div_container(colorcartridge);
            divdisplay.append(divconteneurdisplay);
            /*var divconteneur = "<div ";
             divconteneur += "class='assignfeedback_editpdfplus_commentplus_conteneur' >";
             divconteneur += "</div>";
             var divconteneurdisplay = Y.Node.create(divconteneur);
             var divinputdisplay = this.get_div_input(colorcartridge);
             divinputdisplay.addClass('assignfeedback_editpdfplus_commentplus_input');
             divinputdisplay.setStyles({'width': '200px'});
             var inputvalref = this.get_input_valref();
             var onof = 0;
             if (this.displaylock === '1') {
             onof = 1;
             }
             var inputonof = Y.Node.create("<input type='hidden' id='" + this.divcartridge + "_onof' value=" + onof + " />");
             divinputdisplay.on('click', this.edit_annot, this);
             var buttonvisibility = "<button id='" + this.divcartridge + "_buttonedit' ";
             buttonvisibility += "><img src='";
             if (this.displaylock === 1) {
             buttonvisibility += M.util.image_url('t/up', 'core');
             } else {
             buttonvisibility += M.util.image_url('t/down', 'core');
             }
             buttonvisibility += "' /></button>";
             var buttonvisibilitydisplay = Y.Node.create(buttonvisibility);
             buttonvisibilitydisplay.on('click', this.change_visibility_annot, this);
             var buttonsave = "<button id='" + this.divcartridge + "_buttonsave' style='display:none;margin-left:110px;'><img src='" + M.util.image_url('t/check', 'core') + "' /></button>";
             var buttonsavedisplay = Y.Node.create(buttonsave);
             buttonsavedisplay.on('click', this.save_annot, this, null);
             var buttoncancel = "<button id='" + this.divcartridge + "_buttoncancel' style='display:none;'><img src='" + M.util.image_url('t/reset', 'core') + "' /></button>";
             var buttoncanceldisplay = Y.Node.create(buttoncancel);
             buttoncanceldisplay.on('click', this.cancel_edit, this);
             divconteneurdisplay.append(divinputdisplay);
             divconteneurdisplay.append(inputvalref);
             divconteneurdisplay.append(inputonof);
             divconteneurdisplay.append(buttonvisibilitydisplay);
             divconteneurdisplay.append(buttonsavedisplay);
             divconteneurdisplay.append(buttoncanceldisplay);
             divdisplay.append(divconteneurdisplay);*/

            //creation de la div d'edition
            if (!this.editor.get('readonly')) {
                var diveditiondisplay = this.get_div_edition();
                diveditiondisplay.addClass('assignfeedback_editpdfplus_commentplus_edition');
                divconteneurdisplay.append(diveditiondisplay);
            }

            divdisplay.setX(this.x + 20);
            divdisplay.setY(this.y);
            drawingregion.append(divdisplay);

            this.apply_visibility_annot();
        } else {
            var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge);
            divdisplay.setX(offsetcanvas[0] + this.x + 20);
            divdisplay.setY(offsetcanvas[1] + this.y);
        }
        return true;
    },
    apply_visibility_annot: function () {
        var divdisplay = this.editor.get_dialogue_element('#' + this.divcartridge + "_display");
        var interrupt = this.editor.get_dialogue_element('#' + this.divcartridge + "_onof");
        var valref = this.editor.get_dialogue_element('#' + this.divcartridge + "_valref").get('value');
        var buttonplus = this.editor.get_dialogue_element('#' + this.divcartridge + "_buttonedit");
        if (valref === '') {
            if (this.editor.get('readonly')) {
                divdisplay.setContent('');
            } else {
                divdisplay.setContent('&nbsp;&nbsp;&nbsp;&nbsp');
            }
        }
        if (interrupt.get('value') === '0') {
            if (valref !== '') {
                divdisplay.setContent(valref.substr(0, 20));
            }
            if (buttonplus) {
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/down', 'core'));
            }
        } else {
            if (valref !== '') {
                divdisplay.setContent('<table><tr><td>' + valref.replace(/\n/g, "<br/>") + '</td></tr></table><br/>');
            }
            if (buttonplus) {
                buttonplus.one('img').setAttribute('src', M.util.image_url('t/up', 'core'));
            }
        }
    },
    save_annot: function () {
        var input = this.editor.get_dialogue_element('#' + this.divcartridge + "_editinput");
        var result = input.get('value');
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
M.assignfeedback_editpdfplus.annotationcommentplus = ANNOTATIONCOMMENTPLUS;
var DROPDOWN_NAME = "Dropdown menu",
    DROPDOWN;

/**
 * Provides an in browser PDF editor.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */

/**
 * This is a drop down list of buttons triggered (and aligned to) a button.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class dropdown
 * @constructor
 * @extends M.core.dialogue
 */
DROPDOWN = function(config) {
    config.draggable = false;
    config.centered = false;
    config.width = 'auto';
    config.visible = false;
    config.footerContent = '';
    DROPDOWN.superclass.constructor.apply(this, [config]);
};

Y.extend(DROPDOWN, M.core.dialogue, {
    /**
     * Initialise the menu.
     *
     * @method initializer
     * @return void
     */
    initializer : function(config) {
        var button, body, headertext, bb;
        DROPDOWN.superclass.initializer.call(this, config);

        bb = this.get('boundingBox');
        bb.addClass('assignfeedback_editpdfplus_dropdown');

        // Align the menu to the button that opens it.
        button = this.get('buttonNode');

        // Close the menu when clicked outside (excluding the button that opened the menu).
        body = this.bodyNode;

        headertext = Y.Node.create('<h3/>');
        headertext.addClass('accesshide');
        headertext.setHTML(this.get('headerText'));
        body.prepend(headertext);

        body.on('clickoutside', function(e) {
            if (this.get('visible')) {
                // Note: we need to compare ids because for some reason - sometimes button is an Object, not a Y.Node.
                if (e.target.get('id') !== button.get('id') && e.target.ancestor().get('id') !== button.get('id')) {
                    e.preventDefault();
                    this.hide();
                }
            }
        }, this);

        button.on('click', function(e) {e.preventDefault(); this.show();}, this);
        button.on('key', this.show, 'enter,space', this);
    },

    /**
     * Override the show method to align to the button.
     *
     * @method show
     * @return void
     */
    show : function() {
        var button = this.get('buttonNode'),
            result = DROPDOWN.superclass.show.call(this);
        this.align(button, [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]);

        return result;
    }
}, {
    NAME : DROPDOWN_NAME,
    ATTRS : {
        /**
         * The header for the drop down (only accessible to screen readers).
         *
         * @attribute headerText
         * @type String
         * @default ''
         */
        headerText : {
            value : ''
        },

        /**
         * The button used to show/hide this drop down menu.
         *
         * @attribute buttonNode
         * @type Y.Node
         * @default null
         */
        buttonNode : {
            value : null
        }
    }
});

Y.Base.modifyAttrs(DROPDOWN, {
    /**
     * Whether the widget should be modal or not.
     *
     * Moodle override: We override this for commentsearch to force it always false.
     *
     * @attribute Modal
     * @type Boolean
     * @default false
     */
    modal: {
        getter: function() {
            return false;
        }
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.dropdown = DROPDOWN;
var COLOURPICKER_NAME = "Colourpicker",
    COLOURPICKER;

/**
 * Provides an in browser PDF editor.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */

/**
 * COLOURPICKER
 * This is a drop down list of colours.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class colourpicker
 * @constructor
 * @extends M.assignfeedback_editpdfplus.dropdown
 */
COLOURPICKER = function(config) {
    COLOURPICKER.superclass.constructor.apply(this, [config]);
};

Y.extend(COLOURPICKER, M.assignfeedback_editpdfplus.dropdown, {

    /**
     * Initialise the menu.
     *
     * @method initializer
     * @return void
     */
    initializer : function(config) {
        var colourlist = Y.Node.create('<ul role="menu" class="assignfeedback_editpdfplus_menu"/>'),
            body;

        // Build a list of coloured buttons.
        Y.each(this.get('colours'), function(rgb, colour) {
            var button, listitem, title, img, iconname;

            title = M.util.get_string(colour, 'assignfeedback_editpdfplus');
            iconname = this.get('iconprefix') + colour;
            img = M.util.image_url(iconname, 'assignfeedback_editpdfplus');
            button = Y.Node.create('<button><img alt="' + title + '" src="' + img + '"/></button>');
            button.setAttribute('data-colour', colour);
            button.setAttribute('data-rgb', rgb);
            button.setStyle('backgroundImage', 'none');
            listitem = Y.Node.create('<li/>');
            listitem.append(button);
            colourlist.append(listitem);
        }, this);

        body = Y.Node.create('<div/>');

        // Set the call back.
        colourlist.delegate('click', this.callback_handler, 'button', this);
        colourlist.delegate('key', this.callback_handler, 'down:13', 'button', this);

        // Set the accessible header text.
        this.set('headerText', M.util.get_string('colourpicker', 'assignfeedback_editpdfplus'));

        // Set the body content.
        body.append(colourlist);
        this.set('bodyContent', body);

        COLOURPICKER.superclass.initializer.call(this, config);
    },
    callback_handler : function(e) {
        e.preventDefault();

        var callback = this.get('callback'),
            callbackcontext = this.get('context'),
            bind;

        this.hide();

        // Call the callback with the specified context.
        bind = Y.bind(callback, callbackcontext, e);

        bind();
    }
}, {
    NAME : COLOURPICKER_NAME,
    ATTRS : {
        /**
         * The list of colours this colour picker supports.
         *
         * @attribute colours
         * @type {String: String} (The keys of the array are the colour names and the values are localized strings)
         * @default {}
         */
        colours : {
            value : {}
        },

        /**
         * The function called when a new colour is chosen.
         *
         * @attribute callback
         * @type function
         * @default null
         */
        callback : {
            value : null
        },

        /**
         * The context passed to the callback when a colour is chosen.
         *
         * @attribute context
         * @type Y.Node
         * @default null
         */
        context : {
            value : null
        },

        /**
         * The prefix for the icon image names.
         *
         * @attribute iconprefix
         * @type String
         * @default 'colour_'
         */
        iconprefix : {
            value : 'colour_'
        }
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.colourpicker = COLOURPICKER;
var STAMPPICKER_NAME = "Colourpicker",
    STAMPPICKER;

/**
 * Provides an in browser PDF editor.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */

/**
 * This is a drop down list of stamps.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class stamppicker
 * @constructor
 * @extends M.assignfeedback_editpdfplus.dropdown
 */
STAMPPICKER = function(config) {
    STAMPPICKER.superclass.constructor.apply(this, [config]);
};

Y.extend(STAMPPICKER, M.assignfeedback_editpdfplus.dropdown, {

    /**
     * Initialise the menu.
     *
     * @method initializer
     * @return void
     */
    initializer : function(config) {
        var stamplist = Y.Node.create('<ul role="menu" class="assignfeedback_editpdfplus_menu"/>');

        // Build a list of stamped buttons.
        Y.each(this.get('stamps'), function(stamp) {
            var button, listitem, title;

            title = M.util.get_string('stamp', 'assignfeedback_editpdfplus');
            button = Y.Node.create('<button><img height="16" width="16" alt="' + title + '" src="' + stamp + '"/></button>');
            button.setAttribute('data-stamp', stamp);
            button.setStyle('backgroundImage', 'none');
            listitem = Y.Node.create('<li/>');
            listitem.append(button);
            stamplist.append(listitem);
        }, this);


        // Set the call back.
        stamplist.delegate('click', this.callback_handler, 'button', this);
        stamplist.delegate('key', this.callback_handler, 'down:13', 'button', this);

        // Set the accessible header text.
        this.set('headerText', M.util.get_string('stamppicker', 'assignfeedback_editpdfplus'));

        // Set the body content.
        this.set('bodyContent', stamplist);

        STAMPPICKER.superclass.initializer.call(this, config);
    },
    callback_handler : function(e) {
        e.preventDefault();
        var callback = this.get('callback'),
            callbackcontext = this.get('context'),
            bind;

        this.hide();

        // Call the callback with the specified context.
        bind = Y.bind(callback, callbackcontext, e);

        bind();
    }
}, {
    NAME : STAMPPICKER_NAME,
    ATTRS : {
        /**
         * The list of stamps this stamp picker supports.
         *
         * @attribute stamps
         * @type String[] - the stamp filenames.
         * @default {}
         */
        stamps : {
            value : []
        },

        /**
         * The function called when a new stamp is chosen.
         *
         * @attribute callback
         * @type function
         * @default null
         */
        callback : {
            value : null
        },

        /**
         * The context passed to the callback when a stamp is chosen.
         *
         * @attribute context
         * @type Y.Node
         * @default null
         */
        context : {
            value : null
        }
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.stamppicker = STAMPPICKER;
var COMMENTMENUNAME = "Commentmenu",
    COMMENTMENU;

/**
 * Provides an in browser PDF editor.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */

/**
 * COMMENTMENU
 * This is a drop down list of comment context functions.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class commentmenu
 * @constructor
 * @extends M.assignfeedback_editpdfplus.dropdown
 */
COMMENTMENU = function(config) {
    COMMENTMENU.superclass.constructor.apply(this, [config]);
};

Y.extend(COMMENTMENU, M.assignfeedback_editpdfplus.dropdown, {

    /**
     * Initialise the menu.
     *
     * @method initializer
     * @return void
     */
    initializer : function(config) {
        var commentlinks,
            link,
            body,
            comment;

        comment = this.get('comment');
        // Build the list of menu items.
        commentlinks = Y.Node.create('<ul role="menu" class="assignfeedback_editpdfplus_menu"/>');

        link = Y.Node.create('<li><a tabindex="-1" href="#">' +
               M.util.get_string('addtoquicklist', 'assignfeedback_editpdfplus') +
               '</a></li>');
        link.on('click', comment.add_to_quicklist, comment);
        link.on('key', comment.add_to_quicklist, 'enter,space', comment);

        commentlinks.append(link);

        link = Y.Node.create('<li><a tabindex="-1" href="#">' +
               M.util.get_string('deletecomment', 'assignfeedback_editpdfplus') +
               '</a></li>');
        link.on('click', function(e) { e.preventDefault(); this.menu.hide(); this.remove(); }, comment);
        link.on('key', function() { comment.menu.hide(); comment.remove(); }, 'enter,space', comment);

        commentlinks.append(link);

        link = Y.Node.create('<li><hr/></li>');
        commentlinks.append(link);

        // Set the accessible header text.
        this.set('headerText', M.util.get_string('commentcontextmenu', 'assignfeedback_editpdfplus'));

        body = Y.Node.create('<div/>');

        // Set the body content.
        body.append(commentlinks);
        this.set('bodyContent', body);

        COMMENTMENU.superclass.initializer.call(this, config);
    },

    /**
     * Show the menu.
     *
     * @method show
     * @return void
     */
    show : function() {
        var commentlinks = this.get('boundingBox').one('ul');
            commentlinks.all('.quicklist_comment').remove(true);
        var comment = this.get('comment');

        comment.deleteme = false; // Cancel the deleting of blank comments.

        // Now build the list of quicklist comments.
        Y.each(comment.editor.quicklist.comments, function(quickcomment) {
            var listitem = Y.Node.create('<li class="quicklist_comment"></li>'),
                linkitem = Y.Node.create('<a href="#" tabindex="-1">' + quickcomment.rawtext + '</a>'),
                deletelinkitem = Y.Node.create('<a href="#" tabindex="-1" class="delete_quicklist_comment">' +
                                               '<img src="' + M.util.image_url('t/delete', 'core') + '" ' +
                                               'alt="' + M.util.get_string('deletecomment', 'assignfeedback_editpdfplus') + '"/>' +
                                               '</a>');
            listitem.append(linkitem);
            listitem.append(deletelinkitem);

            commentlinks.append(listitem);

            linkitem.on('click', comment.set_from_quick_comment, comment, quickcomment);
            linkitem.on('key', comment.set_from_quick_comment, 'space,enter', comment, quickcomment);

            deletelinkitem.on('click', comment.remove_from_quicklist, comment, quickcomment);
            deletelinkitem.on('key', comment.remove_from_quicklist, 'space,enter', comment, quickcomment);
        }, this);

        COMMENTMENU.superclass.show.call(this);
    }
}, {
    NAME : COMMENTMENUNAME,
    ATTRS : {
        /**
         * The comment this menu is attached to.
         *
         * @attribute comment
         * @type M.assignfeedback_editpdfplus.comment
         * @default null
         */
        comment : {
            value : null
        }

    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.commentmenu = COMMENTMENU;
var COMMENTSEARCHNAME = "commentsearch",
    COMMENTSEARCH;

/**
 * Provides an in browser PDF editor.
 *
 * @module moodle-assignfeedback_editpdfplus-editor
 */

/**
 * This is a searchable dialogue of comments.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class commentsearch
 * @constructor
 * @extends M.core.dialogue
 */
COMMENTSEARCH = function(config) {
    config.draggable = false;
    config.centered = true;
    config.width = '400px';
    config.visible = false;
    config.headerContent = M.util.get_string('searchcomments', 'assignfeedback_editpdfplus');
    config.footerContent = '';
    COMMENTSEARCH.superclass.constructor.apply(this, [config]);
};

Y.extend(COMMENTSEARCH, M.core.dialogue, {
    /**
     * Initialise the menu.
     *
     * @method initializer
     * @return void
     */
    initializer : function(config) {
        var editor,
            container,
            placeholder,
            commentfilter,
            commentlist,
            bb;

        bb = this.get('boundingBox');
        bb.addClass('assignfeedback_editpdfplus_commentsearch');

        editor = this.get('editor');
        container = Y.Node.create('<div/>');

        placeholder = M.util.get_string('filter', 'assignfeedback_editpdfplus');
        commentfilter = Y.Node.create('<input type="text" size="20" placeholder="' + placeholder + '"/>');
        container.append(commentfilter);
        commentlist = Y.Node.create('<ul role="menu" class="assignfeedback_editpdfplus_menu"/>');
        container.append(commentlist);

        commentfilter.on('keyup', this.filter_search_comments, this);
        commentlist.delegate('click', this.focus_on_comment, 'a', this);
        commentlist.delegate('key', this.focus_on_comment, 'enter,space', 'a', this);

        // Set the body content.
        this.set('bodyContent', container);

        COMMENTSEARCH.superclass.initializer.call(this, config);
    },

    /**
     * Event handler to filter the list of comments.
     *
     * @protected
     * @method filter_search_comments
     */
    filter_search_comments : function() {
        var filternode,
            commentslist,
            filtertext,
            dialogueid;

        dialogueid = this.get('id');
        filternode = Y.one('#' + dialogueid + SELECTOR.SEARCHFILTER);
        commentslist = Y.one('#' + dialogueid + SELECTOR.SEARCHCOMMENTSLIST);

        filtertext = filternode.get('value');

        commentslist.all('li').each(function (node) {
            if (node.get('text').indexOf(filtertext) !== -1) {
                node.show();
            } else {
                node.hide();
            }
        });
    },

    /**
     * Event handler to focus on a selected comment.
     *
     * @param Event e
     * @protected
     * @method focus_on_comment
     */
    focus_on_comment : function(e) {
        e.preventDefault();
        var target = e.target.ancestor('li'),
            comment = target.getData('comment'),
            editor = this.get('editor');

        this.hide();

        if (comment.pageno === editor.currentpage) {
            comment.drawable.nodes[0].one('textarea').focus();
        } else {
            // Comment is on a different page.
            editor.currentpage = comment.pageno;
            editor.change_page();
            comment.drawable.nodes[0].one('textarea').focus();
        }
    },

    /**
     * Show the menu.
     *
     * @method show
     * @return void
     */
    show : function() {
        var commentlist = this.get('boundingBox').one('ul'),
            editor = this.get('editor');

        commentlist.all('li').remove(true);

        // Rebuild the latest list of comments.
        Y.each(editor.pages, function(page) {
            Y.each(page.comments, function(comment) {
                var commentnode = Y.Node.create('<li><a href="#" tabindex="-1"><pre>' + comment.rawtext + '</pre></a></li>');
                commentlist.append(commentnode);
                commentnode.setData('comment', comment);
            }, this);
        }, this);

        this.centerDialogue();
        COMMENTSEARCH.superclass.show.call(this);
    }
}, {
    NAME : COMMENTSEARCHNAME,
    ATTRS : {
        /**
         * The editor this search window is attached to.
         *
         * @attribute editor
         * @type M.assignfeedback_editpdfplus.editor
         * @default null
         */
        editor : {
            value : null
        }

    }
});

Y.Base.modifyAttrs(COMMENTSEARCH, {
    /**
     * Whether the widget should be modal or not.
     *
     * Moodle override: We override this for commentsearch to force it always true.
     *
     * @attribute Modal
     * @type Boolean
     * @default true
     */
    modal: {
        getter: function() {
            return true;
        }
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.commentsearch = COMMENTSEARCH;
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
 * Class representing a list of comments.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class comment
 * @param M.assignfeedback_editpdfplus.editor editor
 * @param Int gradeid
 * @param Int pageno
 * @param Int x
 * @param Int y
 * @param Int width
 * @param String colour
 * @param String rawtext
 */
var COMMENT = function(editor, gradeid, pageno, x, y, width, colour, rawtext) {

    /**
     * Reference to M.assignfeedback_editpdfplus.editor.
     * @property editor
     * @type M.assignfeedback_editpdfplus.editor
     * @public
     */
    this.editor = editor;

    /**
     * Grade id
     * @property gradeid
     * @type Int
     * @public
     */
    this.gradeid = gradeid || 0;

    /**
     * X position
     * @property x
     * @type Int
     * @public
     */
    this.x = parseInt(x, 10) || 0;

    /**
     * Y position
     * @property y
     * @type Int
     * @public
     */
    this.y = parseInt(y, 10) || 0;

    /**
     * Comment width
     * @property width
     * @type Int
     * @public
     */
    this.width = parseInt(width, 10) || 0;

    /**
     * Comment rawtext
     * @property rawtext
     * @type String
     * @public
     */
    this.rawtext = rawtext || '';

    /**
     * Comment page number
     * @property pageno
     * @type Int
     * @public
     */
    this.pageno = pageno || 0;

    /**
     * Comment background colour.
     * @property colour
     * @type String
     * @public
     */
    this.colour = colour || 'yellow';

    /**
     * Reference to M.assignfeedback_editpdfplus.drawable
     * @property drawable
     * @type M.assignfeedback_editpdfplus.drawable
     * @public
     */
    this.drawable = false;

    /**
     * Boolean used by a timeout to delete empty comments after a short delay.
     * @property deleteme
     * @type Boolean
     * @public
     */
    this.deleteme = false;

    /**
     * Reference to the link that opens the menu.
     * @property menulink
     * @type Y.Node
     * @public
     */
    this.menulink = null;

    /**
     * Reference to the dialogue that is the context menu.
     * @property menu
     * @type M.assignfeedback_editpdfplus.dropdown
     * @public
     */
    this.menu = null;

    /**
     * Clean a comment record, returning an oject with only fields that are valid.
     * @public
     * @method clean
     * @return {}
     */
    this.clean = function() {
        return {
            gradeid : this.gradeid,
            x : parseInt(this.x, 10),
            y : parseInt(this.y, 10),
            width : parseInt(this.width, 10),
            rawtext : this.rawtext,
            pageno : this.currentpage,
            colour : this.colour
        };
    };

    /**
     * Draw a comment.
     * @public
     * @method draw_comment
     * @param boolean focus - Set the keyboard focus to the new comment if true
     * @return M.assignfeedback_editpdfplus.drawable
     */
    this.draw = function(focus) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            node,
            drawingcanvas = this.editor.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
            container,
            menu,
            position,
            scrollheight;

        // Lets add a contenteditable div.
        node = Y.Node.create('<textarea/>');
        container = Y.Node.create('<div class="commentdrawable"/>');
        menu = Y.Node.create('<a href="#"><img src="' + M.util.image_url('t/contextmenu', 'core') + '"/></a>');

        this.menulink = menu;
        container.append(node);

        if (!this.editor.get('readonly')) {
            container.append(menu);
        } else {
            node.setAttribute('readonly', 'readonly');
        }
        if (this.width < 100) {
            this.width = 100;
        }

        position = this.editor.get_window_coordinates(new M.assignfeedback_editpdfplus.point(this.x, this.y));
        node.setStyles({
            width: this.width + 'px',
            backgroundColor: COMMENTCOLOUR[this.colour],
            color: COMMENTTEXTCOLOUR
        });

        drawingcanvas.append(container);
        container.setStyle('position', 'absolute');
        container.setX(position.x);
        container.setY(position.y);
        drawable.store_position(container, position.x, position.y);
        drawable.nodes.push(container);
        node.set('value', this.rawtext);
        scrollheight = node.get('scrollHeight');
        node.setStyles({
            'height' : scrollheight + 'px',
            'overflow': 'hidden'
        });
        if (!this.editor.get('readonly')) {
            this.attach_events(node, menu);
        }
        if (focus) {
            node.focus();
        }
        this.drawable = drawable;


        return drawable;
    };

    /**
     * Delete an empty comment if it's menu hasn't been opened in time.
     * @method delete_comment_later
     */
    this.delete_comment_later = function() {
        if (this.deleteme) {
            this.remove();
        }
    };

    /**
     * Comment nodes have a bunch of event handlers attached to them directly.
     * This is all done here for neatness.
     *
     * @protected
     * @method attach_comment_events
     * @param node - The Y.Node representing the comment.
     * @param menu - The Y.Node representing the menu.
     */
    this.attach_events = function(node, menu) {
        // Save the text on blur.
        node.on('blur', function() {
            // Save the changes back to the comment.
            this.rawtext = node.get('value');
            this.width = parseInt(node.getStyle('width'), 10);

            // Trim.
            if (this.rawtext.replace(/^\s+|\s+$/g, "") === '') {
                // Delete empty comments.
                this.deleteme = true;
                Y.later(400, this, this.delete_comment_later);
            }
            this.editor.save_current_page();
            this.editor.editingcomment = false;
        }, this);

        // For delegated event handler.
        menu.setData('comment', this);

        node.on('keyup', function() {
            var scrollheight = node.get('scrollHeight'),
                height = parseInt(node.getStyle('height'), 10);

            // Webkit scrollheight fix.
            if (scrollheight === height + 8) {
                scrollheight -= 8;
            }
            node.setStyle('height', scrollheight + 'px');

        });

        node.on('gesturemovestart', function(e) {
            node.setData('dragging', true);
            node.setData('offsetx', e.clientX - node.getX());
            node.setData('offsety', e.clientY - node.getY());
        });
        node.on('gesturemoveend', function() {
            node.setData('dragging', false);
            this.editor.save_current_page();
        }, null, this);
        node.on('gesturemove', function(e) {
            var x = e.clientX - node.getData('offsetx'),
                y = e.clientY - node.getData('offsety'),
                nodewidth,
                nodeheight,
                newlocation,
                windowlocation,
                bounds;

            nodewidth = parseInt(node.getStyle('width'), 10);
            nodeheight = parseInt(node.getStyle('height'), 10);

            newlocation = this.editor.get_canvas_coordinates(new M.assignfeedback_editpdfplus.point(x, y));
            bounds = this.editor.get_canvas_bounds(true);
            bounds.x = 0;
            bounds.y = 0;

            bounds.width -= nodewidth + 42;
            bounds.height -= nodeheight + 8;
            // Clip to the window size - the comment size.
            newlocation.clip(bounds);

            this.x = newlocation.x;
            this.y = newlocation.y;

            windowlocation = this.editor.get_window_coordinates(newlocation);
            node.ancestor().setX(windowlocation.x);
            node.ancestor().setY(windowlocation.y);
            this.drawable.store_position(node.ancestor(), windowlocation.x, windowlocation.y);
        }, null, this);

        this.menu = new M.assignfeedback_editpdfplus.commentmenu({
            buttonNode: this.menulink,
            comment: this
        });
    };

    /**
     * Delete a comment.
     * @method remove
     */
    this.remove = function() {
        var i = 0, comments;

        comments = this.editor.pages[this.editor.currentpage].comments;
        for (i = 0; i < comments.length; i++) {
            if (comments[i] === this) {
                comments.splice(i, 1);
                this.drawable.erase();
                this.editor.save_current_page();
                return;
            }
        }
    };

    /**
     * Event handler to remove a comment from the users quicklist.
     *
     * @protected
     * @method remove_from_quicklist
     */
    this.remove_from_quicklist = function(e, quickcomment) {
        e.preventDefault();

        this.menu.hide();

        this.editor.quicklist.remove(quickcomment);
    };

    /**
     * A quick comment was selected in the list, update the active comment and redraw the page.
     *
     * @param Event e
     * @protected
     * @method set_from_quick_comment
     */
    this.set_from_quick_comment = function(e, quickcomment) {
        e.preventDefault();

        this.menu.hide();

        this.rawtext = quickcomment.rawtext;
        this.width = quickcomment.width;
        this.colour = quickcomment.colour;

        this.editor.save_current_page();

        this.editor.redraw();
    };

    /**
     * Event handler to add a comment to the users quicklist.
     *
     * @protected
     * @method add_to_quicklist
     */
    this.add_to_quicklist = function(e) {
        e.preventDefault();
        this.menu.hide();
        this.editor.quicklist.add(this);
    };

    /**
     * Draw the in progress edit.
     *
     * @public
     * @method draw_current_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     */
    this.draw_current_edit = function(edit) {
        var drawable = new M.assignfeedback_editpdfplus.drawable(this.editor),
            shape,
            bounds;

        bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([edit.start, edit.end]);

        // We will draw a box with the current background colour.
        shape = this.editor.graphic.addShape({
            type: Y.Rect,
            width: bounds.width,
            height: bounds.height,
            fill: {
               color: COMMENTCOLOUR[edit.commentcolour]
            },
            x: bounds.x,
            y: bounds.y
        });

        drawable.shapes.push(shape);

        return drawable;
    };

    /**
     * Promote the current edit to a real comment.
     *
     * @public
     * @method init_from_edit
     * @param M.assignfeedback_editpdfplus.edit edit
     * @return bool true if comment bound is more than min width/height, else false.
     */
    this.init_from_edit = function(edit) {
        var bounds = new M.assignfeedback_editpdfplus.rect();
        bounds.bound([edit.start, edit.end]);

        // Minimum comment width.
        if (bounds.width < 100) {
            bounds.width = 100;
        }

        // Save the current edit to the server and the current page list.

        this.gradeid = this.editor.get('gradeid');
        this.pageno = this.editor.currentpage;
        this.x = bounds.x;
        this.y = bounds.y;
        this.width = bounds.width;
        this.colour = edit.commentcolour;
        this.rawtext = '';

        return (bounds.has_min_width() && bounds.has_min_height());
    };

};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.comment = COMMENT;
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
 * Class representing a users quick comment.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class quickcomment
 */
var QUICKCOMMENT = function(id, rawtext, width, colour) {

    /**
     * Quick comment text.
     * @property rawtext
     * @type String
     * @public
     */
    this.rawtext = rawtext || '';

    /**
     * ID of the comment
     * @property id
     * @type Int
     * @public
     */
    this.id = id || 0;

    /**
     * Width of the comment
     * @property width
     * @type Int
     * @public
     */
    this.width = width || 100;

    /**
     * Colour of the comment.
     * @property colour
     * @type String
     * @public
     */
    this.colour = colour || "yellow";
};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.quickcomment = QUICKCOMMENT;
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
 * Class representing a users list of quick comments.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class quickcommentlist
 */
var QUICKCOMMENTLIST = function(editor) {

    /**
     * Reference to M.assignfeedback_editpdfplus.editor.
     * @property editor
     * @type M.assignfeedback_editpdfplus.editor
     * @public
     */
    this.editor = editor;

    /**
     * Array of Comments
     * @property shapes
     * @type M.assignfeedback_editpdfplus.quickcomment[]
     * @public
     */
    this.comments = [];

    /**
     * Add a comment to the users quicklist.
     *
     * @protected
     * @method add
     */
    this.add = function(comment) {
        var ajaxurl = AJAXBASE,
            config;

        // Do not save empty comments.
        if (comment.rawtext === '') {
            return;
        }

        config = {
            method: 'post',
            context: this,
            sync: false,
            data : {
                'sesskey' : M.cfg.sesskey,
                'action' : 'addtoquicklist',
                'userid' : this.editor.get('userid'),
                'commenttext' : comment.rawtext,
                'width' : comment.width,
                'colour' : comment.colour,
                'attemptnumber' : this.editor.get('attemptnumber'),
                'assignmentid' : this.editor.get('assignmentid')
            },
            on: {
                success: function(tid, response) {
                    var jsondata, quickcomment;
                    try {
                        jsondata = Y.JSON.parse(response.responseText);
                        if (jsondata.error) {
                            return new M.core.ajaxException(jsondata);
                        } else {
                            quickcomment = new M.assignfeedback_editpdfplus.quickcomment(jsondata.id,
                                                                                     jsondata.rawtext,
                                                                                     jsondata.width,
                                                                                     jsondata.colour);
                            this.comments.push(quickcomment);
                        }
                    } catch (e) {
                        return new M.core.exception(e);
                    }
                },
                failure: function(tid, response) {
                    return M.core.exception(response.responseText);
                }
            }
        };

        Y.io(ajaxurl, config);
    };

    /**
     * Remove a comment from the users quicklist.
     *
     * @public
     * @method remove
     */
    this.remove = function(comment) {
        var ajaxurl = AJAXBASE,
            config;

        // Should not happen.
        if (!comment) {
            return;
        }

        config = {
            method: 'post',
            context: this,
            sync: false,
            data : {
                'sesskey' : M.cfg.sesskey,
                'action' : 'removefromquicklist',
                'userid' : this.editor.get('userid'),
                'commentid' : comment.id,
                'attemptnumber' : this.editor.get('attemptnumber'),
                'assignmentid' : this.editor.get('assignmentid')
            },
            on: {
                success: function() {
                    var i;

                    // Find and remove the comment from the quicklist.
                    i = this.comments.indexOf(comment);
                    if (i >= 0) {
                        this.comments.splice(i, 1);
                    }
                },
                failure: function(tid, response) {
                    return M.core.exception(response.responseText);
                }
            }
        };

        Y.io(ajaxurl, config);
    };

    /**
     * Load the users quick comments list.
     *
     * @protected
     * @method load_quicklist
     */
    this.load = function() {
        var ajaxurl = AJAXBASE,
            config;

        config = {
            method: 'get',
            context: this,
            sync: false,
            data : {
                'sesskey' : M.cfg.sesskey,
                'action' : 'loadquicklist',
                'userid' : this.editor.get('userid'),
                'attemptnumber' : this.editor.get('attemptnumber'),
                'assignmentid' : this.editor.get('assignmentid')
            },
            on: {
                success: function(tid, response) {
                    var jsondata;
                    try {
                        jsondata = Y.JSON.parse(response.responseText);
                        if (jsondata.error) {
                            return new M.core.ajaxException(jsondata);
                        } else {
                            Y.each(jsondata, function(comment) {
                                var quickcomment = new M.assignfeedback_editpdfplus.quickcomment(comment.id,
                                                                                             comment.rawtext,
                                                                                             comment.width,
                                                                                             comment.colour);
                                this.comments.push(quickcomment);
                            }, this);
                        }
                    } catch (e) {
                        return new M.core.exception(e);
                    }
                },
                failure: function(tid, response) {
                    return M.core.exception(response.responseText);
                }
            }
        };

        Y.io(ajaxurl, config);
    };
};

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.quickcommentlist = QUICKCOMMENTLIST;
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
 * EDITOR
 * This is an in browser PDF editor.
 *
 * @namespace M.assignfeedback_editpdfplus
 * @class editor
 * @constructor
 * @extends Y.Base
 */
var EDITOR = function () {
    EDITOR.superclass.constructor.apply(this, arguments);
};
EDITOR.prototype = {
    /**
     * The dialogue used for all action menu displays.
     *
     * @property type
     * @type M.core.dialogue
     * @protected
     */
    dialogue: null,
    /**
     * The panel used for all action menu displays.
     *
     * @property type
     * @type Y.Node
     * @protected
     */
    panel: null,
    /**
     * The number of pages in the pdf.
     *
     * @property pagecount
     * @type Number
     * @protected
     */
    pagecount: 0,
    /**
     * The active page in the editor.
     *
     * @property currentpage
     * @type Number
     * @protected
     */
    currentpage: 0,
    /**
     * A list of page objects. Each page has a list of comments and annotations.
     *
     * @property pages
     * @type array
     * @protected
     */
    pages: [],
    /**
     * The yui node for the loading icon.
     *
     * @property loadingicon
     * @type Node
     * @protected
     */
    loadingicon: null,
    /**
     * Image object of the current page image.
     *
     * @property pageimage
     * @type Image
     * @protected
     */
    pageimage: null,
    /**
     * YUI Graphic class for drawing shapes.
     *
     * @property graphic
     * @type Graphic
     * @protected
     */
    graphic: null,
    /**
     * Info about the current edit operation.
     *
     * @property currentedit
     * @type M.assignfeedback_editpdfplus.edit
     * @protected
     */
    currentedit: new M.assignfeedback_editpdfplus.edit(),
    /**
     * Current drawable.
     *
     * @property currentdrawable
     * @type M.assignfeedback_editpdfplus.drawable|false
     * @protected
     */
    currentdrawable: false,
    /**
     * Current drawables.
     *
     * @property drawables
     * @type array(M.assignfeedback_editpdfplus.drawable)
     * @protected
     */
    drawables: [],
    /**
     * Current annotations.
     *
     * @property drawables
     * @type array(M.assignfeedback_editpdfplus.drawable)
     * @protected
     */
    drawablesannotations: [],
    /**
     * Current comment when the comment menu is open.
     * @property currentcomment
     * @type M.assignfeedback_editpdfplus.comment
     * @protected
     */
    currentcomment: null,
    /**
     * Current annotation when the select tool is used.
     * @property currentannotation
     * @type M.assignfeedback_editpdfplus.annotation
     * @protected
     */
    currentannotation: null,
    /**
     * Last selected annotation tool
     * @property lastannotationtool
     * @type String
     * @protected
     */
    lastanntationtool: "pen",
    /**
     * The users comments quick list
     * @property quicklist
     * @type M.assignfeedback_editpdfplus.quickcommentlist
     * @protected
     */
    quicklist: null,
    /**
     * The search comments window.
     * @property searchcommentswindow
     * @type M.core.dialogue
     * @protected
     */
    searchcommentswindow: null,
    /**
     * The selected stamp picture.
     * @property currentstamp
     * @type String
     * @protected
     */
    currentstamp: null,
    /**
     * The stamps.
     * @property stamps
     * @type Array
     * @protected
     */
    stamps: [],
    /**
     * Prevent new comments from appearing
     * immediately after clicking off a current
     * comment
     * @property editingcomment
     * @type Boolean
     * @public
     */
    editingcomment: false,
    /**
     * Called during the initialisation process of the object.
     * @method initializer
     */
    initializer: function () {
        var link;

        link = Y.one('#' + this.get('linkid'));

        if (link) {
            link.on('click', this.link_handler, this);
            link.on('key', this.link_handler, 'down:13', this);

            // We call the amd module to see if we can take control of the review panel.
            require(['mod_assign/grading_review_panel'], function (ReviewPanelManager) {
                var panelManager = new ReviewPanelManager();

                var panel = panelManager.getReviewPanel('assignfeedback_editpdfplus');
                if (panel) {
                    panel = Y.one(panel);
                    panel.empty();
                    link.ancestor('.fitem').hide();
                    this.open_in_panel(panel);
                }
                this.currentedit.start = false;
                this.currentedit.end = false;
                if (!this.get('readonly')) {
                    this.quicklist = new M.assignfeedback_editpdfplus.quickcommentlist(this);
                }
            }.bind(this));

        }
    },
    /**
     * Called to show/hide buttons and set the current colours/stamps.
     * @method refresh_button_state
     */
    refresh_button_state: function () {
        var button, currenttoolnode, imgurl, drawingregion;

        // Initalise the colour buttons.
        /*button = this.get_dialogue_element(SELECTOR.COMMENTCOLOURBUTTON);
         
         imgurl = M.util.image_url('background_colour_' + this.currentedit.commentcolour, 'assignfeedback_editpdfplus');
         button.one('img').setAttribute('src', imgurl);
         
         if (this.currentedit.commentcolour === 'clear') {
         button.one('img').setStyle('borderStyle', 'dashed');
         } else {
         button.one('img').setStyle('borderStyle', 'solid');
         }*/

        button = this.get_dialogue_element(SELECTOR.ANNOTATIONCOLOURBUTTON);
        imgurl = M.util.image_url('colour_' + this.currentedit.annotationcolour, 'assignfeedback_editpdfplus');
        button.one('img').setAttribute('src', imgurl);

        //Y.log(this.currentedit.tool);
        if (this.currentedit.id) {
            currenttoolnode = this.get_dialogue_element('#' + this.currentedit.id);
        } else {
            currenttoolnode = this.get_dialogue_element(TOOLSELECTOR[this.currentedit.tool]);
        }
        currenttoolnode.addClass('assignfeedback_editpdfplus_selectedbutton');
        currenttoolnode.setAttribute('aria-pressed', 'true');
        drawingregion = this.get_dialogue_element(SELECTOR.DRAWINGREGION);
        drawingregion.setAttribute('data-currenttool', this.currentedit.tool);

        /* button = this.get_dialogue_element(SELECTOR.STAMPSBUTTON);
         button.one('img').setAttrs({'src': this.get_stamp_image_url(this.currentedit.stamp),
         'height': '16',
         'width': '16'});*/
    },
    /**
     * Called to get the bounds of the drawing region.
     * @method get_canvas_bounds
     */
    get_canvas_bounds: function () {
        var canvas = this.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                offsetcanvas = canvas.getXY(),
                offsetleft = offsetcanvas[0],
                offsettop = offsetcanvas[1],
                width = parseInt(canvas.getStyle('width'), 10),
                height = parseInt(canvas.getStyle('height'), 10);

        return new M.assignfeedback_editpdfplus.rect(offsetleft, offsettop, width, height);
    },
    /**
     * Called to translate from window coordinates to canvas coordinates.
     * @method get_canvas_coordinates
     * @param M.assignfeedback_editpdfplus.point point in window coordinats.
     */
    get_canvas_coordinates: function (point) {
        var bounds = this.get_canvas_bounds(),
                newpoint = new M.assignfeedback_editpdfplus.point(point.x - bounds.x, point.y - bounds.y);

        bounds.x = bounds.y = 0;

        newpoint.clip(bounds);
        return newpoint;
    },
    /**
     * Called to translate from canvas coordinates to window coordinates.
     * @method get_window_coordinates
     * @param M.assignfeedback_editpdfplus.point point in window coordinats.
     */
    get_window_coordinates: function (point) {
        var bounds = this.get_canvas_bounds(),
                newpoint = new M.assignfeedback_editpdfplus.point(point.x + bounds.x, point.y + bounds.y);

        return newpoint;
    },
    /**
     * Open the edit-pdf editor in the panel in the page instead of a popup.
     * @method open_in_panel
     */
    open_in_panel: function (panel) {
        var drawingcanvas, drawingregion;

        this.panel = panel;
        panel.append(this.get('body'));
        panel.addClass(CSS.DIALOGUE);

        this.loadingicon = this.get_dialogue_element(SELECTOR.LOADINGICON);

        drawingcanvas = this.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
        this.graphic = new Y.Graphic({render: drawingcanvas});

        drawingregion = this.get_dialogue_element(SELECTOR.DRAWINGREGION);
        drawingregion.on('scroll', this.move_canvas, this);

        if (!this.get('readonly')) {
            drawingcanvas.on('gesturemovestart', this.edit_start, null, this);
            drawingcanvas.on('gesturemove', this.edit_move, null, this);
            drawingcanvas.on('gesturemoveend', this.edit_end, null, this);

            this.refresh_button_state();
        }

        this.load_all_pages();
    },
    /**
     * Called to open the pdf editing dialogue.
     * @method link_handler
     */
    link_handler: function (e) {
        var drawingcanvas, drawingregion, resize = true;
        e.preventDefault();

        if (!this.dialogue) {
            this.dialogue = new M.core.dialogue({
                headerContent: this.get('header'),
                bodyContent: this.get('body'),
                footerContent: this.get('footer'),
                modal: true,
                width: '840px',
                visible: false,
                draggable: true
            });

            // Add custom class for styling.
            this.dialogue.get('boundingBox').addClass(CSS.DIALOGUE);

            this.loadingicon = this.get_dialogue_element(SELECTOR.LOADINGICON);

            drawingcanvas = this.get_dialogue_element(SELECTOR.DRAWINGCANVAS);
            this.graphic = new Y.Graphic({render: drawingcanvas});

            drawingregion = this.get_dialogue_element(SELECTOR.DRAWINGREGION);
            drawingregion.on('scroll', this.move_canvas, this);

            if (!this.get('readonly')) {
                drawingcanvas.on('gesturemovestart', this.edit_start, null, this);
                drawingcanvas.on('gesturemove', this.edit_move, null, this);
                drawingcanvas.on('gesturemoveend', this.edit_end, null, this);

                this.refresh_button_state();
            }

            this.load_all_pages();
            drawingcanvas.on('windowresize', this.resize, this);

            resize = false;
        }
        this.dialogue.centerDialogue();
        this.dialogue.show();

        // Redraw when the dialogue is moved, to ensure the absolute elements are all positioned correctly.
        this.dialogue.dd.on('drag:end', this.redraw, this);
        if (resize) {
            this.resize(); // When re-opening the dialog call redraw, to make sure the size + layout is correct.
        }
    },
    /**
     * Called to load the information and annotations for all pages.
     * @method load_all_pages
     */
    load_all_pages: function () {
        var ajaxurl = AJAXBASE,
                config,
                checkconversionstatus,
                ajax_error_total;

        config = {
            method: 'get',
            context: this,
            sync: false,
            data: {
                sesskey: M.cfg.sesskey,
                action: 'loadallpages',
                userid: this.get('userid'),
                attemptnumber: this.get('attemptnumber'),
                assignmentid: this.get('assignmentid'),
                readonly: this.get('readonly') ? 1 : 0
            },
            on: {
                success: function (tid, response) {
                    this.all_pages_loaded(response.responseText);
                },
                failure: function (tid, response) {
                    return new M.core.exception(response.responseText);
                }
            }
        };

        Y.io(ajaxurl, config);

        // If pages are not loaded, check PDF conversion status for the progress bar.
        if (this.pagecount <= 0) {
            checkconversionstatus = {
                method: 'get',
                context: this,
                sync: false,
                data: {
                    sesskey: M.cfg.sesskey,
                    action: 'conversionstatus',
                    userid: this.get('userid'),
                    attemptnumber: this.get('attemptnumber'),
                    assignmentid: this.get('assignmentid')
                },
                on: {
                    success: function (tid, response) {
                        ajax_error_total = 0;
                        if (this.pagecount === 0) {
                            var pagetotal = this.get('pagetotal');

                            // Update the progress bar.
                            var progressbarcontainer = this.get_dialogue_element(SELECTOR.PROGRESSBARCONTAINER);
                            var progressbar = progressbarcontainer.one('.bar');
                            if (progressbar) {
                                // Calculate progress.
                                var progress = (response.response / pagetotal) * 100;
                                progressbar.setStyle('width', progress + '%');
                                progressbarcontainer.setAttribute('aria-valuenow', progress);
                            }

                            // New ajax request delayed of a second.
                            Y.later(1000, this, function () {
                                Y.io(AJAXBASEPROGRESS, checkconversionstatus);
                            });
                        }
                    },
                    failure: function (tid, response) {
                        ajax_error_total = ajax_error_total + 1;
                        // We only continue on error if the all pages were not generated,
                        // and if the ajax call did not produce 5 errors in the row.
                        if (this.pagecount === 0 && ajax_error_total < 5) {
                            Y.later(1000, this, function () {
                                Y.io(AJAXBASEPROGRESS, checkconversionstatus);
                            });
                        }
                        return new M.core.exception(response.responseText);
                    }
                }
            };
            // We start the AJAX "generated page total number" call a second later to give a chance to
            // the AJAX "combined pdf generation" call to clean the previous submission images.
            Y.later(1000, this, function () {
                ajax_error_total = 0;
                Y.io(AJAXBASEPROGRESS, checkconversionstatus);
            });
        }
    },
    /**
     * The info about all pages in the pdf has been returned.
     * @param string The ajax response as text.
     * @protected
     * @method all_pages_loaded
     */
    all_pages_loaded: function (responsetext) {
        var data, i, j, comment, error;
        try {
            data = Y.JSON.parse(responsetext);
            if (data.error || !data.pagecount) {
                if (this.dialogue) {
                    this.dialogue.hide();
                }
                // Display alert dialogue.
                error = new M.core.alert({message: M.util.get_string('cannotopenpdf', 'assignfeedback_editpdfplus')});
                error.show();
                return;
            }
        } catch (e) {
            if (this.dialogue) {
                this.dialogue.hide();
            }
            // Display alert dialogue.
            error = new M.core.alert({title: M.util.get_string('cannotopenpdf', 'assignfeedback_editpdfplus')});
            error.show();
            return;
        }

        this.pagecount = data.pagecount;
        this.pages = data.pages;
        //this.tools = data.tools;

        this.tools = [];
        for (i = 0; i < data.tools.length; i++) {
            var tooltmp = data.tools[i];
            this.tools[tooltmp.id] = tooltmp;
        }

        this.typetools = [];
        for (i = 0; i < data.typetools.length; i++) {
            var typetooltmp = data.typetools[i];
            this.typetools[typetooltmp.id] = typetooltmp;
        }

        for (i = 0; i < this.pages.length; i++) {
            for (j = 0; j < this.pages[i].comments.length; j++) {
                comment = this.pages[i].comments[j];
                this.pages[i].comments[j] = new M.assignfeedback_editpdfplus.comment(this,
                        comment.gradeid,
                        comment.pageno,
                        comment.x,
                        comment.y,
                        comment.width,
                        comment.colour,
                        comment.rawtext);
            }
            var parentannot = [];
            for (j = 0; j < this.pages[i].annotations.length; j++) {
                data = this.pages[i].annotations[j];
                if (data.parent_annot) {
                    data.parent_annot_element = parentannot[data.parent_annot];
                }
                var newannot = this.create_annotation(this.typetools[this.tools[data.toolid].type].label, data.toolid, data, this.tools[data.toolid]);
                parentannot[data.id] = newannot;
                this.pages[i].annotations[j] = newannot;
            }
        }

        // Update the ui.
        if (this.quicklist) {
            this.quicklist.load();
        }
        this.setup_navigation();
        this.setup_toolbar();
        this.change_page();
    },
    /**
     * Get the full pluginfile url for an image file - just given the filename.
     *
     * @public
     * @method get_stamp_image_url
     * @param string filename
     */
    get_stamp_image_url: function (filename) {
        var urls = this.get('stampfiles'),
                fullurl = '';

        Y.Array.each(urls, function (url) {
            if (url.indexOf(filename) > 0) {
                fullurl = url;
            }
        }, this);

        return fullurl;
    },
    /**
     * Attach listeners and enable the color picker buttons.
     * @protected
     * @method setup_toolbar
     */
    setup_toolbar: function () {
        var toolnode,
                annotationcolourbutton,
                picker;

        if (this.get('readonly')) {
            return;
        }

        var customtoolbar = this.get_dialogue_element(SELECTOR.CUSTOMTOOLBARID + '1');
        customtoolbar.show();
        var axisselector = this.get_dialogue_element(SELECTOR.AXISCUSTOMTOOLBAR);
        axisselector.on('change', this.update_custom_toolbars, this);
        Y.all(SELECTOR.CUSTOMTOOLBARBUTTONS).each(function (toolnode) {
            var toolid = toolnode.get('id');
            var toollib = toolnode.getAttribute('data-tool');
            toolnode.on('click', this.handle_tool_button, this, toollib, toolid);
            toolnode.on('key', this.handle_tool_button, 'down:13', this, toollib, toolid);
            toolnode.setAttribute('aria-pressed', 'false');
        }, this);
        
        // Setup the tool buttons.
        Y.each(TOOLSELECTOR, function (selector, tool) {
            toolnode = this.get_dialogue_element(selector);
            toolnode.on('click', this.handle_tool_button, this, tool);
            toolnode.on('key', this.handle_tool_button, 'down:13', this, tool);
            toolnode.setAttribute('aria-pressed', 'false');
        }, this);

        annotationcolourbutton = this.get_dialogue_element(SELECTOR.ANNOTATIONCOLOURBUTTON);
        picker = new M.assignfeedback_editpdfplus.colourpicker({
            buttonNode: annotationcolourbutton,
            iconprefix: 'colour_',
            colours: ANNOTATIONCOLOUR,
            callback: function (e) {
                var colour = e.target.getAttribute('data-colour');
                if (!colour) {
                    colour = e.target.ancestor().getAttribute('data-colour');
                }
                this.currentedit.annotationcolour = colour;
                if (this.lastannotationtool) {
                    this.handle_tool_button(e, this.lastannotationtool);
                } else {
                    this.handle_tool_button(e, "pen");
                }
            },
            context: this
        });
    },
    update_custom_toolbars: function () {
        Y.all(SELECTOR.CUSTOMTOOLBARS).each(function (toolbar) {
            toolbar.hide();
        }, this);
        var axisselector = this.get_dialogue_element(SELECTOR.AXISCUSTOMTOOLBAR + ' option:checked');
        var axisid = parseInt(axisselector.get('value')) + 1;
        var customtoolbar = this.get_dialogue_element(SELECTOR.CUSTOMTOOLBARID + '' + axisid);
        customtoolbar.show();
    },
    /**
     * Change the current tool.
     * @protected
     * @method handle_tool_button
     */
    handle_tool_button: function (e, tool, toolid, has_parent) {
        Y.log('handle_tool_button : ' + tool + ' - ' + toolid);
        e.preventDefault();
        this.handle_tool_button_action(tool, toolid, has_parent);
    },
    handle_tool_button_action: function (tool, toolid, has_parent) {
        var currenttoolnode;
        // Change style of the pressed button.
        if (this.currentedit.id) {
            currenttoolnode = this.get_dialogue_element("#" + this.currentedit.id);
        } else {
            currenttoolnode = this.get_dialogue_element(TOOLSELECTOR[this.currentedit.tool]);
        }
        currenttoolnode.removeClass('assignfeedback_editpdfplus_selectedbutton');
        currenttoolnode.setAttribute('aria-pressed', 'false');
        //update le currentedit object with the new tool
        this.currentedit.tool = tool;
        this.currentedit.id = toolid;

        if (tool !== "comment" && tool !== "select" && tool !== "drag" && tool !== "stamp") {
            this.lastannotationtool = tool;
        }

        if (tool !== "select") {
            this.currentannotation = null;
            var annotations = this.pages[this.currentpage].annotations;
            Y.each(annotations, function (annotation) {
                if (annotation && annotation.drawable) {
                    // Redraw the annotation to remove the highlight.
                    annotation.drawable.erase();
                    annotation.draw();
                }
            });
        }
        if (!has_parent) {
            this.currentedit.parent_annot_element = null;
        }

        this.refresh_button_state();
    },
    /**
     * JSON encode the current page data - stripping out drawable references which cannot be encoded.
     * @protected
     * @method stringify_current_page
     * @return string
     */
    stringify_current_page: function () {
        var comments = [],
                annotations = [],
                page,
                i = 0;

        for (i = 0; i < this.pages[this.currentpage].comments.length; i++) {
            comments[i] = this.pages[this.currentpage].comments[i].clean();
        }
        for (i = 0; i < this.pages[this.currentpage].annotations.length; i++) {
            annotations[i] = this.pages[this.currentpage].annotations[i].clean();
        }

        page = {comments: comments, annotations: annotations};

        return Y.JSON.stringify(page);
    },
    /**
     * Generate a drawable from the current in progress edit.
     * @protected
     * @method get_current_drawable
     */
    get_current_drawable: function () {
        var comment,
                annotation,
                drawable = false;

        if (!this.currentedit.start || !this.currentedit.end) {
            return false;
        }

        if (this.currentedit.tool === 'comment') {
            comment = new M.assignfeedback_editpdfplus.comment(this);
            drawable = comment.draw_current_edit(this.currentedit);
        } else {
            var toolid = this.currentedit.id;
            if (this.currentedit.id && this.currentedit.id[0] === 'c') {
                toolid = this.currentedit.id.substr(8);
            }
            annotation = this.create_annotation(this.currentedit.tool, this.currentedit.id, {}, this.tools[toolid]);
            if (annotation) {
                drawable = annotation.draw_current_edit(this.currentedit);
            }
        }

        return drawable;
    },
    /**
     * Find an element within the dialogue.
     * @protected
     * @method get_dialogue_element
     */
    get_dialogue_element: function (selector) {
        if (this.panel) {
            return this.panel.one(selector);
        } else {
            return this.dialogue.get('boundingBox').one(selector);
        }
    },
    /**
     * Redraw the active edit.
     * @protected
     * @method redraw_active_edit
     */
    redraw_current_edit: function () {
        if (this.currentdrawable) {
            this.currentdrawable.erase();
        }
        this.currentdrawable = this.get_current_drawable();
    },
    /**
     * Event handler for mousedown or touchstart.
     * @protected
     * @param Event
     * @method edit_start
     */
    edit_start: function (e) {
        e.preventDefault();
        var canvas = this.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                offset = canvas.getXY(),
                scrolltop = canvas.get('docScrollY'),
                scrollleft = canvas.get('docScrollX'),
                point = {x: e.clientX - offset[0] + scrollleft,
                    y: e.clientY - offset[1] + scrolltop},
        selected = false,
                lastannotation;

        // Ignore right mouse click.
        if (e.button === 3) {
            return;
        }

        if (this.currentedit.starttime) {
            return;
        }

        if (this.editingcomment) {
            return;
        }

        this.currentedit.starttime = new Date().getTime();
        this.currentedit.start = point;
        this.currentedit.end = {x: point.x, y: point.y};

        if (this.currentedit.tool === 'select') {
            var x = this.currentedit.end.x,
                    y = this.currentedit.end.y,
                    annotations = this.pages[this.currentpage].annotations;
            // Find the first annotation whose bounds encompass the click.
            Y.each(annotations, function (annotation) {
                if (((x - annotation.x) * (x - annotation.endx)) <= 0 &&
                        ((y - annotation.y) * (y - annotation.endy)) <= 0) {
                    selected = annotation;
                }
            });

            if (selected) {
                lastannotation = this.currentannotation;
                this.currentannotation = selected;
                if (lastannotation && lastannotation !== selected) {
                    // Redraw the last selected annotation to remove the highlight.
                    if (lastannotation.drawable) {
                        lastannotation.drawable.erase();
                        this.drawables.push(lastannotation.draw());
                        this.drawablesannotations.push(lastannotation);
                    }
                }
                // Redraw the newly selected annotation to show the highlight.
                if (this.currentannotation.drawable) {
                    this.currentannotation.drawable.erase();
                }
                this.drawables.push(this.currentannotation.draw());
                this.drawablesannotations.push(this.currentannotation);
            }
        }
        if (this.currentannotation) {
            // Used to calculate drag offset.
            this.currentedit.annotationstart = {x: this.currentannotation.x,
                y: this.currentannotation.y};
        }
    },
    /**
     * Event handler for mousemove.
     * @protected
     * @param Event
     * @method edit_move
     */
    edit_move: function (e) {
        e.preventDefault();
        var bounds = this.get_canvas_bounds(),
                canvas = this.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                drawingregion = this.get_dialogue_element(SELECTOR.DRAWINGREGION),
                clientpoint = new M.assignfeedback_editpdfplus.point(e.clientX + canvas.get('docScrollX'),
                        e.clientY + canvas.get('docScrollY')),
                point = this.get_canvas_coordinates(clientpoint),
                diffX,
                diffY;

        // Ignore events out of the canvas area.
        if (point.x < 0 || point.x > bounds.width || point.y < 0 || point.y > bounds.height) {
            return;
        }

        if (this.currentedit.tool === 'pen') {
            this.currentedit.path.push(point);
        }

        if (this.currentedit.tool === 'select') {
            if (this.currentannotation && this.currentedit) {
                this.currentannotation.move(this.currentedit.annotationstart.x + point.x - this.currentedit.start.x,
                        this.currentedit.annotationstart.y + point.y - this.currentedit.start.y);
            }
        } else if (this.currentedit.tool === 'drag') {
            diffX = point.x - this.currentedit.start.x;
            diffY = point.y - this.currentedit.start.y;

            drawingregion.getDOMNode().scrollLeft -= diffX;
            drawingregion.getDOMNode().scrollTop -= diffY;

        } else {
            if (this.currentedit.start) {
                this.currentedit.end = point;
                this.redraw_current_edit();
            }
        }
    },
    /**
     * Event handler for mouseup or touchend.
     * @protected
     * @param Event
     * @method edit_end
     */
    edit_end: function () {
        var duration,
                comment,
                annotation;

        duration = new Date().getTime() - this.currentedit.start;

        if (duration < CLICKTIMEOUT || this.currentedit.start === false) {
            return;
        }

        if (this.currentedit.tool === 'comment') {
            if (this.currentdrawable) {
                this.currentdrawable.erase();
            }
            this.currentdrawable = false;
            comment = new M.assignfeedback_editpdfplus.comment(this);
            if (comment.init_from_edit(this.currentedit)) {
                this.pages[this.currentpage].comments.push(comment);
                this.drawables.push(comment.draw(true));
                this.editingcomment = true;
            }
        } else {
            var toolid = this.currentedit.id;
            if (this.currentedit.id && this.currentedit.id[0] === 'c') {
                toolid = this.currentedit.id.substr(8);
            }
            annotation = this.create_annotation(this.currentedit.tool, this.currentedit.id, {}, this.tools[toolid]);
            if (annotation) {
                if (this.currentdrawable) {
                    this.currentdrawable.erase();
                }
                this.currentdrawable = false;
                if (annotation.init_from_edit(this.currentedit)) {
                    annotation.draw_catridge(this.currentedit);
                    annotation.edit_annot();
                    this.pages[this.currentpage].annotations.push(annotation);
                    this.drawables.push(annotation.draw());
                    this.drawablesannotations.push(annotation);
                }
            }
        }

        // Save the changes.
        this.save_current_page();

        // Reset the current edit.
        this.currentedit.starttime = 0;
        this.currentedit.start = false;
        this.currentedit.end = false;
        this.currentedit.path = [];
        if (this.currentedit.tool !== 'drag') {
            this.handle_tool_button_action("select");
        }
    },
    /**
     * Resize the dialogue window when the browser is resized.
     * @public
     * @method resize
     */
    resize: function () {
        var drawingregion, drawregionheight;

        if (this.dialogue) {
            if (!this.dialogue.get('visible')) {
                return;
            }
            this.dialogue.centerDialogue();
        }

        // Make sure the dialogue box is not bigger than the max height of the viewport.
        drawregionheight = Y.one('body').get('winHeight') - 120; // Space for toolbar + titlebar.
        if (drawregionheight < 100) {
            drawregionheight = 100;
        }
        drawingregion = this.get_dialogue_element(SELECTOR.DRAWINGREGION);
        if (this.dialogue) {
            drawingregion.setStyle('maxHeight', drawregionheight + 'px');
        }
        this.redraw();
        return true;
    },
    /**
     * Factory method for creating annotations of the correct subclass.
     * @public
     * @method create_annotation
     * 
     * @param {type} type label du type de tool
     * @param {type} toolid id du tool en cours
     * @param {type} data annotation complete si elle existe
     * @param {type} toolobjet le tool
     * @returns {M.assignfeedback_editpdfplus.annotationrectangle|M.assignfeedback_editpdfplus.annotationhighlight|M.assignfeedback_editpdfplus.annotationoval|Boolean|M.assignfeedback_editpdfplus.annotationstampplus|M.assignfeedback_editpdfplus.annotationframe|M.assignfeedback_editpdfplus.annotationline|M.assignfeedback_editpdfplus.annotationstampcomment|M.assignfeedback_editpdfplus.annotationhighlightplus|M.assignfeedback_editpdfplus.annotationverticalline|M.assignfeedback_editpdfplus.annotationpen}
     */
    create_annotation: function (type, toolid, data, toolobjet) {
        Y.log('create_annotation : ' + type + ' - ' + toolid);

        /*pour fonctionnement des anciens outils*/
        if (type && typeof type !== 'undefined' && (typeof toolid === 'undefined' || toolid === null)) {
            if (type === "line") {
                data.toolid = TOOLTYPE.LINE;
            } else if (type === "rectangle") {
                data.toolid = TOOLTYPE.RECTANGLE;
            } else if (type === "oval") {
                data.toolid = TOOLTYPE.OVAL;
            } else if (type === "pen") {
                data.toolid = TOOLTYPE.PEN;
            } else if (type === "highlight") {
                data.toolid = TOOLTYPE.HIGHLIGHT;
            }
            data.tooltype = this.tools[data.toolid];
        } else if (toolid !== null && toolid[0] === 'c') {
            data.toolid = toolid.substr(8);
        }
        if (!data.tooltype || data.tooltype === '') {
            data.tooltype = toolobjet;
        }

        data.tool = type;
        data.editor = this;
        Y.log('create_annotation post analyse : ' + data.tool + ' - ' + data.toolid + ' - ' + data.parent_annot);
        if (data.tool === TOOLTYPE.LINE + '' || data.tool === TOOLTYPELIB.LINE) {
            return new M.assignfeedback_editpdfplus.annotationline(data);
        } else if (data.tool === TOOLTYPE.RECTANGLE + '' || data.tool === TOOLTYPELIB.RECTANGLE) {
            return new M.assignfeedback_editpdfplus.annotationrectangle(data);
        } else if (data.tool === TOOLTYPE.OVAL + '' || data.tool === TOOLTYPELIB.OVAL) {
            return new M.assignfeedback_editpdfplus.annotationoval(data);
        } else if (data.tool === TOOLTYPE.PEN + '' || data.tool === TOOLTYPELIB.PEN) {
            return new M.assignfeedback_editpdfplus.annotationpen(data);
        } else if (data.tool === TOOLTYPE.HIGHLIGHT + '' || data.tool === TOOLTYPELIB.HIGHLIGHT) {
            return new M.assignfeedback_editpdfplus.annotationhighlight(data);
        } else {
            if (data.tool === TOOLTYPE.FRAME + '' || data.tool === TOOLTYPELIB.FRAME) {
                if (toolobjet) {
                    if (data.colour === "") {
                        data.colour = this.typetools[toolobjet.type].color;
                    }
                }
                if (!data.parent_annot && !data.parent_annot_element) {
                    if (this.currentedit.parent_annot_element) {
                        data.parent_annot_element = this.currentedit.parent_annot_element;
                        //this.currentedit.parent_annot_element = null;
                    } else {
                        data.parent_annot_element = null;
                        data.parent_annot = 0;
                    }
                }
                return new M.assignfeedback_editpdfplus.annotationframe(data);
            } else {
                if (toolobjet) {
                    if (toolobjet.colors && toolobjet.colors.indexOf(',') !== -1) {
                        data.colour = toolobjet.colors.substr(0, toolobjet.colors.indexOf(','));
                    } else {
                        data.colour = toolobjet.colors;
                    }
                    if (data.colour === "") {
                        data.colour = this.typetools[toolobjet.type].color;
                    }
                }
                if (data.tool === TOOLTYPE.HIGHLIGHTPLUS + '' || data.tool === TOOLTYPELIB.HIGHLIGHTPLUS) {
                    return new M.assignfeedback_editpdfplus.annotationhighlightplus(data);
                } else if (data.tool === TOOLTYPE.STAMPPLUS + '' || data.tool === TOOLTYPELIB.STAMPPLUS) {
                    return new M.assignfeedback_editpdfplus.annotationstampplus(data);
                } else if (data.tool === TOOLTYPE.VERTICALLINE + '' || data.tool === TOOLTYPELIB.VERTICALLINE) {
                    return new M.assignfeedback_editpdfplus.annotationverticalline(data);
                } else if (data.tool === TOOLTYPE.STAMPCOMMENT + '' || data.tool === TOOLTYPELIB.STAMPCOMMENT) {
                    return new M.assignfeedback_editpdfplus.annotationstampcomment(data);
                } else if (data.tool === TOOLTYPE.COMMENTPLUS + '' || data.tool === TOOLTYPELIB.COMMENTPLUS) {
                    return new M.assignfeedback_editpdfplus.annotationcommentplus(data);
                }
            }
        }
        return false;
    },
    /**
     * Save all the annotations and comments for the current page.
     * @protected
     * @method save_current_page
     */
    save_current_page: function () {
        var ajaxurl = AJAXBASE,
                config;

        config = {
            method: 'post',
            context: this,
            sync: false,
            data: {
                'sesskey': M.cfg.sesskey,
                'action': 'savepage',
                'index': this.currentpage,
                'userid': this.get('userid'),
                'attemptnumber': this.get('attemptnumber'),
                'assignmentid': this.get('assignmentid'),
                'page': this.stringify_current_page()
            },
            on: {
                success: function (tid, response) {
                    var jsondata;
                    try {
                        jsondata = Y.JSON.parse(response.responseText);
                        if (jsondata.error) {
                            return new M.core.ajaxException(jsondata);
                        }
                        Y.one(SELECTOR.UNSAVEDCHANGESINPUT).set('value', 'true');
                        Y.one(SELECTOR.UNSAVEDCHANGESDIV).setStyle('opacity', 1);
                        Y.one(SELECTOR.UNSAVEDCHANGESDIV).setStyle('display', 'inline-block');
                        Y.one(SELECTOR.UNSAVEDCHANGESDIV).transition({
                            duration: 1,
                            delay: 2,
                            opacity: 0
                        }, function () {
                            Y.one(SELECTOR.UNSAVEDCHANGESDIV).setStyle('display', 'none');
                        });
                    } catch (e) {
                        return new M.core.exception(e);
                    }
                },
                failure: function (tid, response) {
                    return new M.core.exception(response.responseText);
                }
            }
        };

        Y.io(ajaxurl, config);

    },
    /**
     * Event handler to open the comment search interface.
     *
     * @param Event e
     * @protected
     * @method open_search_comments
     */
    open_search_comments: function (e) {
        if (!this.searchcommentswindow) {
            this.searchcommentswindow = new M.assignfeedback_editpdfplus.commentsearch({
                editor: this
            });
        }

        this.searchcommentswindow.show();
        e.preventDefault();
    },
    /**
     * Redraw all the comments and annotations.
     * @protected
     * @method redraw
     */
    redraw: function () {
        var i,
                page;

        page = this.pages[this.currentpage];
        if (page === undefined) {
            return; // Can happen if a redraw is triggered by an event, before the page has been selected.
        }
        while (this.drawables.length > 0) {
            this.drawables.pop().erase();
        }
        while (this.drawablesannotations.length > 0) {
            var annot = this.drawablesannotations.pop();
            if (annot.divcartridge) {
                var divannot = Y.one('#' + annot.divcartridge);
                if (divannot) {
                    divannot.remove();
                }
                annot.divcartridge = "";
            }
        }

        for (i = 0; i < page.annotations.length; i++) {
            this.drawables.push(page.annotations[i].draw());
            this.drawablesannotations.push(page.annotations[i]);
        }
        for (i = 0; i < page.comments.length; i++) {
            this.drawables.push(page.comments[i].draw(false));
        }
    },
    /**
     * Load the image for this pdf page and remove the loading icon (if there).
     * @protected
     * @method change_page
     */
    change_page: function () {
        var drawingcanvas = this.get_dialogue_element(SELECTOR.DRAWINGCANVAS),
                page,
                previousbutton,
                nextbutton;

        previousbutton = this.get_dialogue_element(SELECTOR.PREVIOUSBUTTON);
        nextbutton = this.get_dialogue_element(SELECTOR.NEXTBUTTON);

        if (this.currentpage > 0) {
            previousbutton.removeAttribute('disabled');
        } else {
            previousbutton.setAttribute('disabled', 'true');
        }
        if (this.currentpage < (this.pagecount - 1)) {
            nextbutton.removeAttribute('disabled');
        } else {
            nextbutton.setAttribute('disabled', 'true');
        }

        page = this.pages[this.currentpage];
        this.loadingicon.hide();
        drawingcanvas.setStyle('backgroundImage', 'url("' + page.url + '")');
        drawingcanvas.setStyle('width', page.width + 'px');
        drawingcanvas.setStyle('height', page.height + 'px');

        // Update page select.
        this.get_dialogue_element(SELECTOR.PAGESELECT).set('selectedIndex', this.currentpage);

        this.resize(); // Internally will call 'redraw', after checking the dialogue size.
    },
    /**
     * Now we know how many pages there are,
     * we can enable the navigation controls.
     * @protected
     * @method setup_navigation
     */
    setup_navigation: function () {
        var pageselect,
                i,
                strinfo,
                option,
                previousbutton,
                nextbutton;

        pageselect = this.get_dialogue_element(SELECTOR.PAGESELECT);

        var options = pageselect.all('option');
        if (options.size() <= 1) {
            for (i = 0; i < this.pages.length; i++) {
                option = Y.Node.create('<option/>');
                option.setAttribute('value', i);
                strinfo = {page: i + 1, total: this.pages.length};
                option.setHTML(M.util.get_string('pagexofy', 'assignfeedback_editpdfplus', strinfo));
                pageselect.append(option);
            }
        }
        pageselect.removeAttribute('disabled');
        pageselect.on('change', function () {
            this.currentpage = pageselect.get('value');
            this.change_page();
        }, this);

        previousbutton = this.get_dialogue_element(SELECTOR.PREVIOUSBUTTON);
        nextbutton = this.get_dialogue_element(SELECTOR.NEXTBUTTON);

        previousbutton.on('click', this.previous_page, this);
        previousbutton.on('key', this.previous_page, 'down:13', this);
        nextbutton.on('click', this.next_page, this);
        nextbutton.on('key', this.next_page, 'down:13', this);
    },
    /**
     * Navigate to the previous page.
     * @protected
     * @method previous_page
     */
    previous_page: function (e) {
        e.preventDefault();
        this.currentpage--;
        if (this.currentpage < 0) {
            this.currentpage = 0;
        }
        this.change_page();
    },
    /**
     * Navigate to the next page.
     * @protected
     * @method next_page
     */
    next_page: function (e) {
        e.preventDefault();
        this.currentpage++;
        if (this.currentpage >= this.pages.length) {
            this.currentpage = this.pages.length - 1;
        }
        this.change_page();
    },
    /**
     * Update any absolutely positioned nodes, within each drawable, when the drawing canvas is scrolled
     * @protected
     * @method move_canvas
     */
    move_canvas: function () {
        var drawingregion, x, y, i;

        drawingregion = this.get_dialogue_element(SELECTOR.DRAWINGREGION);
        x = parseInt(drawingregion.get('scrollLeft'), 10);
        y = parseInt(drawingregion.get('scrollTop'), 10);

        for (i = 0; i < this.drawables.length; i++) {
            this.drawables[i].scroll_update(x, y);
        }
    }

};

Y.extend(EDITOR, Y.Base, EDITOR.prototype, {
    NAME: 'moodle-assignfeedback_editpdfplus-editor',
    ATTRS: {
        userid: {
            validator: Y.Lang.isInteger,
            value: 0
        },
        assignmentid: {
            validator: Y.Lang.isInteger,
            value: 0
        },
        attemptnumber: {
            validator: Y.Lang.isInteger,
            value: 0
        },
        header: {
            validator: Y.Lang.isString,
            value: ''
        },
        body: {
            validator: Y.Lang.isString,
            value: ''
        },
        footer: {
            validator: Y.Lang.isString,
            value: ''
        },
        linkid: {
            validator: Y.Lang.isString,
            value: ''
        },
        deletelinkid: {
            validator: Y.Lang.isString,
            value: ''
        },
        readonly: {
            validator: Y.Lang.isBoolean,
            value: true
        },
        stampfiles: {
            validator: Y.Lang.isArray,
            value: ''
        },
        pagetotal: {
            validator: Y.Lang.isInteger,
            value: 0
        }
    }
});

M.assignfeedback_editpdfplus = M.assignfeedback_editpdfplus || {};
M.assignfeedback_editpdfplus.editor = M.assignfeedback_editpdfplus.editor || {};

/**
 * Init function - will create a new instance every time.
 * @method editor.init
 * @static
 * @param {Object} params
 */
M.assignfeedback_editpdfplus.editor.init = M.assignfeedback_editpdfplus.editor.init || function (params) {
    M.assignfeedback_editpdfplus.instance = new EDITOR(params);
    return M.assignfeedback_editpdfplus.instance;
};


}, '@VERSION@', {
    "requires": [
        "base",
        "event",
        "node",
        "io",
        "graphics",
        "json",
        "event-move",
        "event-resize",
        "transition",
        "querystring-stringify-simple",
        "moodle-core-notification-dialog",
        "moodle-core-notification-exception",
        "moodle-core-notification-ajaxexception"
    ]
});
