const { client } = require('../../utils/constants');
const { updateBalances } = require('../balanceControllers/balanceControllers');
const { isMember } = require("../memberControllers/memberControllers");

const addTransaction = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;
        const amount = req.body.amount;
        const participants = req.body.participants;
        const payer = req.body.payer;
        const description = req.body.description;
        const recurrence = req.body.recurrence;

        if (!await isMember(groupId, username)) {
            console.error("Error at adding transaction: Not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (!await isMember(groupId, payer)) {
            console.error("Error at adding transaction: Payer not a member.");
            return res.status(401).json({ message: 'Payer not a member.' });
        }
        for (let i = 0; i < participants.length; i++) {
            if (!await isMember(groupId, participants[i])) {
                console.error("Error at adding transaction: Participant not a member.");
                return res.status(401).json({ message: 'Participant not a member.' });
            }
        }
        if (amount <= 0) {
            console.error("Error adding transaction: Invalid amount.");
            return res.status(401).json({ message: 'Invalid amount.' });
        }

        for (let i = 0; i < participants.length; i++) { // TODO: handle errors
            if (payer == participants[i]) {
                continue
            }
            await _addTransaction(groupId, payer, participants[i], amount / participants.length, description, recurrence)
        }

        res.status(200).json({ message: 'Transaction added' });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).send("Error adding transaction.");
    }
};

const _addTransaction = async (groupId, from, to, amount, description, recurrence) => { //TODO: handle errors
    try {

        const query = {
            text: `INSERT INTO transactions (group_id, from_username, to_username, amount, description, recurrence) VALUES ($1,$2,$3,$4,$5,$6)`,
            values: [groupId, from, to, amount, description, recurrence]
        };
        await client.query(query);

        await updateBalances(amount, groupId, from)
        await updateBalances(-amount, groupId, to)
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
};

const getTransactions = async (req, res) => {
    try {
        const username = req.user.username;
        const groupId = req.params.group_id;

        if (!await isMember(groupId, username)) {
            console.error("Error at getting transactions: Not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }


        const query = {
            text: `
            SELECT *
            FROM transactions t
            WHERE t.group_id = $1`,
            values: [groupId]
        };

        const result = await client.query(query);

        res.json({ Transactions: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};


const getTransactionsByUser = async (req, res) => {
    try {
        const username = req.user.username;

        const query = {
            text: `
            SELECT *
            FROM transactions t
            WHERE t.from_username = $1 OR t.to_username = $1`,
            values: [username]
        };

        const result = await client.query(query);

        res.json({ Transactions: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const getMyTransactions = async (req, res) => {
    try {
        const username = req.user.username;

        const query = {
            text: `
            SELECT *
            FROM transactions t
            WHERE t.to_username = $1`,
            values: [username]
        };

        const result = await client.query(query);

        res.json({ Transactions: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

module.exports = { addTransaction, getTransactions, getTransactionsByUser, getMyTransactions };