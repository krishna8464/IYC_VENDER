const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("iycinternal","iyc_dev","wA42t4gu",{
    host : "iycinternal.cuc5uocado2t.ap-south-1.rds.amazonaws.com", 
    port : 3306,
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

// const { createClient } = require("redis");

// const client = createClient({
//     password: process.env.PASS,
//     socket: {
//         host: process.env.REDISHOST,
//         port: 11307
//     }
// });

module.exports={
    sequelize,
    // client
}