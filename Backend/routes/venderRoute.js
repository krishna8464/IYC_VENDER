const express = require("express");
const Venderroute = express.Router();
require("dotenv").config();

const jwt = require("jsonwebtoken")

const { Vender } = require("../models/venderModel");
const { logger } = require("../middleware/logger");
const { authMiddleware } = require("../middleware/auth");
const { createVender , getOTP , validateOTP , updateVenderbyid , updateVenderbyauth , deleteVender , getoneVender , getallVender , getcoutallVender , venderLogout , venderincCount , venderdecCount , venderStatistics , vendertopScore , venderscoreASC , venderscoreDESC , vendernameASC , findVender , assignVender , assignWork , releaveVender , getStatisticsbyid , getStatisticsbyauth , getcountofnotassignedUsers , getassignedanotverifiedUsers ,getassignedaverifiedUsers , getassignedallUsers } = require("../controllers/vendercontroller")


Venderroute.post("/create", logger , createVender );

Venderroute.post("/getOTP", logger , getOTP );

Venderroute.post("/validateOTP", logger , validateOTP);

Venderroute.patch("/update/:id", logger , updateVenderbyid );

Venderroute.patch("/updateVenderbyauth" , logger , authMiddleware , updateVenderbyauth);

Venderroute.delete("/delete/:id", logger , deleteVender);

Venderroute.get("/getone/:id", logger , getoneVender);

Venderroute.get("/getall", logger , getallVender);

Venderroute.get("/getcount", logger , getcoutallVender);

Venderroute.post("/logout", logger , authMiddleware , venderLogout);

Venderroute.patch("/increcount", logger , authMiddleware , venderincCount);

Venderroute.patch("/deccount" , logger , authMiddleware , venderdecCount);

Venderroute.get("/venderStatistics", logger , authMiddleware , venderStatistics);

Venderroute.get("/topthree", logger , vendertopScore);

Venderroute.get("/venderscoreASC", logger , venderscoreASC);

Venderroute.get("/venderscoreDSC", logger, venderscoreDESC );

Venderroute.get("/vendernameASC", logger, vendernameASC );

Venderroute.get("/search/:key/:value", logger, authMiddleware , findVender );

Venderroute.post("/assignVender/:venderid/:userid", logger , assignVender);

Venderroute.post("/assignWork/:venderid/:recordcount", logger , authMiddleware , assignWork);

Venderroute.post("/releaveVender/:venderid", logger , authMiddleware , releaveVender);

Venderroute.get("/getStatisticsbyid/:venderid", logger , getStatisticsbyid);

Venderroute.get("/getStatisticsbyauth" , logger , authMiddleware , getStatisticsbyauth);

Venderroute.get("/getcountofnotassignedUsers", logger ,getcountofnotassignedUsers);

Venderroute.get("/getassignedanotverifiedUsers" , logger , authMiddleware , getassignedanotverifiedUsers);

Venderroute.get("/getassignedaverifiedUsers" , logger , authMiddleware , getassignedaverifiedUsers);

Venderroute.get("/getassignedallUsers" , logger , authMiddleware , getassignedallUsers);

module.exports = { Venderroute }