const express = require("express");
const jwt = require("jsonwebtoken");
const { client } = require("../config/db");
require("dotenv").config();

// to give the user authentication to access the routes

const authMiddleware = async (req, res, next) => {
    let [tokenSyn, token] = req.headers.authorization.trim().split(" ");
  
    try {
      if (tokenSyn=="Bearer") {
        let black= await client.SISMEMBER('blackTokens', token);
        if(black){
            res.status(400).send({message:"Please Login Again"})
        }else{
            const decodedToken = jwt.verify(token, process.env.KEY);
            req.body.venderId = decodedToken.userid;
            next();
        }
      } else {
        res.status.json({error : "Token not authorized."});
        return;
      }
    } catch (e) {
      res.status(500).json({error : "Token not authorized."});
    }
  };

  module.exports = { authMiddleware }

  