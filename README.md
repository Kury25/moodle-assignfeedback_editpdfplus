# Annotate PDF advanced, fork of Moodle's standard 'Annotate PDF' plugin for assignment feedback

This plugin is a fork of assignfeedback_editpdf, and is developed and maintained by RISET/University of Lausanne.

Author: Marion Chardon, <marion.chardon@unil.ch>

Compatible with Moodle versions: 3.3

## Description

This tool is a Moodle plugin wich allows:

 - to use different correction axes (i.e. groups of tools)
 - to use several types of customizable tools: simple annotation, comment, stamp, highlighting, margin annotation, chained annotations
 - to have different tool palettes depending on the Moodle context (course, course category, site default)
 - to create question / answer interactions with the student
 - the student to consult and manage annotations
 - to generate a PDF including annotations and questions / answers

At the moment, sample tools are installed with the plugin and tools can be added/modified directly as database records only. Current development will provide an UI for teachers to build their annotation palettes.

See this <a href="https://gitlabriset.unil.ch/Marion.Chardon/editpdfplus/wikis/home">wiki page</a> for screenshots.


## Installation

 1. Download as a ZIP file
 2. Extract the ZIP file
 3. Rename the extracted root directory to 'editpdfplus'
 4. Copy the 'editpdfplus' directory to your Moodle server into <your-moodle-root-directory>/mod/assign/feedback/
 5. Apply patch file 'editpdfplus.patch' :
    a. `cd <your-moodle-root-directory>`
    b. `patch -p1 < mod/assign/feedback/editpdfplus/editpdfplus.patch`

By default, the standard 'Edit PDF' annotation tool will stay active over all your Moodle site. See below for instructions about activating this plugin in select places (courses, course categories), or on your whole Moodle site.


## Configuration

You can test-drive this plugin using the provided annotation tools that come pre-installed, or create your own annotation tool sets (palettes).

At the moment, tools can be added/modified directly as database records only. Current development will provide an UI for teachers to build their annotation palettes. 

See this <a href="https://gitlabriset.unil.ch/Marion.Chardon/editpdfplus/wikis/configuration">wiki page</a> for more details about creating new tool palettes.


## Activation of the plugin

An administrator profile will be able to give to a course the right to use this plugin or not.

 1. Go to the course (or course category) permissions settings
 2. Look for the ***mod/assignfeedback_editpdfplus:use*** capability
 3. Add the manager, teacher and student roles to it

The 'Annotate PDF advanced' plugin will then be used in place of the standard 'Annotate PDF' plugin in the corresponding course (or course category), or wherever you give users this capability.

For usage application, please follow <a href="https://gitlabriset.unil.ch/Marion.Chardon/editpdfplus/wikis/user-guide">this documentation</a>.


## What's next?

Upcoming developments include building an interface allowing teachers to customize their own annotation tool sets.


## Contributors and Licenses

Copyright: University of Lausanne, RISET
Author: Marion Chardon, <marion.chardon@unil.ch>

'Annotate PDF advanced' is a free software released under the GNU GPL licence, version 3.

