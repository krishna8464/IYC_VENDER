
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
    }
});

sequelize.sync()
.then(() => {
    console.log("Vender table Synced successfully")
})
.catch(() => {
    console.log("failed to Sync Vender tale")
})

module.exports={Vender}