# EditPdfPlus : fork of Moodle/editpdf, with customs options
Welcome to EditPdfPlus: fork of Moodle/editpdf module, developped by UNIL/RISET

Compatible with Moodle v3.1

## Synopsis
### Description
This tool is a moodle plugin wich allows:
- to use different correction axes (parameterizable in base)
- to use several types of customizable tools (simple annotation, comment, buffer, highlighting, margin annotation, chained annotations - eg repetition)
- to have different tool palettes (configurable in base)
- to create question / answer interactions with the student
- the student to consult and manage annotations
- to generate a PDF with annotations, and questions / answers

### Screenshots
//TODO

## Easy start
### Install a release
#### On frontend
- Download zip sources
- Open moodle on web
- Go to administration site, into plugin menu
- Install plugin from zip


#### On server
Patch editpdf plugin files

This patch allow users to use either editpdf or editpdfplus.

By default, it's the origin editpdf annotation tool which will be activated for all courses.

//TODO patch or script on editpdf files


### Configuration
See <a href="https://gitlabriset.unil.ch/Marion.Chardon/editpdfplus/wikis/configuration">wiki page</a> for this part.

### Active and use EditPdfPlus
An administrator profile will be able to give to a course the right to use this plugin or not.
- go to the permissions course
- look for ***mod/assignfeedback_editpdf:use***
- add manager, teacher and student roles to it

When a student give back a homework, the editpdfplus will automatically be used.

For usage application, please follow this documentation. //TODO

## What's next?
Develop interface for teacher, in order to allow them to customize their own palettes.

## Contributors and Licenses
RISET @ UNIL

EditPdfPlus is a free software released under GPL3 licence.