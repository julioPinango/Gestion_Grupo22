const { client } = require('../../utils/constants');
const { updateBalances } = require('../balanceControllers/balanceControllers');
const { isMember } = require("../memberControllers/memberControllers");

const addTransaction = async (req, res) => {
    try {
        const groupId = req.params.group_id;
        const from = req.user.username;
        const amount = req.body.amount;
        const receivers = req.body.receivers;

        if (!await isMember(groupId, from)) { //TODO: maybe let admin add any transaction.
            console.error("Error at adding transaction: Not a member.");
            return res.status(401).json({ message: 'Not authorized.' });
        }

        for (let i = 0; i < receivers.length; i++) {
            if (!await isMember(groupId, receivers[i])) {
                console.error("Error at adding transaction: Receiver not a member.");
                return res.status(401).json({ message: 'Receiver not a member.' });
            }
        }

        if (amount <= 0) {
            console.error("Error adding transaction: Invalid amount.");
            return res.status(401).json({ message: 'Invalid amount.' });
        }

        for (let i = 0; i < receivers.length; i++) { // TODO: handle errors
            await _addTransaction(groupId, from, receivers[i], amount / (receivers.length + 1))
        }

        res.status(200).json({ message: 'Transaction added' });
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).send("Error adding transaction.");
    }
};

const _addTransaction = async (groupId, from, to, amount) => { //TODO: handle errors
    try {

        const query = {
            text: `INSERT INTO transactions (group_id, from_username, to_username, amount) VALUES ($1,$2,$3,$4)`,
            values: [groupId, from, to, amount]
        };
        await client.query(query);

        await updateBalances(amount, groupId, from)
        await updateBalances(-amount, groupId, to)
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
};


module.exports = { addTransaction };