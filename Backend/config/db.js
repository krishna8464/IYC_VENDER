const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DB,process.env.USER,process.env.PASSWORD,{
    host : "localhost", 
    dialect : "mysql"
});

sequelize.authenticate()
.then((res)=>{
    console.log("Connection Successfull to db");
})
.catch((err) => {
    console.log("Failed to connect");
});


// Redis cloud settings

const { createClient } = require("redis");

const client = createClient({
    password: process.env.PASS,
    socket: {
        host: process.env.REDISHOST,
        port: 11307
    }
});

module.exports={
    sequelize,
    client
}