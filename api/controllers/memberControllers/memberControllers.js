const { client } = require('../../utils/constants');


const getMembers = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;

        let result = await client.query('SELECT * FROM members WHERE username = $1 AND group_id = $2', [username, groupId]);

        if (result.rows.length === 0) {
            console.error("Error in get members: not a member.");
            return res.status(401).json({ message: 'Not a member.' });
        }

        const query = {
            text: `
            SELECT u.username, u.name, u.lastname, u.email
            FROM users u
            INNER JOIN members m ON u.username = m.username
            WHERE m.group_id = $1`,
            values: [groupId]
        };

        result = await client.query(query);

        res.json({ Groups: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const addMember = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.body.username;
        const admin = req.user.username;


        let result = await client.query('SELECT * FROM groups WHERE admin = $1 AND id = $2', [admin, groupId]);

        if (result.rows.length === 0) {
            console.error("Error in add members: Not authorized.");
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const query = {
            text: `INSERT INTO members (group_id, username, balance) VALUES ($1,$2,0)`,
            values: [groupId, username]
        };

        result = await client.query(query);

        res.status(200).json({ message: 'Member added' });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const deleteMember = async (req, res) => {
    //try {
    //    const groupId = req.params.group_id
    //    const query = {
    //        text: `
    //        SELECT g.id, g.name, g.description
    //        FROM groups g
    //        INNER JOIN members m ON g.id = m.group_id
    //        WHERE m.username = $1
    //        AND g.id = $2`,
    //        values: [username, groupId]
    //    }
    //    const result = await client.query(query)
    //    res.json({ group: result.rows });
    //} catch (error) {
    //    console.error("Error al obtener los datos:", error);
    //    res.status(500).send("Error en el servidor");
    //}
};


const exitGroup = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username; 

        let result = await client.query('SELECT * FROM members WHERE username = $1 AND group_id = $2', [username, groupId]);

        if (result.rows.length === 0) {
            console.error("User is not a member of the group.");
            return res.status(404).json({ message: 'User is not a member of the group.' });
        }

        result = await client.query('DELETE FROM members WHERE username = $1 AND group_id = $2', [username, groupId]);

        res.status(200).json({ message: 'User successfully exited the group.' });
    } catch (error) {
        console.error("Error exiting group:", error);
        res.status(500).send("Error exiting group.");
    }
};

module.exports = { getMembers, addMember, deleteMember, exitGroup };