const { client } = require('../../utils/constants');
const { updateBalances } = require('../balanceControllers/balanceControllers');
const { isMember } = require("../memberControllers/memberControllers");
const { pushNotification, notifyGroup } = require('../notificationControllers/notificationControllers');

const addTransaction = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const username = req.user.username;
        const { amount, participants, payer, description, recurrence, selectedDate, invoice, category } = req.body;

        if (!await isMember(groupId, username)) {
            console.error("Error at adding transaction: Not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }
        if (!await isMember(groupId, payer)) {
            console.error("Error at adding transaction: Payer not a member.");
            return res.status(401).json({ message: 'Payer not a member.' });
        }
        if (participants) {

            for (let i = 0; i < participants.length; i++) {
                if (!await isMember(groupId, participants[i])) {
                    console.error("Error at adding transaction: Participant not a member.");
                    return res.status(401).json({ message: 'Participant not a member.' });
                }
            }
        }
        if (amount <= 0) {
            console.error("Error adding transaction: Invalid amount.");
            return res.status(401).json({ message: 'Invalid amount.' });
        }

        const transactionId = await _createTransaction(groupId, payer, amount, description, recurrence, invoice, selectedDate, category)

        if (participants) {
            for (let i = 0; i < participants.length; i++) { // TODO: handle errors
                if (payer == participants[i]) {
                    continue
                }

                await _addDebtor(transactionId, participants[i], amount / participants.length, payer, groupId, description, recurrence)
            }
        } else { //it's a saving
            await _updateGroupSavings(groupId, payer, amount, description)
        }


        res.status(200).json({ message: 'Transaction added' });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).send("Error adding transaction.");
    }
};


const _createTransaction = async (groupId, from, amount, description, recurrence, invoice, date, category) => { //TODO: handle errors

    try {
        const query = {

            text: `INSERT INTO transactions (group_id, payer, amount, description, recurrence, invoice, selecteddate, category) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
            values: [groupId, from, amount, description, recurrence, invoice, date, category]

        };

        const queryResult = await client.query(query);

        return queryResult.rows[0].id;
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
};

const _addDebtor = async (transactionId, to, amount, from, groupId, description, recurrence) => { //TODO: handle errors

    try {
        const paid = 0;
        const query = {

            text: `INSERT INTO debtors (transaction_id, debtor, amount, paid) VALUES ($1,$2,$3,$4)`,
            values: [transactionId, to, amount, paid]

        };
        await client.query(query);

        await updateBalances(amount, groupId, from)
        await updateBalances(-amount, groupId, to)
        await pushNotification(groupId, from, to, amount, description, recurrence)
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
};

const _updateGroupSavings = async (groupId, from, amount, description) => {

    try {
        const result = await client.query(
            'UPDATE groups SET savings = savings + $1 WHERE id = $2',
            [
                amount,
                groupId
            ]
        );

        if (result.rowCount === 0) {
            console.error('Error in update: group information not updated');
            return false;
        }
        await updateBalances(amount, groupId, from)

        return await notifyGroup(groupId, from, amount, description)

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        return false;
    }
};

const getTransactions = async (req, res) => {
    try {
        const username = req.user.username;
        const groupId = req.params.group_id;
        const { category } = req.query

        if (!await isMember(groupId, username)) {
            console.error("Error at getting transactions: Not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const query = {
            text: `
            SELECT t.id as id, t.group_id as group_id, t.payer as payer, t.amount as amount, t.description as description, t.recurrence as recurrence, t.invoice as invoice, t.selecteddate as selecteddate, t.category as category,
                array_agg(d.debtor) as debtors
            FROM transactions t
            LEFT JOIN debtors d ON t.id = d.transaction_id
            WHERE t.group_id = $1
            GROUP BY t.id`,
            values: [groupId]
        };

        if (category) {
            query.values.push(category);
            query.text += ` AND category = $${query.values.length}`;
        }

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
        const { category } = req.query;

        const queryPayer = {
            text: `
            SELECT *
            FROM transactions
            WHERE payer = $1`,
            values: [username]
        };

        if (category) {
            queryPayer.values.push(category);
            queryPayer.text += ` AND category = $${queryPayer.values.length}`;
        }

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
        const { category } = req.query

        const queryDebtor = {
            text: `
            SELECT t.id as id, t.group_id as group_id, t.payer as payer, d.amount as amount, d.paid as paid, t.description as description, t.recurrence as recurrence, t.invoice as invoice, t.selecteddate as selecteddate, t.category as category
            FROM transactions t
            INNER JOIN debtors d ON t.id = d.transaction_id
            WHERE debtor = $1`,
            values: [username]
        };

        if (category) {
            queryDebtor.values.push(category);
            queryDebtor.text += ` AND t.category = $${queryDebtor.values.length}`;
        }

        const resultDebtor = await client.query(queryDebtor);

        res.json({ Transactions: resultDebtor.rows });
    } catch (error) {
        console.error("Error al obtener los datos de transactions:", error);
        res.status(500).send("Error en el servidor");
    }
};

const cancelDebt = async (req, res) => {
    try {
        const from = req.user.username;
        const groupId = req.body.group_id;
        const to = req.body.payer;
        const amount = req.body.amount;
        const transactionId = req.body.transaction_id;

        const existingTransaction = await client.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
        if (existingTransaction.rows.length === 0) {
            console.error('Error in update: transaction not found');
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const newAmount = existingTransaction.rows[0].amount - amount;

        // Actualizar el monto en la tabla transactions
        //const updateTransactionQuery = {
          //  text: 'UPDATE transactions SET amount = $1 WHERE id = $2',
            //values: [newAmount, transactionId]
        //};
        //await client.query(updateTransactionQuery);
        //const paid = amount;
        // Actualizar el monto en la tabla debtors

        const updateDebtorsQuery = {
            text: 'UPDATE debtors SET paid  = paid + $1 WHERE transaction_id = $2 AND debtor = $3',
            values: [amount, transactionId, from]
        };
        await client.query(updateDebtorsQuery);

        // Actualizar los saldos de los miembros del grupo
        await updateBalances(amount, groupId, from);
        await updateBalances(-amount, groupId, to);

        res.json({ message: 'Se canceló la deuda con éxito' });

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

        const { description, recurrence, invoice, selectedDate, category } = req.body;

        if (!await isMember(groupId, username)) {
            console.error("Error at adding transaction: Not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const existingTransaction = await client.query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
        if (existingTransaction.rows.length === 0) {
            console.error('Error in update: transaction not found');
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const result = await client.query(
            'UPDATE transactions SET description = $1, recurrence = $2, invoice = $3, selectedDate = $4, category = $5 WHERE id = $6',
            [
                description || existingTransaction.rows[0].description,
                recurrence || existingTransaction.rows[0].recurrence,
                invoice || existingTransaction.rows[0].invoice,
                selectedDate || existingTransaction.rows[0].selectedDate,
                category || existingTransaction.rows[0].category,
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

module.exports = { addTransaction, getTransactions, cancelDebt, getTransactionsByUserPayer, getTransactionsByUserDebtor, updateTransaction };