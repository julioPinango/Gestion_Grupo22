const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

//User Queries  
const { createUser, login, getUsers, getUser } = require("./controllers/userControllers/userControllers");

app.get("/users/", getUsers);
app.get("/users/:username", getUser);
app.post("/users", createUser);
app.post("/users/login", login);

const PORT = 3001;
app.listen(PORT, () => {
    console.log("Servidor en ejecución");
});
