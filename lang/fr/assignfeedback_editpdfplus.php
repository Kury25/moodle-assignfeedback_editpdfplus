<?php
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
 * Strings for component 'assignfeedback_editpdfplus', language 'en'
 *
 * @package   assignfeedback_editpdfplus
 * @copyright  2016 Université de Lausanne
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

$string['addtoquicklist'] = 'Add to quicklist';
$string['annotationcolour'] = 'Annotation colour';
$string['black'] = 'Black';
$string['blue'] = 'Blue';
$string['cannotopenpdf'] = 'Cannot open the PDF. The file may be corrupt, or in an unsupported format.';
$string['clear'] = 'Clear';
$string['colourpicker'] = 'Colour picker';
$string['commentcolour'] = 'Comment colour';
$string['comment'] = 'Comments';
$string['command'] = 'Command:';
$string['commentcontextmenu'] = 'Comment context menu';
$string['couldnotsavepage'] = 'Could not save page {$a}';
$string['currentstamp'] = 'Stamp';
$string['deleteannotation'] = 'Delete annotation';
$string['deletecomment'] = 'Delete comment';
$string['deletefeedback'] = 'Delete feedback PDF';
$string['downloadablefilename'] = 'feedback.pdf';
$string['downloadfeedback'] = 'Download feedback PDF';
$string['errorgenerateimage'] = 'Error generating image with ghostscript, debugging info: {$a}';
$string['editpdf'] = 'Annotation PDF avancé';
$string['editpdf_help'] = 'Annotate students submissions directly in the browser and produce an edited downloadable PDF.';
$string['enabled'] = 'Annotation PDF avancé';
$string['enabled_help'] = 'If enabled, the teacher will be able to create annotated PDF files when marking the assignments. This allows the teacher to add comments, drawing and stamps directly on top of the students work. The annotating is done in the browser and no extra software is required.';
$string['filter'] = 'Filter comments...';
$string['generatefeedback'] = 'Générer le feedback PDF';
$string['gotopage'] = 'Aller à la page';
$string['green'] = 'Green';
$string['gsimage'] = 'Ghostscript test image';
$string['pathtogspathdesc'] = 'Please note that annotate PDF requires the path to ghostscript to be set in {$a}.';
$string['pathtounoconvpathdesc'] = 'Please note that annotate PDF requires the path to unoconv to be set in {$a}.';
$string['highlight'] = 'Highlight';
$string['jsrequired'] = 'JavaScript is required to annotate a PDF. Please enable JavaScript in your browser to use this feature.';
$string['launcheditor'] = 'Launch PDF editor...';
$string['line'] = 'Line';
$string['loadingeditor'] = 'Loading PDF editor';
$string['navigatenext'] = 'Next page';
$string['navigateprevious'] = 'Previous page';
$string['oval'] = 'Oval';
$string['output'] = 'Output:';
$string['pagenumber'] = 'Page {$a}';
$string['pagexofy'] = '{$a->page} / {$a->total}';
$string['pen'] = 'Pen';
$string['pluginname'] = 'Annotate PDF advanced';
$string['generatingpdf'] = 'Génération du PDF...';
$string['rectangle'] = 'Rectangle';
$string['red'] = 'Red';
$string['result'] = 'Result:';
$string['searchcomments'] = 'Search comments';
$string['select'] = 'Select';
$string['stamppicker'] = 'Stamp picker';
$string['stampsdesc'] = 'Stamps must be image files (recommended size: 40x40). These images can be used with the stamp tool to annotate the PDF.';
$string['stamps'] = 'Stamps';
$string['stamp'] = 'Stamp';
$string['test_doesnotexist'] = 'The ghostscript path points to a non-existent file';
$string['test_empty'] = 'The ghostscript path is empty - please enter the correct path';
$string['testgs'] = 'Test ghostscript path';
$string['test_isdir'] = 'The ghostscript path points to a folder, please include the ghostscript program in the path you specify';
$string['test_notestfile'] = 'The test PDF is missing';
$string['test_notexecutable'] = 'The ghostscript points to a file that is not executable';
$string['test_ok'] = 'The ghostscript path appears to be OK - please check you can see the message in the image below';
$string['test_doesnotexist'] = 'The ghostscript path points to a non-existent file';
$string['test_empty'] = 'The ghostscript path is empty - please enter the correct path';
$string['test_unoconv'] = 'Test unoconv path';
$string['test_unoconvdoesnotexist'] = 'The unoconv path does not point to the unoconv program. Please review your path settings.';
$string['test_unoconvdownload'] = 'Download the converted pdf test file.';
$string['test_unoconvisdir'] = 'The unoconv path points to a folder, please include the unoconv program in the path you specify';
$string['test_unoconvnotestfile'] = 'The test document to be coverted into a PDF is missing';
$string['test_unoconvnotexecutable'] = 'The unoconv path points to a file that is not executable';
$string['test_unoconvok'] = 'The unoconv path appears to be properly configured.';
$string['test_unoconvversionnotsupported'] = 'The version of unoconv you have installed is not supported. Moodle\'s assignment grading feature requires version 0.7 or higher.';
$string['toolbarbutton'] = '{$a->tool} {$a->shortcut}';
$string['tool'] = 'Tool';
$string['viewfeedbackonline'] = 'Voir le PDF annoté...';
$string['white'] = 'White';
$string['yellow'] = 'Yellow';
$string['yellowlemon'] = 'Lemon yellow';
$string['draftchangessaved'] = 'Annotations sauvées';
$string['nodraftchangessaved'] = 'Changements sauvés';
$string['preparesubmissionsforannotation'] = 'Préparation de la validation des annotations';
$string['question_select'] = 'Question';
$string['question_select_with'] = 'Avec';
$string['question_select_without'] = 'Sans';
$string['statut_select'] = 'Statut';
$string['statut_select_nc'] = 'Non traité';
$string['statut_select_ok'] = 'OK';
$string['statut_select_ko'] = 'non OK';
$string['send_pdf_update'] = 'Envoyer';
$string['student_statut_nc'] = 'non traité';
$string['student_answer_lib'] = 'Réponse';
$string['assignfeedback_editpdf:use'] = 'Utiliser le plugin';
