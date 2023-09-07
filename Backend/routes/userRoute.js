const express = require("express");
const Userroute = express.Router();
const { Users } = require("../models/userModel");
const { logger } = require("../middleware/logger");
const { createUser , getUsers , updatebyId , deletebyId , getuserbyId , getCount , filterbyStatus } = require("../controllers/usercontroller")


Userroute.get("/database", async (req, res) => {
    res.send("Working");
  });


Userroute.post("/create", logger, createUser );

Userroute.get("/get/:page", logger, getUsers );

Userroute.patch("/update/:id", logger, updatebyId );

Userroute.delete("/delete/:id", logger, deletebyId );

Userroute.get("/getone/:id", logger, getuserbyId );

Userroute.get("/getnumber/:msg", logger, getCount );

Userroute.get("/filter/:msg/:page", logger, filterbyStatus );


module.exports = {Userroute}       