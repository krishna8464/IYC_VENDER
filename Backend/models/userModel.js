
const DataTypes = require("sequelize");
const { sequelize } = require("../config/db");

const Users=sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    aggr_id:{
        type:DataTypes.BIGINT,
        allowNull:false
    },
    member_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    first_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    last_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    relative_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    date_of_birth:{
        type:DataTypes.DATE,
        allowNull:false
    },
    id_type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    id_value:{
        type:DataTypes.STRING,
        allowNull:true
    },
    ID_FRONT:{
        type:DataTypes.STRING,
        allowNull:false
    },
    ID_BACK:{
        type:DataTypes.STRING,
        allowNull:false
    },
    PHOTO_LINK:{
        type:DataTypes.STRING,
        allowNull:false
    },
    VIDEO:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'not_verified', // The default value to 'not_verified'
    },
    venderID: {
        type: DataTypes.INTEGER,
        defaultValue: 0 ,
    },
    venderStatus: {
        type: DataTypes.STRING,
        defaultValue: '', // Default value is an empty string
    },
    comment: {
        type: DataTypes.STRING,
        defaultValue: '', // Default value is an empty string
    },
    inspectorId: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // Default value is 0
    },
});

sequelize.sync()
.then(() => {
    console.log("User table Synced successfully")
})
.catch(() => {
    console.log("failed to sync User table")
})

module.exports={Users}