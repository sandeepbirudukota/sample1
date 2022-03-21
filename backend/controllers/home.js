const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { User } = require("../models/user");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, async (req, res) => {
    console.log("Home Page");
    res.send(200);
});


module.exports = router;