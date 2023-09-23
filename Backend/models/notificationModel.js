// const DataTypes = require("sequelize");
// const { sequelize } = require("../config/db");

// const Notifaication = sequelize.define("notification",{
//     id:{
//         type:DataTypes.INTEGER,
//         primaryKey:true,
//         autoIncrement:true
//     },
//     venderID:{
//         type:DataTypes.INTEGER,
//         allowNull:false
//     },
//     title:{
//         type:DataTypes.STRING,
//         allowNull:false
//     },
//     message:{
//         type:DataTypes.STRING,
//         allowNull:false
//     },
// });

// sequelize.sync()
// .then(() => {
//     console.log("notification table Synced successfully")
// })
// .catch(() => {
//     console.log("failed to sync notification table")
// })

// module.exports={Notifaication}