const fs = require("fs");

const express = require("express");
const app = express();

app.get("/pdf", [(req, res) => {
    res.status(200).send({"test": "TEST"});
}])