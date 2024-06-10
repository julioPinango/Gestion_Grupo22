const { client } = require('../../utils/constants');
const { updateBalances } = require('../balanceControllers/balanceControllers');
const { isMember } = require("../memberControllers/memberControllers");
const { pushNotification } = require('../notificationControllers/notificationControllers');

const addTransaction = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;
        const amount = req.body.amount;
        const participants = req.body.participants;
        const payer = req.body.payer;
        const description = req.body.description;
        const recurrence = req.body.recurrence;
        const selecteddate = req.body.selectedDate;
        const invoice = req.body.invoice;


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

        const transactionId = await _createTransaction(groupId, payer, amount, description, recurrence, invoice, selecteddate)

        for (let i = 0; i < participants.length; i++) { // TODO: handle errors
            if (payer == participants[i]) {
                continue
            }

            await _addDebtor(transactionId, participants[i], amount / participants.length, payer, groupId, description, recurrence)
        }

        res.status(200).json({ message: 'Transaction added' });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).send("Error adding transaction.");
    }
};


const _createTransaction = async (groupId, from, amount, description, recurrence, invoice, date) => { //TODO: handle errors

    try {
        const query = {

            text: `INSERT INTO transactions (group_id, payer, amount, description, recurrence, invoice, selecteddate) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
            values: [groupId, from, amount, description, recurrence, invoice, date]

        };

        const queryResult = await client.query(query);

        return queryResult.rows[0].id;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
};

const _addDebtor = async (transactionId, to, amount, from, groupId, description, recurrence) => { //TODO: handle errors

    try {
        const query = {

            text: `INSERT INTO debtors (transaction_id, debtor, amount) VALUES ($1,$2,$3)`,
            values: [transactionId, to, amount]

        };
        await client.query(query);

        await updateBalances(amount, groupId, from)
        await updateBalances(-amount, groupId, to)
        await pushNotification(groupId, from, to, amount, description, recurrence)
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



const getTransactionsByUserPayer = async (req, res) => {
    try {
        const username = req.user.username;

        const queryPayer = {
            text: `
            SELECT *
            FROM transactions
            WHERE payer = $1`,
            values: [username]
        };

        const resultPayer = await client.query(queryPayer);

        res.json({ Transactions: resultPayer.rows });
    } catch (error) {
        console.error("Error al obtener los datos de transactions:", error);
        res.status(500).send("Error en el servidor");
    }
};

const getTransactionsByUserDebtor = async (req, res) => {
    try {
        const username = req.user.username;

        const queryDebtor = {
            text: `
            SELECT t.id as id, t.payer as payer, d.amount as amount, t.description as description, t.recurrence as recurrence, t.invoice as invoice, t.selecteddate as selecteddate
            FROM transactions t
            INNER JOIN debtors d ON t.id = d.transaction_id
            WHERE debtor = $1`,
            values: [username]
        };

        const resultDebtor = await client.query(queryDebtor);

        res.json({ Transactions: resultDebtor.rows });
    } catch (error) {
        console.error("Error al obtener los datos de transactions:", error);
        res.status(500).send("Error en el servidor");
    }
};

const updateTransaction = async (req, res) => {
    try {
        const transactionId = req.params.transaction_id;
        const username = req.user.username;
        const groupId = req.params.group_id;

        const { description } = req.body;

        const existingTransaction = await client.query('SELECT * FROM transactions WHERE id = $1 AND from_username = $2 OR to_username = $2', [transactionId, username]);
        if (existingTransaction.rows.length === 0) {
            console.error('Error in update: transaction not found');
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const result = await client.query(
            'UPDATE transactions SET description = $1 WHERE id = $2',
            [
                description || existingTransaction.rows[0].description,
                transactionId,
            ]
        );

        if (result.rowCount === 0) {
            console.error('Error in update: transaction information not updated');
            return res.status(500).json({ message: 'Error updating transaction information' });
        }
        res.json({ message: "Transaction updated" });
    } catch (error) {
        console.error('Error in update:', error);
        res.status(500).send('Error in the server');
    }
};

module.exports = { addTransaction, getTransactions, getTransactionsByUserPayer, getTransactionsByUserDebtor, updateTransaction };