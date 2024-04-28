const { Client } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { dbConfig } = require('../../utils/constants');
const secret = 'secret';

const client = new Client(dbConfig);
client.connect();

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            console.error("Error in login: User not found");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.error("Error in login: Invalid password");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const userData = { name: user.name, lastname: user.lastname, username: user.username };
        console.log('### userData', userData);
        const token = jwt.sign(userData, secret, { expiresIn: '1h' });

        res.json({ jwt: token, ...userData });
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).send("Error in the server");
    }
};

const createUser = async (req, res) => {
    try {
        const { name, lastname, username, email, password, date_of_birth } = req.body;
        console.log(name)
        const existingUser = await client.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (existingUser.rows.length > 0) {
            console.error("Error in signup: User already exists");
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await client.query('INSERT INTO users (name, lastname, username, email, password, date_of_birth) VALUES ($1,$2,$3, $4, $5, $6)', [name, lastname, username, email, hashedPassword, date_of_birth]);

        if (result.rowCount === 0) {
            console.error("Error in signup: User not created");
            return res.status(500).json({ message: 'Error creating user' });
        }

        const newUser = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = newUser.rows[0];

        const userData = { name: user.name, lastname: user.lastname, username: user.username };

        const token = jwt.sign(userData, secret, { expiresIn: '1h' });

        res.json({ jwt: token, ...userData });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).send("Error in the server");
    }
};

const getUsers = async (req, res) => {
    try {

        let query = "SELECT name, lastname, username, email, date_of_birth FROM users";

        const result = await client.query(query);

        res.json({ users: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};

const getUser = async (req, res) => {
    try {
        const username = req.params.username;
        const result = await client.query("SELECT name, lastname, username, email, date_of_birth FROM users WHERE username = $1", [username]);
        res.json({ user: result.rows });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error en el servidor");
    }
};




module.exports = { createUser, login, getUsers, getUser };