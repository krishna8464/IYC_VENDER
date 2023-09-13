const express = require("express");
const Venderroute = express.Router();
require("dotenv").config();

const jwt = require("jsonwebtoken")

const { Vender } = require("../models/venderModel");
const { logger } = require("../middleware/logger");
const { createVender , getOTP , validateOTP , updateVender , deleteVender , getoneVender , getallVender , getcoutallVender } = require("../controllers/vendercontroller")


Venderroute.post("/create", logger , createVender );

Venderroute.post("/getOTP", logger , getOTP );

Venderroute.post("/validateOTP", logger , validateOTP);

Venderroute.patch("/update/:id", logger , updateVender );

Venderroute.delete("/delete/:id", logger , deleteVender);

Venderroute.get("/getone/:id", logger , getoneVender);

Venderroute.get("/getall", logger , getallVender);

Venderroute.get("/getcount", logger , getcoutallVender)



  module.exports = { Venderroute }