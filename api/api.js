const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
const PORT = 3001;
const { connectToDatabase } = require("./utils/constants");
const { createUser, login, getUsers, getUser } = require("./controllers/userControllers/userControllers");

//User Queries  
app.get("/users/", getUsers);
app.get("/users/:username", getUser);
app.post("/users", createUser);
app.post("/users/login", login);




// Start the server only after connecting to the database
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log('Express server is running on port 3001');
        });
    })
    .catch(error => {
        console.error("Db is not ready yet...");
        process.exit(1); // Exit the process with failure status code
    });