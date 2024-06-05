const { client } = require('../../utils/constants');

const getNotifications = async (req, res) => {
    try {
        const username = req.user.username;

        const query = {
            text: `
            SELECT *
            FROM notifications
            WHERE to_username = $1`,
            values: [username]
        };

        result = await client.query(query);

        await client.query('DELETE FROM notifications WHERE to_username = $1', [username]);

        res.json({ Notifications: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const pushNotification = async (groupId, from, to, amount, description, recurrence) => {
    try {
        const query = {
            text: `INSERT INTO notifications (group_id, from_username, to_username, amount, description, recurrence) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
            values: [groupId, from, to, amount, description, recurrence]
        };
        result = await client.query(query);
    } catch (error) {
        console.error("Error al pushear notificacion:", error);
        res.status(500).send("Error en el servidor");
    }
};




module.exports = { getNotifications, pushNotification };