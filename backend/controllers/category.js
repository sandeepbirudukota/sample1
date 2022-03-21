const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Category } = require("../models/category");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/:userId", auth, async (req, res) => {
    const response = {};
    const data = {};
    data.userId = req.params.userId;
    try{
        const categories = await Category.getCategories(data);
        response.categories = categories;
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

router.post("/add", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const addedCategory = await Category.addCategory(data);
        response.addedCategory = addedCategory;
        response.success = true;
        response.status = "200";
        console.log(response);
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