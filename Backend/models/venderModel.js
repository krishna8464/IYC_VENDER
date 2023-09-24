
const DataTypes = require("sequelize");
const { sequelize } = require("../config/db");

const Vender=sequelize.define("vender",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    number:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    role: {
        type: DataTypes.STRING,
        allowNull:false
    },
    count : {
        type : DataTypes.INTEGER,
        defaultValue: 0,
    },
    otp : {
        type : DataTypes.STRING,
        defaultValue : "000000",
    },status: {
        type: DataTypes.STRING,
        defaultValue: 'active', // Set the default value to 'active'
    },
    history: {
        type: DataTypes.JSON, 
        defaultValue: [], // Default value is an empty array
      },
});

sequelize.sync()
.then(() => {
    console.log("Vender table Synced successfully")
})
.catch(() => {
    console.log("failed to Sync Vender table")
})

module.exports={Vender}