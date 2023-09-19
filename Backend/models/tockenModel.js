
const DataTypes = require("sequelize");
const { sequelize } = require("../config/db");

const Tocken = sequelize.define("blacklistings",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    tocken:{
        type:DataTypes.STRING
    },
});

sequelize.sync()
.then(() => {
    console.log("blacklisting table Synced successfully")
})
.catch(() => {
    console.log("failed to sync blacklisting table")
})

module.exports={Tocken}