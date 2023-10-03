const { Users } = require("../models/userModel");
const { Vender } = require("../models/venderModel");
const { sequelize } = require("../config/db");
const { Op } = require('sequelize');

exports.createUser = async (req,res)=>{
    let body = req.body;
    // console.log(req.body)
    try {
     let user =  await Users.create(body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({message : "User already exist"});
    }
}

exports.getUsers = async(req,res)=>{
    const pageNumber = req.params['page']; // Change this to the desired page number
    const pageSize = 100; // Change this to the desired page size

    // Calculate the offset based on the page number and page size
    const offset = (pageNumber - 1) * pageSize; 
    try {
        let users = await Users.findAll({ limit : pageSize , offset: offset});
        if(users.length !== 0){
            res.status(200).json(users);
        }else{
            res.status(400).json({message : "No users found"});
        }
    } catch (error) {
        res.status(500).json({message : "Something went wrong with the route"});
    }
}


exports.updatebyId = async(req,res)=>{
    let ID = req.params['id']
    let venderid = req.body.venderId;
    let updateData = req.body;
    try {
        let updated = await Users.update(updateData,{ where : { id : ID} });

        if(updated[0]==1){
            let user = await Users.findOne({ where : { id : ID } });
            console.log(user.status)
            if(user.status === "verified" || user.status === "verification_failed"){
                const incrementValue = 1;
                const updateQuery = {
                count: sequelize.literal(`count + ${incrementValue}`),
                };
                const [updatedRows] = await Vender.update(updateQuery, {
                where: { id: venderid },
                });
            }
            res.status(200).json (user);
        }else{
            res.status(400).json({message : "No one present with the id"});
        }
    } catch (error) {
        res.status(500).json({message : "something went wrong with the route"});
    }
};

// exports.updatebyId = async(req,res)=>{
//     let ID = req.params['id']
//     let updateData = req.body;
//     try {
//         let updated = await Users.update(updateData,{ where : { id : ID} });

//         if(updated[0]==1){
//             let user = await Users.findOne({ where : { id : ID } });
//             res.status(200).json (user);
//         }else{
//             res.status(500).json({message : "No one present with the id"});
//         }
//     } catch (error) {
//         res.status(500).json({message : "something went wrong with the route"});
//     }
// }

exports.deletebyId = async(req,res)=>{
    let ID = req.params['id'];
    // console.log(ID)
    try {
        // res.send({id: ID})
        let deleted = await Users.destroy({ where : { id : ID } })

        if(deleted == 1){
            res.status(200).json({});
        }else{
            res.status(400).json({message : "there is no user with the id"});
        }
        
    } catch (error) {
        res.status(500).json({message : "Some thing went wrong in the users delete route"});
    }
}

exports.getuserbyId = async(req,res)=>{
    let ID = req.params['id'];
    try {
        let user = await Users.findOne({ where : { id : ID } });
        if(user){
            res.status(200).json(user);
        }else{
            res.status(400).json({message : "Ther is no user with the ID"});
        }
        
    } catch (error) {
        res.status(500).json({message : "Sone thing went wrong in the getuser route"});
    }
}

exports.getCount = async(req,res)=>{
    try {
      const verifiedcount = await Users.count({
        where: {
          [Op.or]: [
            { status: 'verified' },
            { status: 'verification_failed' },
          ],
        },
      });
      const notverifiedcount = await Users.count({ where: { status: "not_verified" },});
      const totalCount = await Users.count();
          res.status(200).json({verifiedcount : verifiedcount , not_verifiedcount : notverifiedcount , totalCount : totalCount});
    } catch (error) {
         res.status(400).json({message : " something went wrong in the getcount route"});
    }
}

exports.filterbyStatus = async(req,res)=>{
    let msg = req.params['msg'];
    const pageNumber = req.params['page']; // Change this to the desired page number
    // console.log(msg,pageNumber)
    const pageSize = 100; // Change this to the desired page size

    // Calculate the offset based on the page number and page size
   const offset = (pageNumber - 1) * pageSize;

    try {
        let users = await Users.findAndCountAll({
            where: { status: msg },
            limit: pageSize,
            offset: offset,
          });
        res.status(200).json(users.rows);

    } catch (error) {
        res.status(500).json({message : "Some thing went wrong in the filter route"});
    }
}

exports.getallcount = async(req,res)=>{
    try {
      let count = await Users.count();
          res.status(200).json({count : count});
    } catch (error) {
         res.status(500).json({message :"something went wrong in the countall route"});
    }
}

//todo
exports.findUser = async (req,res)=>{
    const key = req.params['key']
    const value = req.params['value'];
    const venderid = req.body.venderId
    try {
        const lowerCaseValue = value.toLowerCase(); // Convert the query value to lowercase

        const user = await Users.findAll({
            where: {
              [Op.and]: [
                sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), lowerCaseValue),
                { inspectorId: venderid }, // Add the condition for inspectorId = 2 here
              ],
            },
          });
        res.status(200).json(user);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Some thing went wrong in the users delete route"});
    }
};


//todo
exports.adminfindUser = async (req,res)=>{
    const key = req.params['key']
    const value = req.params['value']
    try {
        const lowerCaseValue = value.toLowerCase(); // Convert the query value to lowercase

        const user = await Users.findAll({
          where: sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), lowerCaseValue),
        });
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({message : "Some thing went wrong in the users delete route"});
    }
}
