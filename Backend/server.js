const express = require("express");
const { sequelize } = require("./config/db");
const { Userroute } = require("./routes/userRoute")

const app = express();
app.use(express.json());
app.use("/user",Userroute);


app.get("/",(req,res)=>{
    res.status(200).json({"Gretting" : "Welcome"})
})


app.listen(5000,async()=>{
    try {
        await sequelize;
        console.log("Data base is connected")
    } catch (error) {
        console.log(error.message);
        console.log("Data base is not connected")
    }
    console.log(`server is running over 5000`)
})