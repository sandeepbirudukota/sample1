const con = require("../db");


const tableName = "favoriteitem";
const itemTableName = "item";

class FavoriteItem{

    static getFavoriteItems = async ({userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select ${itemTableName}.displayPicture as itemDisplayPicture, ${tableName}.id as favoriteItemId, ${itemTableName}.id as itemId, ${itemTableName}.name as itemName, ${itemTableName}.quantity as itemQuantity, ${itemTableName}.description as itemDescription, ${itemTableName}.category as itemCategory, ${itemTableName}.price as itemPrice,${itemTableName}.salescount as itemSalesCount from ${tableName} JOIN ${itemTableName} ON ${tableName}.itemid=${itemTableName}.id WHERE userid='${userId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    static addItem = async ({userId, itemId})=>{
        try{
            return new Promise((resolve, reject)=>{
                try{
                    const sqlQuery = `INSERT INTO ${tableName} (userid, itemid) VALUES ('${userId}', '${itemId}')`;
                    con.query(sqlQuery,(error, results)=>{
                        if(error){
                            return reject(error);
                        }
                        console.log("ADD Item RESULTS: ", results);
                        return resolve(results);
                    });
                }catch(e){
                    return reject(e);
                }
            });
        }catch(e){
            throw Error(e);
        }
    }

    static removeItem = async ({userId,itemId})=>{
        try{
            return new Promise((resolve, reject)=>{
                try{
                    const sqlQuery = `DELETE from ${tableName} WHERE userid='${userId}' AND itemid='${itemId}'`;
                    con.query(sqlQuery,(error, results)=>{
                        if(error){
                            console.log(error);
                            return reject(error);
                        }
                        console.log("DELETE Item RESULTS: ", results);
                        return resolve(results);
                    });
                }catch(e){
                    console.log(e);
                    return reject(e);
                }
            });
        }catch(e){
            console.log(e);
            throw Error(e);
        }
    }

    static getFilteredFavoriteItems = async ({searchQuery,userId})=>{
        return new Promise((resolve, reject) => {
            let sqlQuery = `select ${tableName}.id as favoriteItemId, ${itemTableName}.id as itemId, ${itemTableName}.name as itemName, ${itemTableName}.quantity as itemQuantity, ${itemTableName}.description as itemDescription, ${itemTableName}.category as itemCategory, ${itemTableName}.price as itemPrice, ${itemTableName}.displayPicture as itemDisplayPicture from ${tableName} JOIN ${itemTableName} ON ${tableName}.item=${itemTableName}.id WHERE ${itemTableName}.name LIKE '%${searchQuery}%' AND user='${userId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }
}

module.exports.FavoriteItem = FavoriteItem;