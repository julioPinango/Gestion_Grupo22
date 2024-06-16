const { client } = require('../../utils/constants');
const { isMember } = require("../memberControllers/memberControllers");

const createGroup = async (req, res) => {
    try {
        const { name, description, objetive } = req.body;
        const admin = req.user.username;

        const groupQuery = {
            text: `INSERT INTO groups (name, description, admin, objetive) VALUES ($1, $2, $3, $4) RETURNING id`,
            values: [name, description, admin, objetive]
        };

        const groupResult = await client.query(groupQuery);
        const groupId = groupResult.rows[0].id;
        const memberQuery = {
            text: `INSERT INTO members (group_id, username, balance) VALUES ($1, $2, $3)`,
            values: [groupId, admin, 0]
        };

        await client.query(memberQuery);

        res.status(201).json({ message: 'Group created' }); // TODO: return GroupId
    } catch (error) {
        console.error("Error al crear grupo", error);
        res.status(500).send("Error en el servidor");
    }
};

const getGroups = async (req, res) => {
    try {
        const username = req.user.username;

        const query = {
            text: `
            SELECT g.id, g.name, g.description, g.objetive
            FROM groups g
            INNER JOIN members m ON g.id = m.group_id
            WHERE m.username = $1`,
            values: [username]
        };

        const result = await client.query(query);

        res.json({ Groups: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const getGroup = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;

        if (!await isMember(groupId, username)) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const query = {
            text: `
            SELECT g.id, g.name, g.description, g.objetive
            FROM groups g
            INNER JOIN members m ON g.id = m.group_id
            WHERE m.username = $1
            AND g.id = $2`,
            values: [username, groupId]
        };

        const result = await client.query(query);

        res.json({ group: result.rows[0] });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const updateGroup = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;

        const {
            name,
            description,
            objetive
        } = req.body;

        const existingGroup = await client.query('SELECT * FROM groups WHERE id = $1 AND admin = $2', [groupId, username]);
        if (existingGroup.rows.length === 0) {
            console.error('Error in update: group not found');
            return res.status(404).json({ message: 'group not found' });
        }
        if (objetive && existingGroup.rows[0].objetive == null) {
            console.error('Error in update: change type');
            return res.status(404).json({ message: 'Cannot change the group type.' });
        }

        const updateFields = {
            name: name || existingGroup.rows[0].name,
            description: description || existingGroup.rows[0].description,
            objetive: objetive || existingGroup.rows[0].objetive,
        };

        const result = await client.query(
            'UPDATE groups SET name = $1, description = $2, objetive = $3 WHERE id = $4',
            [
                updateFields.name,
                updateFields.description,
                updateFields.objetive,
                groupId,
            ]
        );

        if (result.rowCount === 0) {
            console.error('Error in update: group information not updated');
            return res.status(500).json({ message: 'Error updating group information' });
        }
        res.json({ message: "Group updated" });
    } catch (error) {
        console.error('Error in update:', error);
        res.status(500).send('Error in the server');
    }
};

const getAdmin = async (req, res) => {
    try {
        const username = req.user.username;
        const groupId = req.params.group_id;

        if (!await isMember(groupId, username)) {
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const query = {
            text: `
            SELECT admin
            FROM groups g
            WHERE id = $1`,
            values: [groupId]
        };

        const result = await client.query(query);
        return res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const isAdmin = async (groupId, username) => {
    try {
        let result = await client.query('SELECT * FROM groups WHERE admin = $1 AND group_id = $2', [username, groupId]);

        if (result.rows.length === 0) {
            return false
        }
        return true;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return false
    }
};

module.exports = { createGroup, getGroups, getGroup, getAdmin, updateGroup, isAdmin };