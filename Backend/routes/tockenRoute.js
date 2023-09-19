const express = require("express");
const Tockenroute = express.Router();
const { Tocken } = require("../models/tockenModel");
const { logger } = require("../middleware/logger");const { authMiddleware } = require("../middleware/auth")


Tockenroute.get("/tocken", async (req, res) => {
   let black =  await Tocken.create(req.body);
   res.send(black)
  });



module.exports = { Tockenroute }       