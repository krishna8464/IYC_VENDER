
const DataTypes = require("sequelize");
const { sequelize } = require("../config/db");

const Users=sequelize.define("users",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true
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
        defaultValue: 'not_verified', // Set the default value to 'not_verified'
    },
});

sequelize.sync()
.then(() => {
    console.log("table created successfully")
})
.catch(() => {
    console.log("failed to create tale")
})

module.exports={Users}