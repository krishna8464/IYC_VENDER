const express = require("express");
const Userroute = express.Router();
const { Users } = require("../models/userModel");
const { logger } = require("../middleware/logger");
const { createUser , getUsers , updatebyId , deletebyId , getuserbyId , getCount , filterbyStatus } = require("../controllers/usercontroller");
const { authMiddleware } = require("../middleware/auth")


Userroute.get("/database", async (req, res) => {
    res.send("Working");
  });


Userroute.post("/create", logger, createUser );

Userroute.get("/get/:page", logger, authMiddleware , getUsers );

Userroute.patch("/update/:id", logger, authMiddleware , updatebyId );

Userroute.delete("/delete/:id", logger, authMiddleware , deletebyId );

Userroute.get("/getone/:id", logger, authMiddleware , getuserbyId );

Userroute.get("/getnumber/:msg", logger, authMiddleware , getCount );

Userroute.get("/filter/:msg/:page", logger, authMiddleware , filterbyStatus );


module.exports = { Userroute }       