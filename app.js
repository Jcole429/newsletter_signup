const express = require("express");
const bodyParser = require("body-parser");

const app = express()
const port = 3000;

app.use(express.static("public"));

app.listen(port, () => {
    console.log("App listening on port " + port);
})

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
});