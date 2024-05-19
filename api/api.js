const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
const PORT = 3001;
const { connectToDatabase } = require("./utils/constants");
const { createUser, login, getUsers, getUser } = require("./controllers/userControllers/userControllers");
const { createGroup, getGroups, getGroup } = require("./controllers/groupControllers/groupControllers");
const { getMembers, addMember, deleteMember } = require("./controllers/memberControllers/memberControllers");
const { authenticateToken } = require("./authMiddleware/middleware");

//User Queries  
app.get("/users/", getUsers);
app.get("/users/:username", getUser);
app.post("/users", createUser);
app.post("/users/login", login);

//Group Queries
app.get("/groups/", authenticateToken, getGroups);
app.get("/groups/:group_id", authenticateToken, getGroup);
app.post("/groups", authenticateToken, createGroup);
// app.delete("/groups/:group_id", authenticateToken, deleteGroup);

//Members Queries
app.get("/groups/:group_id/members", authenticateToken, getMembers);
app.post("/groups/:group_id/members", authenticateToken, addMember);
app.delete("/groups/:group_id/members/:username", authenticateToken, deleteMember);







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