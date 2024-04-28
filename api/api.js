const express = require("express");
const app = express();

app.get("/", (req, res) => {
    return res.send("Hello world!")
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log("Servidor en ejecución");
});
