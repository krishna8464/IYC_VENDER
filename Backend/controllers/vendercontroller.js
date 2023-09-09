const { Vender } = require("../models/venderModel");
const jwt = require("jsonwebtoken")

exports.createVender = async (req, res) => {
    let body = req.body;
    console.log(body)
    try {
      await Vender.create(body);
      res.status(201).json({Success : "Vender created successfully"});
    } catch (error) {
        res.status(500).json({error : "Vender already exist"});
    }
  }


let OTP


exports.getOTP = async(req,res) => {
    let { number } = req.body;
    try {
        let venderData = await Vender.findOne({ where : { number : number } });
        let body = [venderData]

        if(body[0]===null){
            res.status(201).json({"error" : "User not found"})
        }else{
            
            function generateRandomNumbers() {
                const randomNumbers = [];
              
                for (let i = 0; i < 6; i++) {
                  const randomNumber = Math.floor(Math.random() * 10); // Change the range as needed
                  randomNumbers.push(randomNumber);
                }
              
                return randomNumbers;
             }
             const sixRandomNumbers = generateRandomNumbers();
             OTP=sixRandomNumbers
             res.status(201).json({Success : "success", id : body[0].id ,"response":sixRandomNumbers});

        }
    } catch (error) {
        res.status(500).json({error : "Not authorized"});
    }
};


exports.validateOTP = async(req,res) => {
    let { otp , id } = req.body;
    let serverotp = OTP.join("");
    let reqotp = otp
    // console.log(serverotp)
    // console.log(reqotp)
   let venderData = await Vender.findOne({ where : { id : id } });
    try {
     if(serverotp == reqotp){
         const token = jwt.sign({userid:id},process.env.KEY);
         res.status(200).json({ Success : "Login success" , "Access_Token":token , User : {"name" : venderData.name , "number" : venderData.number , "role" : venderData.role}})
     }else{
         res.send("notmatched")
     }
    } catch (error) {
     res.status(500).json({error});
    }
 }

 exports.updateVender = async (req,res) =>{
    let ID = req.params['id']
    let updateData = req.body;
    try {
        let updated = await Vender.update(updateData,{ where : { id : ID} });

        if(updated[0]==1){
            res.status(200).json ({Success : "Vender updated successfully"});
        }else{
            res.status(500).json({error : "No one present with the id"});
        }
    } catch (error) {
        res.status(500).json({error : "something went wrong with the route"});
    }
 };

 exports.deleteVender = async (req,res) =>{
    let ID = req.params['id'];
    // console.log(ID)
    try {
        // res.send({id: ID})
        let deleted = await Vender.destroy({ where : { id : ID } })

        if(deleted == 1){
            res.status(200).json({Success : "Vender deleted successfully"});
        }else{
            res.status(200).json({Success : "there is no Vender with the id"});
        }
        
    } catch (error) {
        res.status(500).json({error : error});
    }
 };


 exports.getoneVender = async (req,res) =>{
    let ID = req.params['id'];
    try {
        let user = await Vender.findOne({ where : { id : ID } });
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({error : error});
    }
 }

 exports.getallVender = async (req,res) =>{
    try {
        let users = await Vender.findAndCountAll();

        res.status(201).json({users : users});

    } catch (error) {
        res.status(500).json({error : "something went wrong with the route"});
    }
 }

 