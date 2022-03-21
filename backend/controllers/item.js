const express = require("express");
const jwt = require("jsonwebtoken");
const config =  require('config');
const { Item } = require("../models/item");
const encrypt = require("../services/encrypt");
const auth = require("../middleware/auth");
const router = express.Router();


const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const { uploadFile, getFileStream } = require('../services/s3');

router.get("shop/:shopId", auth, async (req, res) => {
    const response = {};
    const data = {};
    data.shopId = req.params.shopId;
    try{
        const items = await Item.getShopItems(data);
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

router.get('/display-picture/:key', (req, res) => {
  const key = req.params.key;
  if(key!=="null" && key!=="undefined"){
    const readStream = getFileStream(key);
    readStream.pipe(res);
  }else{
      res.send("");
  }
});

router.get("/:itemId/:userId",  async (req, res) => {
    const response = {};
    const data = {};
    data.itemId = req.params.itemId;
    data.userId = req.params.userId;
    try{
        const item = await Item.getItem(data);
        response.item = item;
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
    const data = {};
    const item = req.body;
    try{
        const itemResult= await Item.addItem(item);
        response.item = itemResult;
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

router.post("/edit", auth, async (req, res) => {
    const response = {};
    const data = {};
    const item = req.body;
    try{
        const itemResult = await Item.editItem(item);
        response.item = itemResult;
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

router.post("/other", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    try{
        const itemsResult = await Item.getOtherItems(data);
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

router.post("/other/filter", auth, async (req, res) => {
    const response = {};
    const data = req.body;
    console.log(data);
    try{
        const itemsResult = await Item.getOtherFilteredItems(data);
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


router.post("/display-picture/upload", auth, upload.single("image"),async (req, res) => {
    const file = req.file;
    const response = {};
    try{
        const result = await uploadFile(file);
        result.itemId = req.body.itemId;
        const itemUpdate = await Item.updateDisplayPicture(result);
        response.success = true;
        response.status = "200";
        response.imageKey = result.key;
        res.status(200).send(response);
    }catch(e){
        console.log(e);
        response.success = false;
        response.error = "Some error occurred. Please try again later";
        response.status = "500";
        res.status(500).send(response);
    }
});


module.exports = router;