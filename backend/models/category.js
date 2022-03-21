const con = require("../db");


const tableName = "category";

class Category{

    static getCategories = async ({userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select name,id from ${tableName} WHERE userId IS NULL OR userId='${userId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    static addCategory = async ({userId,name})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `INSERT INTO ${tableName} (userId,name) VALUES ('${userId}','${name}')`;
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

module.exports.Category = Category;