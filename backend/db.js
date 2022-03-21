const mysql  = require('mysql2');
const config =  require('config');

module.exports = mysql.createPool({
  host: config.get("DB.host"),
  user: config.get("DB.username"),
  password: config.get("DB.password"),
  port: config.get("DB.port"),
  database: config.get("DB.database"),
  connectionLimit: 500,
  multipleStatements: true
});
console.log("pool created")

/* const db = mysql.createConnection({
     host: config.get("DB.host"),
     user: config.get("DB.username"),
     password: config.get("DB.password"),
     port: config.get("DB.port"),
     database: config.get("DB.database"),
     multipleStatements: true
 });

 db.connect((err)=>{
  if(err){
      throw err;
  }else{
      console.log("mysql connected");
  }
 });

 module.exports = db;*/