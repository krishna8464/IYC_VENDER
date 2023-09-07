const express = require("express");
const Userroute = express.Router();
const { Users } = require("../models/userModel");


Userroute.get("/database", async (req, res) => {
    res.send("Working");
  });


Userroute.post("/create", async (req, res) => {
    let body = req.body;
    console.log(req.body)
    try {
      await Users.create(body);
      res.status(201).json({Success : "User created successfully"});
    } catch (error) {
      res.status(500).json({error : "something went wrong with the route"});
    }
  });

Userroute.get("/get/:page",async(req,res)=>{
    const pageNumber = req.params['page']; // Change this to the desired page number
    const pageSize = 100; // Change this to the desired page size

    // Calculate the offset based on the page number and page size
    const offset = (pageNumber - 1) * pageSize; 
    try {
        let users = await Users.findAll({ limit : pageSize , offset: offset});

        res.status(201).json({users : users});

    } catch (error) {
        res.status(500).json({error : "something went wrong with the route"});
    }
})

Userroute.patch("/update/:id",async(req,res)=>{
    let ID = req.params['id']
    let updateData = req.body;
    try {
        let updated = await Users.update(updateData,{ where : { id : ID} });

        if(updated[0]==1){
            res.status(200).json ({Success : "User updated successfully"});
        }else{
            res.status(500).json({error : "something went wrong with the route"});
        }
    } catch (error) {
        res.status(500).json({error : "something went wrong with the route"});
    }
})


Userroute.delete("/delete/:id",async(req,res)=>{
    let ID = req.params['id'];
    console.log(ID)
    try {
        // res.send({id: ID})
        let deleted = await Users.destroy({ where : { id : ID } })

        if(deleted == 1){
            res.status(200).json({Success : "User deleted successfully"});
        }else{
            res.status(200).json({Success : "there is no user with the id"});
        }
        
    } catch (error) {
        res.status(500).json({error : error});
    }
})


Userroute.get("/getone/:id",async(req,res)=>{
    let ID = req.params['id'];
    try {
        let user = await Users.findOne({ where : { id : ID } });
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({error : error});
    }
});

Userroute.get("/getnumber/:msg",async(req,res)=>{
    let msg = req.params['msg'];
    try {
      let count = await Users.count({
            where: { status: msg },
          });
          res.status(200).json({count : count});
    } catch (error) {
         res.status(500).json({error : error});
    }
});

Userroute.get("/filter/:msg/:page",async(req,res)=>{
    let msg = req.params['msg'];
    const pageNumber = req.params['page']; // Change this to the desired page number
    console.log(msg,pageNumber)
    const pageSize = 100; // Change this to the desired page size


    // Calculate the offset based on the page number and page size
   const offset = (pageNumber - 1) * pageSize;

    try {
        let users = await Users.findAndCountAll({
            where: { status: msg },
            limit: pageSize,
            offset: offset,
          });
        res.status(200).json({users});

    } catch (error) {
        res.status(500).json({error : error});
    }
});




  module.exports = {Userroute}       