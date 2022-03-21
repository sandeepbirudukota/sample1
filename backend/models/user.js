const con = require("../db");

const tableName = "user";

class User{

    static addUser = async ({id,name, email, password, country, currency, profilePicture})=>{
        try{
            return new Promise((resolve, reject)=>{
                try{
                    console.log("in query")
                    const sqlQuery = `INSERT INTO ${tableName} (id,name,email,password,country,currency,profilePicture) VALUES ("${id}","${name}","${email}","${password}","${country}","${currency}","${profilePicture}")`;
                    con.query(sqlQuery,(error, results)=>{
                        if(error){
                            console.log(error);
                            return reject(error);
                        }
                        console.log("ADD USER RESULTS: ", results);
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

    static checkExists = async ({email})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select * from ${tableName} WHERE email="${email}"`;
            console.log("SQL: ", sqlQuery);
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                let userObj = {};
                if(results && results.length){
                    userObj.userFound = true;
                    userObj.user = results[0];
                }else{
                    userObj.userFound = false; 
                }
                return resolve(userObj);
            });
        });
    }

    static getUserById = async ({id})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `select id,profilePicture,name,email,gender,dob,phone,address,city,country,about,shop,currency from ${tableName} WHERE id="${id}"`;
            con.query(sqlQuery, (error, results) => {
                if (error) {
                    console.log(error);
                    return reject(error);
                }
                let userObj = {};
                if(results && results.length){
                    userObj.userFound = true;
                    userObj.user = results[0];
                }else{
                    userObj.userFound = false; 
                }
                return resolve(userObj);
            });
        });
    }

    static editUser = async ({id,profilePicture,name,email,gender,dob,phone,address,city,country,about})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `update ${tableName} set profilePicture = '${profilePicture}', name = '${name}', email = '${email}', gender = '${gender}', dob = '${dob}', phone = '${phone}', address = '${address}', city = '${city}', country = '${country}', about = '${about}' where id = '${id}'`;
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

    static updateUserCurrency = async ({userId,currencyId}) => {
        return new Promise((resolve, reject) => {
            const sqlQuery = `update ${tableName} set currency = '${currencyId}' where id = '${userId}'`;
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

    static updateProfilePicture = async ({key,userId})=>{
        return new Promise((resolve, reject) => {
            const sqlQuery = `update ${tableName} set profilePicture = '${key}' where id = '${userId}'`;
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

module.exports.User = User;