const con = require("../db");
const { 
    v4: uuidv4,
  } = require('uuid');

const tableName = "shop";
const userTableName = "user";

class Shop{

    static getUserShop = async ({userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select id,name,owner,displayPicture from ${tableName} where owner='${userId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }else if(results && results.length){
                    const queryResult = {};
                    queryResult.shopFound = true;
                    queryResult.shop = results[0];
                    return resolve(queryResult);
                }else{
                    const queryResult = {};
                    queryResult.shopFound = false;
                    return resolve(queryResult);
                }
            });
        });
    }

    static checkNameAvailable = async ({shopName})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select name,owner,displayPicture from ${tableName} where name='${shopName}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }else if(results && results.length){
                    const queryResult = {};
                    queryResult.shopFound = true;
                    queryResult.shop = results[0];
                    return resolve(queryResult);
                }else{
                    const queryResult = {};
                    queryResult.shopFound = false;
                    return resolve(queryResult);
                }
            });
        });
    }

    static createShop = async({shopName,user})=>{
        return new Promise((resolve, reject) => {
            const shopId = uuidv4();
            const sqlQuery = `INSERT INTO ${tableName} (id,name,owner) VALUES ("${shopId}","${shopName}","${user}")`;
            const sqlQuery2 = `update ${userTableName} set shop = '${shopId}' where id = '${user}'`;

            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }else if(results){
                    const queryResult = {};
                    queryResult.shopCreated = true;
                    queryResult.shopId = shopId;
                    con.query(sqlQuery2);
                    queryResult.shop = results;
                    return resolve(queryResult);
                }else{
                    const queryResult = {};
                    queryResult.shopCreated = false;
                    return resolve(queryResult);
                }
            });
        });
    }

    static getShopByUser = async ({userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select ${tableName}.id,${tableName}.name,${tableName}.owner,${tableName}.displayPicture, ${userTableName}.name as ownerName, ${userTableName}.email as ownerEmail, ${userTableName}.phone as ownerPhone, ${userTableName}.profilePicture from ${tableName} INNER JOIN ${userTableName} ON owner=${userTableName}.id WHERE owner="${userId}"`;
            //console.log("SQL: ", sqlQuery);
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                //console.log("USER EXISTS RESULTS: ", results);
                let userObj = {};
                if(results && results.length){
                    userObj.shopFound = true;
                    userObj.shop = results[0];
                }else{
                    userObj.shopFound = false; 
                }
                return resolve(userObj);
            });
        });
    }

    static getShopById = async ({userId,shopId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select ${tableName}.id,${tableName}.name,${tableName}.owner,${tableName}.displayPicture, ${userTableName}.name as ownerName, ${userTableName}.email as ownerEmail, ${userTableName}.phone as ownerPhone, ${userTableName}.profilePicture from ${tableName} INNER JOIN ${userTableName} ON owner=${userTableName}.id WHERE ${tableName}.id="${shopId}"`;
            console.log("SQL: ", sqlQuery);
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
               // console.log("USER EXISTS RESULTS: ", results);
                let userObj = {};
                userObj.editRights = false;
                if(results && results.length){
                    if(results[0].owner===userId){
                        userObj.editRights = true;
                    }
                    userObj.shopFound = true;
                    userObj.shop = results[0];
                }else{
                    userObj.shopFound = false; 
                }
                return resolve(userObj);
            });
        });
    }

    static updateDisplayPicture = async ({key,shopId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `update ${tableName} set displayPicture = '${key}' where id = '${shopId}'`;
            con.query(sqlQuery, (error, result) => {
                console.log("USER UPDATED RESULT"+JSON.stringify(result));
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                let userObj = {};
                if(result){
                    userObj.userEdited = true;
                }else{
                    userObj.userEdited = false; 
                }
                return resolve(userObj);
            });
        });
    }
}

module.exports.Shop = Shop;