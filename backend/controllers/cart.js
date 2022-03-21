const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Cart } = require("../models/cart");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();


router.post("/add", auth, async (req, res) => {
    const response = {};
    const data = {};
    const item = req.body;
    try{
        const addItem = await Cart.addItem(item);
        response.addedItem = addItem;
        response.success = true;
        response.status = "200";
        return res.status(200).send(response);
    }catch(e){
        console.log(e);
        response.success = false;
        if(e.itemExists){
            response.itemExists = true;
            response.error = "Item already added";
            response.status = "400";
            res.status(400).send(response);
        }else{
            response.error = "Some error occurred. Please try again later";
            response.status = "500";
            res.status(500).send(response);
        }
    }
});

router.post("/delete", auth, async (req, res) => {
    const response = {};
    const data = {};
    const item = req.body;
    try{
        const removeItem = await Cart.removeItem(item);
        response.removedItem = removeItem;
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

router.get("/get/:userId", auth, async (req, res) => {
    const response = {};
    const data = {};
    data.userId = req.params.userId;
    try{
        const items = await Cart.getCartItems(data);
        response.items = items;
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

router.post("/item/quantity", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const updatedItem = await Cart.updateItemOrderQuantity(data);
        response.updatedItem = updatedItem;
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