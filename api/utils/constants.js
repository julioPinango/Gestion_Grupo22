const { Client } = require('pg');

const dbConfig = {
    user: "billbudyUser",
    password: "billbudy",
    database: "billbudy",
    host: "db",
    port: 5432,
};

const client = new Client(dbConfig);


async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to PostgreSQL database');
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:');
        throw error; // Rethrow error to indicate failure to connect
    }
}

module.exports = { connectToDatabase, client };
