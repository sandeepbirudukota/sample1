const con = require("../db");


const tableName = "country";

class Country{

    static getCountries = async ()=>{
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

}

module.exports.Country = Country;