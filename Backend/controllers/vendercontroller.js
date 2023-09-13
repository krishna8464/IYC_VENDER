const { Vender } = require("../models/venderModel");
const jwt = require("jsonwebtoken")

exports.createVender = async (req, res) => {
    let body = req.body;
    console.log(body)
    try {
     let vender =  await Vender.create(body);
      res.status(201).json(vender);
    } catch (error) {
        res.status(409).json({ message : "Vender already exist"});
    }
  }

 

exports.getOTP = async(req,res) => {
    let { number } = req.body;
    try {
        let venderData = await Vender.findOne({ where : { number : number } });
        let body = [venderData]

        if(body[0]===null){
            res.status(201).json({"message" : "User not found"})
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
             let value = sixRandomNumbers.join("");
             updateData = { otp : value }
             await Vender.update(updateData,{ where : { id : venderData.id} });

             res.status(201).json({venderid : body[0].id ,"otp":value});

        }
    } catch (error) {
        res.status(402).json({message : "Not authorized"});
    }
};


exports.validateOTP = async(req,res) => {
    let { otp , id } = req.body;
    let reqotp = otp
   let venderData = await Vender.findOne({ where : { id : id } });
    try {
     if(venderData.otp == reqotp){
         const token = jwt.sign({userid:id},process.env.KEY);
         res.status(200).json({ "Access_Token":token , vender : {"name" : venderData.name , "number" : venderData.number , "role" : venderData.role}})
     }else{
        res.status(400).json({message : "wrong otp entered"});
     }
    } catch (error) {
     res.status(500).json({message : "wrong otp entered"});
    }
 }

 exports.updateVender = async (req,res) =>{
    let ID = req.params['id']
    let updateData = req.body;
    try {
        let updated = await Vender.update(updateData,{ where : { id : ID} });

        if(updated[0]==1){
            let user = await Vender.findOne({ where : { id : ID } });
            res.status(200).json (user);
        }else{
            res.status(400).json({message : "No one present with the id"});
        }
    } catch (error) {
        res.status(500).json({message : "something went wrong with the route"});
    }
 };

 exports.deleteVender = async (req,res) =>{
    let ID = req.params['id'];
    // console.log(ID)
    try {
        // res.send({id: ID})
        let deleted = await Vender.destroy({ where : { id : ID } })

        if(deleted == 1){
            res.status(200).json({});
        }else{
            res.status(400).json({message : "There is no Vender with the id"});
        }
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender delete route"});
    }
 };


 exports.getoneVender = async (req,res) =>{
    let ID = req.params['id'];
    try {
        let vender = await Vender.findOne({ where : { id : ID } });
        res.status(200).json(vender);
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender getone route"});
    }
 }

 exports.getallVender = async (req,res) =>{
    try {
        let vender = await Vender.findAndCountAll();

        res.status(201).json(vender.rows);

    } catch (error) {
        res.status(500).json({message : "something went wrong with the route"});
    }
 }


 exports.getcoutallVender = async(req,res)=>{
    try {
      let count = await Vender.count();
          res.status(200).json({ count : count });
    } catch (error) {
         res.status(500).json({message : "Something went wrong in the vender getcount route"});
    }
}
 