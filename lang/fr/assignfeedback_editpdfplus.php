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
$string['pluginname'] = 'Annotation PDF avancé';
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
$string['editpdfplus:use'] = 'Utiliser le plugin';
$string['editpdfplus:notify'] = 'Recevoir les notifications';
$string['editpdfplus:managetools'] = 'Gérer les barres d\'outils';
$string['admintitle'] = 'Feedback configuration';
$string['adminsubtitle'] = 'Configuration de la barre d\'outils de l\'annotation PDF avancée';
$string['admincurrenttoolbar'] = 'Barre d\'outils en cours';
$string['adminaxis'] = 'Axes';
$string['adminaxisimporttitle'] = 'Importation axe';
$string['adminaxisimport'] = 'Axes disponibles à l\'importation';
$string['adminaxisimport_name'] = 'Nom';
$string['adminaxisimport_tool'] = 'Outils';
$string['adminaxisimport_action'] = 'Importer';
$string['adminaxis_save'] = 'Sauver';
$string['adminaxis_cancel'] = 'Annuler';
$string['adminaxisdelete_question'] = 'Êtes-vous sûr de supprimer l\'axe sélectionné ?';
$string['adminaxisdelete_ok'] = 'Oui';
$string['adminaxisdelete_ko'] = 'Non';
$string['admintools'] = 'Outils';
$string['adminaddtool'] = 'Ajout d\'un nouvel outil';
$string['admintoolboxaction'] = 'Action';
$string['admintoolboxtypetool'] = 'Type d\'outil';
$string['admintoolboxtypetool_type'] = 'Type';
$string['admintoolboxtoolbardisplay'] = 'Affichage barre d\'outil';
$string['admintoolboxtoolbardisplay_button'] = 'Bouton';
$string['admintoolboxtoolbardisplay_order'] = 'Ordre';
$string['admintoolboxtoolbardisplay_axis'] = 'Axe';
$string['admintoolboxcartridge'] = 'Cartouche';
$string['admintoolboxcartridge_label'] = 'Libellé';
$string['admintoolboxcartridge_color'] = 'Couleur';
$string['admintoolboxannotation'] = 'Annotation';
$string['admintoolboxannotation_color'] = 'Couleur';
$string['admintoolboxannotation_texts'] = 'Textes prédéfinis';
$string['admintoolboxannotation_reply'] = 'Question/réponse';
$string['admindeltool_messageok'] = 'Outil supprimé';
$string['admindeltool_messageko'] = 'Erreur à la suppression';
$string['adminaddtool_messageok'] = 'Ajout enregistré';
$string['adminedittool_messageok'] = 'Modifications enregistrées';
$string['admin_messageko'] = 'Erreur à l\'enregistrement';
$string['adminaddtool_messagelibelleko'] = '<strong>Attention!</strong> Le libellé du bouton n\'est pas renseigné';
$string['typetool_highlightplus'] = 'Surlignement avec commentaires';
$string['typetool_stampplus'] = 'Tampon avec contenu personalisé';
$string['typetool_frame'] = 'Encadrement d\'éléments avec commentaires';
$string['typetool_verticalline'] = 'Ligne verticale avec commentaires';
$string['typetool_stampcomment'] = 'Tamon double flèche avec commentaires';
$string['typetool_commentplus'] = 'Cadre de commentaire avancé';
$string['typetool_highlightplus_desc'] = 'Configuration par défaut de l\'outil "surlignement avec commentaires"';
$string['typetool_stampplus_desc'] = 'Configuration par défaut de l\'outil "tampon avec contenu personalisé"';
$string['typetool_frame_desc'] = 'Configuration par défaut de l\'outil "encadrement d\'éléments avec commentaires"';
$string['typetool_verticalline_desc'] = 'Configuration par défaut de l\'outil "ligne verticale avec commentaires"';
$string['typetool_stampcomment_desc'] = 'Configuration par défaut de l\'outil "tamon double flèche avec commentaires"';
$string['typetool_commentplus_desc'] = 'Configuration par défaut de l\'outil "cadre de commentaire avancé"';
$string['is_not_configurable'] = 'N\'est pas configurable';
$string['is_not_configurable_desc'] = 'Si coché, les utilisateurs ne pouront  pas créer ou personaliser des outils à partir de ce type';
$string['adminplugin_color'] = 'Couleur';
$string['adminplugin_color_desc'] = 'Couleur de l\'annotation';
$string['adminplugin_cartridge_color'] = 'Couleur cartouche';
$string['adminplugin_cartridge_color_desc'] = 'Couleur du cartouche';
$string['adminplugin_cartridge_x'] = 'Décalage relatif horizontal';
$string['adminplugin_cartridge_x_desc'] = 'Décalage relatif horizontal du cartouche par rapport à l\'annotation en px';
$string['adminplugin_cartridge_y'] = 'Décalage relatif vertical';
$string['adminplugin_cartridge_y_desc'] = 'Décalage relatif vertical du cartouche par rapport à l\'annotation en px';


