const { Vender } = require("../models/venderModel");
// const { client } = require("../config/db");
const { Tocken } = require("../models/tockenModel");
const { sequelize } = require("../config/db");

const jwt = require("jsonwebtoken")

exports.createVender = async (req, res) => {
    let body = req.body;
    // console.log(body)
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
        let body = [venderData];
        // console.log(venderData.status);
        if(venderData.status === "deactivate"){
            res.status(201).json({"message" : "Vender is not active"})
        }else{
        if(body[0]===null){
            res.status(201).json({"message" : "Vender not found"})
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
         const token = jwt.sign({userid:id},"WITHIYC");
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
        // console.log(error)
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
        // console.log(vender)

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

exports.venderincCount = async (req,res)=>{
    let venderid = req.body.venderId;
    try {
               const incrementValue = 1
                const updateQuery = {
                    count: sequelize.literal(`count + ${incrementValue}`), 
                  };
                  const [updatedRows] = await Vender.update(updateQuery, { where: { id : venderid} });
                  if(updatedRows > 0){
                    res.status(200).json ({});
                  }else{
                    res.status(400).json({message : "No one present with the id"});
                  }
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender Inccount route"});
    }
}

exports.venderdecCount = async (req,res)=>{
    let venderid = req.body.venderId;
    try {
               const incrementValue = -1
                const updateQuery = {
                    count: sequelize.literal(`count + ${incrementValue}`), 
                  };
                  const [updatedRows] = await Vender.update(updateQuery, { where: { id : venderid} });
                  if(updatedRows > 0){
                    res.status(200).json ({});
                  }else{
                    res.status(400).json({message : "No one present with the id"});
                  }
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender Inccount route"});
    }
}
 
exports.venderStatistics = async (req,res) => {
    let venderid = req.body.venderId;
    try {
        const vender = await Vender.findByPk(venderid, { attributes: ['count'] });

         // Get the total sum of the count column for all vendors
        const totalVendorCount = await Vender.sum('count');
        let othersscount = totalVendorCount-vender.count
        let yourcount = vender.count
        res.status(200).json({yourcount,othersscount})


    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender Inccount route"});
    }
}

exports.vendertopScore = async (req,res) => {
    let venderid = req.body.venderId;

    try {
        const topVendors = await Vender.findAll({
            order: [['count', 'DESC']], // Order by the 'count' column in descending order
            limit: 3, // Limit the result to 3 records
          });

          res.status(200).json(topVendors);
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender topthree route"});
    }
}

exports.venderscoreASC = async (req,res) => {
    try {
        const ascendingOrder = await Vender.findAll({
            order: [['count', 'ASC']], 
          });
          res.status(200).json(ascendingOrder);
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender ASC route"});
    }
}

exports.venderscoreDESC = async (req,res) =>{
    try {
        const descendingOrder = await Vender.findAll({
            order: [['count', 'DESC']],
          });
          res.status(200).json(descendingOrder);
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender DESC route"});
    }
}

exports.vendernameASC = async (req,res) => {
    try {
        const vendors = await Vender.findAll({
            order: [['name', 'ASC']], // Order by the 'username' column in ascending order
          });

          res.status(200).json(vendors);
        
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender ASC route"});
    }
}


exports.findVender = async (req,res)=>{
    const key = req.params['key']
    const value = req.params['value']
    console.log(key,value)
    try {
        const lowerCaseValue = value.toLowerCase(); // Convert the query value to lowercase

        const vender = await Vender.findAll({
          where: sequelize.where(sequelize.fn('LOWER', sequelize.col(key)), lowerCaseValue),
        });
        res.status(200).json(vender);
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Some thing went wrong in the users search route"});
    }
}



exports.venderLogout = async (req,res) =>{
    try {
        let [tokenSyn, token] = req.headers.authorization.trim().split(" ");

        body = {
            tocken : token
        }

        let black =  await Tocken.create(body);

        // let blacklisting = await client.SADD("blackTokens", token);

        res.status(200).json({});
        
    } catch (error) {
        res.status(500).json({message : "Something went wrong in the vender logout route"});
    }
}