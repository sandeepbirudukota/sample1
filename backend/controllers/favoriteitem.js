const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { FavoriteItem } = require("../models/favoriteitem.js");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/add", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const favoriteItem = await FavoriteItem.addItem(data);
        response.favoriteItem = favoriteItem;
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

router.post("/remove", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const removeItem = await FavoriteItem.removeItem(data);
        response.removeItem = removeItem;
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

router.get("/:userId", auth, async (req, res) => {
    const response = {};
    const data = {};
    data.userId = req.params.userId;
    try{
        const favoriteItemResult = await FavoriteItem.getFavoriteItems(data);
        response.favoriteItems = favoriteItemResult;
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

router.post("/filter", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const itemsResult = await FavoriteItem.getFilteredFavoriteItems(data);
        response.items = itemsResult;
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