const express =  require('express');
const cors = require('cors');
const config = require("config");
const mysql = require("mysql2");
const auth = require("./middleware/auth");
const register = require("./controllers/register");
const login = require("./controllers/login");
const home = require("./controllers/home");
const user = require("./controllers/user");
const country = require("./controllers/country");
const shop = require("./controllers/shop");
const category = require("./controllers/category");
const item = require("./controllers/item");
const cart = require("./controllers/cart");
const order = require("./controllers/order");
const favoriteitem = require("./controllers/favoriteitem");
const currency = require("./controllers/currency");


const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, ()=>{
    console.log('Example app listening on port 3000');
})


app.use('/api/register',register);
app.use('/api/login',login);
app.use('/api/home',home);
app.use('/api/user',user);
app.use('/api/country',country);
app.use('/api/shop',shop);
app.use('/api/category',category);
app.use('/api/item',item);
app.use('/api/cart',cart);
app.use('/api/order',order);
app.use('/api/favoriteitem',favoriteitem);
app.use('/api/currency',currency);


