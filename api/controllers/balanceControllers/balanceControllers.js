const { client } = require('../../utils/constants');
const { isMember } = require("../memberControllers/memberControllers");


const getBalances = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;

        if (!await isMember(groupId, username)) {
            console.error("Error in get Balances: not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }
        const query = {
            text: `
            SELECT username, balance
            FROM members
            WHERE group_id = $1`,
            values: [groupId]
        };

        result = await client.query(query);

        res.json({ Balances: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const updateBalances = async (amount, groupId, username) => {
    try {
        if (!await isMember(groupId, username)) {
            console.error("Error updating balance: Not a member.");
            return res.status(401).json({ message: 'Not a member.' });
        }

        const query = {
            text: `UPDATE members SET balance = balance + $1 WHERE group_id = $2 AND username = $3;`,
            values: [amount, groupId, username]
        };

        result = await client.query(query);
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};


module.exports = { getBalances, updateBalances };