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
 * Upgrade code for the feedback_editpdfplus module.
 *
 * @package   assignfeedback_editpdfplus
 * @copyright 2013 Jerome Mouneyrac
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

use assignfeedback_editpdfplus\type_tool;

/**
 * EditPDF upgrade code
 * @param int $oldversion
 * @return bool
 */
function xmldb_assignfeedback_editpdfplus_upgrade($oldversion) {
    global $CFG, $DB;

    $dbman = $DB->get_manager();

    // Moodle v3.0.0 release upgrade line.
    if ($oldversion < 2016021600) {

        // Define table assignfeedback_editpdfplus_queue to be created.
        $table = new xmldb_table('assignfeedback_editpp_queue');

        // Adding fields to table assignfeedback_editpp_queue.
        $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE, null);
        $table->add_field('submissionid', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);
        $table->add_field('submissionattempt', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, null, null);

        // Adding keys to table assignfeedback_editpp_queue.
        $table->add_key('primary', XMLDB_KEY_PRIMARY, array('id'));

        // Conditionally launch create table for assignfeedback_editpp_queue.
        if (!$dbman->table_exists($table)) {
            $dbman->create_table($table);
        }

        // Editpdf savepoint reached.
        upgrade_plugin_savepoint(true, 2016021600, 'assignfeedback', 'editpdfplus');
    }

    // Automatically generated Moodle v3.2.0 release upgrade line.
    if ($oldversion < 2017022700) {

        // Get orphaned, duplicate files and delete them.
        $fs = get_file_storage();
        $sqllike = $DB->sql_like("filename", "?");
        $where = "component='assignfeedback_editpdfplus' AND filearea = 'importhtml' AND " . $sqllike;
        $filerecords = $DB->get_records_select("files", $where, ["onlinetext-%"]);
        foreach ($filerecords as $filerecord) {
            $file = $fs->get_file_instance($filerecord);
            $file->delete();
        }

        // Editpdf savepoint reached.
        upgrade_plugin_savepoint(true, 2017022700, 'assignfeedback', 'editpdfplus');
    }

    if ($oldversion < 2017071202) {

        $table = new xmldb_table('assignfeedback_editpp_typet');
        $field = new xmldb_field('configurable', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, 1);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        $record1 = $DB->get_record('assignfeedback_editpp_typet', array('label' => 'highlight'), '*', MUST_EXIST);
        $typeTool1 = new type_tool($record1);
        $typeTool1->configurable = 0;
        $DB->update_record('assignfeedback_editpp_typet', $typeTool1);
        $record2 = $DB->get_record('assignfeedback_editpp_typet', array('label' => 'oval'), '*', MUST_EXIST);
        $typeTool2 = new type_tool($record2);
        $typeTool2->configurable = 0;
        $DB->update_record('assignfeedback_editpp_typet', $typeTool2);
        $record3 = $DB->get_record('assignfeedback_editpp_typet', array('label' => 'rectangle'), '*', MUST_EXIST);
        $typeTool3 = new type_tool($record3);
        $typeTool3->configurable = 0;
        $DB->update_record('assignfeedback_editpp_typet', $typeTool3);
        $record4 = $DB->get_record('assignfeedback_editpp_typet', array('label' => 'line'), '*', MUST_EXIST);
        $typeTool4 = new type_tool($record4);
        $typeTool4->configurable = 0;
        $DB->update_record('assignfeedback_editpp_typet', $typeTool4);
        $record5 = $DB->get_record('assignfeedback_editpp_typet', array('label' => 'pen'), '*', MUST_EXIST);
        $typeTool5 = new type_tool($record5);
        $typeTool5->configurable = 0;
        $DB->update_record('assignfeedback_editpp_typet', $typeTool5);

        // Editpdf savepoint reached.
        upgrade_plugin_savepoint(true, 2017071202, 'assignfeedback', 'editpdfplus');
    }

    if ($oldversion < 2017081306) {
        $sql = "UPDATE {assignfeedback_editpp_typet}
                   SET color = :htmlcolor
                 WHERE color = :textcolor";
        // Update query params.
        $params = [
            'htmlcolor' => '#FF0000',
            'textcolor' => 'red'
        ];
        // Execute DB update for assign instances.
        $DB->execute($sql, $params);
        $sql = "UPDATE {assignfeedback_editpp_tool}
                   SET colors = :htmlcolor
                 WHERE colors = :textcolor";
        // Update query params.
        $params = [
            'htmlcolor' => '#FFA500',
            'textcolor' => 'orange'
        ];
        // Execute DB update for assign instances.
        $DB->execute($sql, $params);
        $sql = "UPDATE {assignfeedback_editpp_tool}
                   SET colors = :htmlcolor
                 WHERE colors = :textcolor";
        // Update query params.
        $params = [
            'htmlcolor' => '#008000',
            'textcolor' => 'green'
        ];
        // Execute DB update for assign instances.
        $DB->execute($sql, $params);
        $sql = "UPDATE {assignfeedback_editpp_tool}
                   SET colors = :htmlcolor
                 WHERE colors = :textcolor";
        // Update query params.
        $params = [
            'htmlcolor' => '#0000FF',
            'textcolor' => 'blue'
        ];
        // Execute DB update for assign instances.
        $DB->execute($sql, $params);

        // Editpdf savepoint reached.
        upgrade_plugin_savepoint(true, 2017081306, 'assignfeedback', 'editpdfplus');
    }

    if ($oldversion < 2017081601) {
        $table = new xmldb_table('assignfeedback_editpp_typet');
        $field = new xmldb_field('configurable_cartridge', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, 1);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        $field = new xmldb_field('configurable_cartridge_color', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, 1);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        $field = new xmldb_field('configurable_color', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, 1);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        $field = new xmldb_field('configurable_texts', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, 1);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }
        $field = new xmldb_field('configurable_question', XMLDB_TYPE_INTEGER, '1', null, XMLDB_NOTNULL, null, 1);
        if (!$dbman->field_exists($table, $field)) {
            $dbman->add_field($table, $field);
        }

        $sql = "UPDATE {assignfeedback_editpp_typet}
                   SET configurable_cartridge = 0,
                   configurable_cartridge_color = 0,
                   configurable_texts = 0,
                   configurable_question = 0
                 WHERE id = 3";
        // Update query params.
        $params = [];
        // Execute DB update for assign instances.
        $DB->execute($sql, $params);

        $sql = "UPDATE {assignfeedback_editpp_typet}
                   SET configurable_cartridge_color = 0,
                   configurable_color = 0
                 WHERE id = 4";
        // Execute DB update for assign instances.
        $DB->execute($sql, []);

        $sql = "UPDATE {assignfeedback_editpp_typet}
                   SET configurable_color = 0,
                   configurable_texts = 0
                 WHERE id = 7";
        // Execute DB update for assign instances.
        $DB->execute($sql, []);

        $sql = "UPDATE {assignfeedback_editpp_typet}
                   SET configurable_color = 0
                 WHERE id = 6";
        // Execute DB update for assign instances.
        $DB->execute($sql, []);

        // Editpdf savepoint reached.
        upgrade_plugin_savepoint(true, 2017081601, 'assignfeedback', 'editpdfplus');
    }

    return true;
}
