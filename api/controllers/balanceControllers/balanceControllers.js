const { client } = require('../../utils/constants');


const getBalances = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;

        let result = await client.query('SELECT * FROM members WHERE username = $1 AND group_id = $2', [username, groupId]);

        if (result.rows.length === 0) {
            console.error("Error in get Balances: not a member.");
            return res.status(401).json({ message: 'Not a member.' });
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

const addExpenses = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const expenses = req.body.expenses;
        const username = req.user.username;


        let result = await client.query('SELECT * FROM members WHERE username = $1 AND group_id = $2', [username, groupId]);

        if (result.rows.length === 0) {
            console.error("Error adding expenses: Not a member.");
            return res.status(401).json({ message: 'Not a member.' });
        }

        const query = {
            text: `UPDATE members SET balance = balance + $1 WHERE group_id = $2 AND username = $3;`,
            values: [expenses, groupId, username]
        };

        result = await client.query(query);

        res.status(200).json({ message: 'Balance updated' });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};


module.exports = { getBalances, addExpenses };