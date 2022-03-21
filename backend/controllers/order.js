const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Order } = require("../models/order");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/get/:userId", auth, async (req, res) => {
    const response = {};
    const data = {};
    data.userId = req.params.userId;
    try{
        const items = await Order.getOrderItems(data);
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

router.post("/place", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const result = await Order.placeOrder(data);
        response.result = result;
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