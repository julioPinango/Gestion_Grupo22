const { client } = require('../../utils/constants');


const createGroup = async (req, res) => {
    try {
        const { name, description } = req.body;
        const admin = req.user.username;

        const groupQuery = {
            text: `INSERT INTO groups (name, description, admin) VALUES ($1, $2, $3) RETURNING id`,
            values: [name, description, admin]
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
            SELECT g.id, g.name, g.description
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

        const query = {
            text: `
            SELECT g.id, g.name, g.description
            FROM groups g
            INNER JOIN members m ON g.id = m.group_id
            WHERE m.username = $1
            AND g.id = $2`,
            values: [username, groupId]
        };

        const result = await client.query(query);

        res.json({ group: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

module.exports = { createGroup, getGroups, getGroup };