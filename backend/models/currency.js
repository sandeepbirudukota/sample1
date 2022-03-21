const con = require("../db");


const tableName = "currency";

class Currency{

    static getCurrencies = async ({userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select name,id from ${tableName}`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results);
            });
        });
    }

    static getCurrency = async ({currencyId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select * from ${tableName} where id='${currencyId}'`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                return resolve(results[0]);
            });
        });
    }

}

module.exports.Currency = Currency;