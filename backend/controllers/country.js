const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Country } = require("../models/country");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
    const response = {};
    try{
        const countries = await Country.getCountries();
        response.countries = countries;
        response.success = true;
        response.status = "200";
        return res.status(200).send(response);
    }catch(e){
        console.log(e);
        response.success = false;
        response.error = "Some error occurred. Please try again later";
        response.status = "500";
        res.status(500).send(response);
    }
});


module.exports = router;