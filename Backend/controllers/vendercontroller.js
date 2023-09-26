const { Vender } = require("../models/venderModel");
// const { client } = require("../config/db");
const { Tocken } = require("../models/tockenModel");
const { Users } = require("../models/userModel");
const { sequelize } = require("../config/db");
const { Sequelize, DataTypes, Op } = require('sequelize');

const axios =  require("axios")

const jwt = require("jsonwebtoken");

exports.createVender = async (req, res) => {
  let body = req.body;
  // console.log(body)
  try {
    let vender = await Vender.create(body);
    res.status(201).json(vender);
  } catch (error) {
    res.status(409).json({ message: "Vender already exist" });
  }
};

exports.getOTP = async (req, res) => {
  let { number } = req.body;
  try {
    let venderData = await Vender.findOne({ where: { number: number } });
    let body = [venderData];
    // console.log(venderData.status);
    if (venderData.status === "deactivate") {
      res.status(201).json({ message: "Vender is not active" });
    } else {
      if (body[0] === null) {
        res.status(201).json({ message: "Vender not found" });
      } else {
        // function generateRandomNumbers() {
        //   const randomNumbers = [];

        //   for (let i = 0; i < 6; i++) {
        //     const randomNumber = Math.floor(Math.random() * 10); // Change the range as needed
        //     randomNumbers.push(randomNumber);
        //   }

        //   return randomNumbers;
        // }
        // const sixRandomNumbers = generateRandomNumbers();
        // let value = sixRandomNumbers.join("");
        // updateData = { otp: value };
        // await Vender.update(updateData, { where: { id: venderData.id } });

        let binaryData =`[{"V":"1.5","ORG":"IYC","SESSION_ID":"TGMJGnhY5jhiqNHwjwuH/+2LbKrt0oc1j1zlGbbXXotzXjscBO4xBDs9Up0IIwAi","DEVICE_ID":"cdbbed0a-1989-4fa7-859f-fc47dab6992a","USER_ID":"d93Cdd+nBmvbpw9g/4Wc7A==","LATITUDE":"","LONGITUDE":"","STATE_CODE":"","MOBILE":${number}}]`
        const base64Encoded = Buffer.from(binaryData).toString('base64');
        // console.log(base64Encoded);

        const url = 'https://api.ycea.in/ycea/ycea-api/service/iyc/api/v1.0/auth/getOTP.php'; 
        const token = '72c831476bfc479d:4efb65f092ac72c83147'; 

        const dataToSend = base64Encoded ;

        const headers ={
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${token}`,
            'Token': 'TGMJGnhY5jhiqNHwjwuH/+2LbKrt0oc1j1zlGbbXXotzXjscBO4xBDs9Up0IIwAi',
        };

        const response = await axios.post(url, dataToSend, { headers });

        let base64Dncoded = response.data
        const decodedText = atob(base64Dncoded);
        const jsonObject = JSON.parse(decodedText);
        // console.log(jsonObject)
        if(jsonObject.status == "SUCCESS"){
            res.status(200).json({});
        }else{
            res.status(400).json({ message: "Send OTP is not working" });
        }
      }
    }
  } catch (error) {
    console.log(error)
    res.status(402).json({ message: "Not authorized" });
  }
};

exports.validateOTP = async (req, res) => {
  let { number , otp } = req.body;
  let venderData = await Vender.findOne({ where: { number: number } });
  let id = venderData.id
  try {
    let binaryData = `[{"V":"1.5","ORG":"IYC","SESSION_ID":"TGMJGnhY5jhiqNHwjwuH/+2LbKrt0oc1j1zlGbbXXotzXjscBO4xBDs9Up0IIwAi","DEVICE_ID":"cdbbed0a-1989-4fa7-859f-fc47dab6992a","USER_ID":"d93Cdd+nBmvbpw9g/4Wc7A==","LATITUDE":"3.989234383434343","LONGITUDE":"9.034342423423","STATE_CODE":"KA","MOBILE":${number},"OTP":${otp}}]`
        const base64Encoded = Buffer.from(binaryData).toString('base64');
        // console.log(base64Encoded);

        const url = 'https://api.ycea.in/ycea/ycea-api/service/iyc/api/v1.0/auth/validateOTP.php'; 
        const tokens = '72c831476bfc479d:4efb65f092ac72c83147'; 

        const dataToSend = base64Encoded ;

        const headers ={
            'Content-Type': 'text/plain',
            'Authorization': `Bearer ${tokens}`,
            'Token': 'TGMJGnhY5jhiqNHwjwuH/+2LbKrt0oc1j1zlGbbXXotzXjscBO4xBDs9Up0IIwAi',
        };

        const response = await axios.post(url, dataToSend, { headers });

        let base64Dncoded = response.data
        const decodedText = atob(base64Dncoded);
        const jsonObject = JSON.parse(decodedText);
        console.log(jsonObject)
    if (jsonObject.status == "SUCCESS") {
      const token = jwt.sign({ userid: id }, "WITHIYC");
      res
        .status(200)
        .json({
          Access_Token: token,
          vender: {
            name: venderData.name,
            number: venderData.number,
            role: venderData.role,
          },
        });
    } else {
      res.status(400).json({ message: "wrong otp entered" });
    }
  } catch (error) {
    res.status(500).json({ message: "wrong otp entered" });
  }
};

exports.updateVenderbyid = async (req, res) => {
  let ID = req.params["id"];
  let updateData = req.body;
  try {
    let updated = await Vender.update(updateData, { where: { id: ID } });

    if (updated[0] == 1) {
      let user = await Vender.findOne({ where: { id: ID } });
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "No one present with the id" });
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong with the route" });
  }
};

exports.updateVenderbyauth = async (req,res) => {
    let ID = req.body.venderId;
    let updateData = req.body;
    try {
    let updated = await Vender.update(updateData, { where: { id: ID } });

    if (updated[0] == 1) {
      let user = await Vender.findOne({ where: { id: ID } });
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "No one present with the id" });
    }
        
    } catch (error) {
        res.status(500).json({ message: "something went wrong with the route" });
    }
}



exports.deleteVender = async (req, res) => {
  let ID = req.params["id"];
  // console.log(ID)
  try {
    // res.send({id: ID})
    let deleted = await Vender.destroy({ where: { id: ID } });

    if (deleted == 1) {
      res.status(200).json({});
    } else {
      res.status(400).json({ message: "There is no Vender with the id" });
    }
  } catch (error) {
    // console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong in the vender delete route" });
  }
};

exports.getoneVender = async (req, res) => {
  let ID = req.params["id"];
  try {
    let vender = await Vender.findOne({ where: { id: ID } });
    res.status(200).json(vender);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender getone route" });
  }
};

exports.getallVender = async (req, res) => {
  try {
    let vender = await Vender.findAndCountAll();
    // console.log(vender)

    res.status(201).json(vender.rows);
  } catch (error) {
    res.status(500).json({ message: "something went wrong with the route" });
  }
};


exports.getWorkers = async (req,res) => {
  try {
    const vendors = await Vender.findAll({
      where: {
        role: 'worker',
      },
    });
    res.status(200).send(vendors);
  } catch (error) {
    res.status(500).json({ message: "something went wrong with the route" });
  }
}

exports.getInspectors = async (req,res) => {
  try {
    const vendors = await Vender.findAll({
      where: {
        role: 'inspector',
      },
    });
    res.status(200).send(vendors);
  } catch (error) {
    res.status(500).json({ message: "something went wrong with the route" });
  }
}


exports.getcoutallVender = async (req, res) => {
  try {
    console.log(1)
    let vendercount = await Vender.count();
    const workerVenders = await Vender.count({
      where: {
        role: 'worker',
      },
    });
    const inspectorVenders = await Vender.count({
      where: {
        role: 'inspector',
      },
    });
    res.status(200).json({ vendercount: vendercount , workercount : workerVenders , inspectorcount : inspectorVenders});
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong in the vender getcount route" });
  }
};

exports.venderincCount = async (req, res) => {
  let venderid = req.body.venderId;
  try {
    const incrementValue = 1;
    const updateQuery = {
      count: sequelize.literal(`count + ${incrementValue}`),
    };
    const [updatedRows] = await Vender.update(updateQuery, {
      where: { id: venderid },
    });
    if (updatedRows > 0) {
      res.status(200).json({});
    } else {
      res.status(400).json({ message: "No one present with the id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender Inccount route" });
  }
};

exports.venderdecCount = async (req, res) => {
  let venderid = req.body.venderId;
  try {
    const incrementValue = -1;
    const updateQuery = {
      count: sequelize.literal(`count + ${incrementValue}`),
    };
    const [updatedRows] = await Vender.update(updateQuery, {
      where: { id: venderid },
    });
    if (updatedRows > 0) {
      res.status(200).json({});
    } else {
      res.status(400).json({ message: "No one present with the id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender Inccount route" });
  }
};

exports.venderStatistics = async (req, res) => {
  let venderid = req.body.venderId;
  try {
    const vender = await Vender.findByPk(venderid, { attributes: ["count"] });

    // Get the total sum of the count column for all vendors
    const totalVendorCount = await Vender.sum("count");
    let othersscount = totalVendorCount - vender.count;
    let yourcount = vender.count;
    res.status(200).json({ yourcount, othersscount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender Inccount route" });
  }
};

exports.vendertopScore = async (req, res) => {
  let venderid = req.body.venderId;

  try {
    const topVendors = await Vender.findAll({
      order: [["count", "DESC"]], // Order by the 'count' column in descending order
      limit: 3, // Limit the result to 3 records
    });

    res.status(200).json(topVendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender topthree route" });
  }
};

exports.venderscoreASC = async (req, res) => {
  try {
    const ascendingOrder = await Vender.findAll({
      order: [["count", "ASC"]],
    });
    res.status(200).json(ascendingOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender ASC route" });
  }
};

exports.venderscoreDESC = async (req, res) => {
  try {
    const descendingOrder = await Vender.findAll({
      order: [["count", "DESC"]],
    });
    res.status(200).json(descendingOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender DESC route" });
  }
};

exports.vendernameASC = async (req, res) => {
  try {
    const vendors = await Vender.findAll({
      order: [["name", "ASC"]], // Order by the 'username' column in ascending order
    });

    res.status(200).json(vendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender ASC route" });
  }
};

exports.workergetASC = async (req,res) => {
  try {
    const workerVendors = await Vender.findAll({
      where: {
        role: 'worker',
      },
      order: [['name', 'ASC']], // Order by 'name' in ascending order
    });
    res.status(200).send(workerVendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender ASC route" });
  }
};


exports.workergetDESC = async (req,res) => {
  try {
    const workerVendors = await Vender.findAll({
      where: {
        role: 'worker',
      },
      order: [['name', 'DESC']], // Order by 'name' in ascending order
    });
    res.status(200).send(workerVendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender ASC route" });
  }
};

exports.inspectorgetASC = async (req,res) => {
  try {
    const inspectorVendors = await Vender.findAll({
      where: {
        role: 'inspector',
      },
      order: [['name', 'ASC']], // Order by 'name' in ascending order
    });
    res.status(200).send(inspectorVendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender ASC route" });
  }
};

exports.inspectorgetDESC = async (req,res) => {
  try {
    const inspectorVendors = await Vender.findAll({
      where: {
        role: 'inspector',
      },
      order: [['name', 'DESC']], // Order by 'name' in ascending order
    });
    res.status(200).send(inspectorVendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender ASC route" });
  }
}

exports.findVender = async (req, res) => {
  const key = req.params["key"];
  const value = req.params["value"];
  console.log(key, value);
  try {
    const lowerCaseValue = value.toLowerCase(); // Convert the query value to lowercase

    const vender = await Vender.findAll({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col(key)),
        lowerCaseValue
      ),
    });
    res.status(200).json(vender);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Some thing went wrong in the users search route" });
  }
};

exports.venderLogout = async (req, res) => {
  try {
    let [tokenSyn, token] = req.headers.authorization.trim().split(" ");

    body = {
      tocken: token,
    };

    let black = await Tocken.create(body);

    // let blacklisting = await client.SADD("blackTokens", token);

    res.status(200).json({});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong in the vender logout route" });
  }
};

exports.assignVender = async (req, res) => {
  const venderid = req.params["venderid"];
  const userid = req.params["userid"];
  // console.log(venderid,userid);
  try {
    const [updatedRowCount] = await Users.update(
      { venderID: venderid },
      {
        where: { id: userid },
      }
    );

    if (updatedRowCount === 1) {
      let user = await Users.findOne({ where: { id: userid } });
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "No one present with the id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong with the assignVender route" });
  }
};

exports.assignWorker = async (req, res) => {
  let adminId = req.body.venderId
  const venderid = req.params["venderid"];
  const recordcount = Number(req.params["recordcount"]);
  // console.log(venderid,recordcount)
  try {

    const count = await Users.count({
      where: {
        venderStatus: '',
        venderID: 0,
      },
    });

    if(count >= recordcount){
      const vendor = await Vender.findOne({
        where: {
          id: venderid,
          role: "worker",
        },
      });
  
      if(vendor){
        const [updatedRowCount] = await Users.update(
          { venderID: venderid }, // Set the new venderID value here
          {
            where: {
              venderStatus: "",
              venderID: 0,
            },
            limit: recordcount, // Limit the number of records to update
          }
        );
        const vender = await Vender.findByPk(venderid);
        const newHistoryEntry = {
          adminId : adminId,
          action: "assigned",
          date: new Date().toISOString().slice(0, 10), // Current date in 'YYYY-MM-DD' format
          time: new Date().toISOString().slice(11, 19), // Current time in 'HH:MM:SS' format
          recordcount: recordcount,
        };
        vender.history.push(newHistoryEntry);
        updateQuery = { history: vender.history };
        const [updatedRows] = await Vender.update(updateQuery, {
          where: { id: venderid },
        });
        res.status(200).send({});
      }else{
        res
        .status(400)
        .json({ message: "There is no vender with this id or is not a worker" });
      }
    }else{
      res
      .status(400)
      .json({ message: `There are only ${count} records left to assign` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong with the assignwork route" });
  }
};



exports.releaveWorker = async (req, res) => {
  let adminId = req.body.venderId
  const venderid = req.params["venderid"];
  // console.log(venderid);
  try {
    const count = await Users.count({
      where: {
        venderStatus: '',
        venderID: venderid,
      },
    });
      const vendor = await Vender.findOne({
        where: {
          id: venderid,
          role: "worker",
        },
      });
  
      if(vendor){
        if(count == 0){
          res.status(400).send({"message" : "There are no records to realeav"});
        }else{
          const [updatedRowCount] = await Users.update(
            { venderID: 0 }, // Set the new venderID value here
            {
              where: {
                venderStatus: "",
                venderID: venderid,
              },
            }
          );
      
          const vender = await Vender.findByPk(venderid);
          const newHistoryEntry = {
            adimId : adminId,
            action: "released",
            date: new Date().toISOString().slice(0, 10), // Current date in 'YYYY-MM-DD' format
            time: new Date().toISOString().slice(11, 19), // Current time in 'HH:MM:SS' format
            recordcount: updatedRowCount,
          };
      
          vender.history.push(newHistoryEntry);
          //   console.log(vender.history)
          updateQuery = { history: vender.history };
          //   console.log(updateQuery)
          const [updatedRows] = await Vender.update(updateQuery, {
            where: { id: venderid },
          });
      
          res.status(200).send({releavecount : count});

        }
      }else{
        res
        .status(400)
        .json({ message: "There is no vender with this id or is not a worker" });
      }
    
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong with the releavevender route" });
  }
};



exports.assignInspector = async (req, res) => {
  let adminId = req.body.venderId
  const venderid = req.params["venderid"];
  const recordcount = Number(req.params["recordcount"]);
  try {
    const vendor = await Vender.findOne({
      where: {
        id: venderid,
        role: "inspector",
      },
    });
    if(vendor){
      const count = await Users.count({
        where: {
          status: "not_verified",
          venderStatus: {
            [Op.in]: ['onhold', 'reject', 'inprocess'],
          },
          inspectorId: 0,
        },
      });
      if(count >= recordcount){
        const [updatedRowCount] = await Users.update(
          { inspectorId: venderid }, // Set the new venderID value here
          {
            where: {
              status: "not_verified",
              inspectorId: 0,
              venderStatus: {
                [Op.in]: ['onhold', 'reject', 'inprocess'],
              },
            },
            limit: recordcount, // Limit the number of records to update
          }
        );
    
        const vender = await Vender.findByPk(venderid);
        const newHistoryEntry = {
          adminId : adminId,
          action: "assigned",
          date: new Date().toISOString().slice(0, 10), // Current date in 'YYYY-MM-DD' format
          time: new Date().toISOString().slice(11, 19), // Current time in 'HH:MM:SS' format
          recordcount: recordcount,
        };
        vender.history.push(newHistoryEntry);
        updateQuery = { history: vender.history };
        const [updatedRows] = await Vender.update(updateQuery, {
          where: { id: venderid },
        });
        res.status(200).send({});
      }else{
        res
      .status(400)
      .json({ message: `There are only ${count} records left to assign` });

      }
    }else{
      res
      .status(400)
      .json({ message: "There is no vender with this id or he is not an inspector" });
    }
   
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "something went wrong with the assigninspector route" });
  }
};

exports.releaveInspector = async (req, res) => {
  let adminId = req.body.venderId
  const venderid = req.params["venderid"];
  console.log(venderid);
  try {
    const vendor = await Vender.findOne({
      where: {
        id: venderid,
        role: "inspector",
      },
    });
    const count = await Users.count({
      where: {
        status: "not_verified",
        inspectorId : venderid,
      },
    });
    if(vendor){
      if(count == 0){
        res.status(400).send({"message" : "There are no records to realeav"})
      }else{
        const [updatedRowCount] = await Users.update(
          { inspectorId: 0 }, // Set the new venderID value here
          {
            where: {
              status: "not_verified",
              inspectorId : venderid,
            },
          }
        );
    
        const vender = await Vender.findByPk(venderid);
        const newHistoryEntry = {
          adimId : adminId,
          action: "released",
          date: new Date().toISOString().slice(0, 10), // Current date in 'YYYY-MM-DD' format
          time: new Date().toISOString().slice(11, 19), // Current time in 'HH:MM:SS' format
          recordcount: updatedRowCount,
        };
    
        vender.history.push(newHistoryEntry);
        //   console.log(vender.history)
        updateQuery = { history: vender.history };
        //   console.log(updateQuery)
        const [updatedRows] = await Vender.update(updateQuery, {
          where: { id: venderid },
        });
    
        res.status(200).send({releavecount : count});
      }

    }else{
      res
        .status(400)
        .json({ message: "There is no vender with this id or is not a inspector" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "something went wrong with the releavevender route" });
  }
};

// exports.getStatisticsbyid = async (req, res) => {
//   const venderid = req.params["venderid"];
//   // console.log(venderid)
//   try {
//     const results = await Users.findAll({
//       attributes: ["status", [sequelize.fn("COUNT", "status"), "count"]],
//       where: {
//         venderID: venderid,
//       },
//       group: ["status"],
//     });
//     console.log(results)
//     if(results.length == 0){
//         res.status(200).send({"verifiedcount" : 0,"not_verifiedcount" : 0});
//     }else if(results.length == 1){
//         console.log(results)
//         let status = results[0].status
//         let count = results[0].dataValues.count
//         if(status =="verified"){
//             res.status(200).send({"verifiedcount" : count,"not_verifiedcount" : 0});
//         }else{
//             res.status(200).send({"verifiedcount" : 0,"not_verifiedcount" : count});
//         }
//     }else{
//         // let user1 = results[0]
//         // console.log(user1.dataValues.count)
//         let count1 = results[0].dataValues.count
//         let count2 = results[1].dataValues.count
//         res.status(200).send({"verifiedcount" : count1,"not_verifiedcount" : count2});
//     }
//   } catch (error) {
//     // console.log(error)
//     res
//       .status(500)
//       .json({
//         message: "something went wrong with the getStatisticsbyid route",
//       });
//   }
// };

// exports.getStatisticsbyauth = async (req, res) => {
//   ID = req.body.venderId;
//   try {
//     const results = await Users.findAll({
//       attributes: ["status", [sequelize.fn("COUNT", "status"), "count"]],
//       where: {
//         venderID: ID,
//       },
//       group: ["status"],
//     });
//     if(results.length == 0){
//         res.status(200).send({"verifiedcount" : 0,"not_verifiedcount" : 0});
//     }else if(results.length == 1){
//         console.log(results)
//         let status = results[0].status
//         let count = results[0].dataValues.count
//         if(status =="verified"){
//             res.status(200).send({"verifiedcount" : count,"not_verifiedcount" : 0});
//         }else{
//             res.status(200).send({"verifiedcount" : 0,"not_verifiedcount" : count});
//         }
//     }else{
//         // let user1 = results[0]
//         // console.log(user1.dataValues.count)
//         let count1 = results[0].dataValues.count
//         let count2 = results[1].dataValues.count
//         res.status(200).send({"verifiedcount" : count1,"not_verifiedcount" : count2});
//     }
//   } catch (error) {
//     // console.log(error)
//     res
//       .status(500)
//       .json({
//         message: "something went wrong with the getStatisticsbyid route",
//       });
//   }
// };


exports.getStatisticsbyworkerid = async (req,res) => {
  const workerid = req.params["workerid"];
try {
  const countWithStatusonhold = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: "onhold"
    },
  });
  const countWithStatusinprocess = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: "inprocess"
    },
  });
  const countWithStatusreject = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: "reject"
    },
  });
  let countWithStatus = countWithStatusonhold+countWithStatusinprocess+countWithStatusreject
  console.log(countWithStatus)
  const countWithEmptyStatus = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: '',
    },
  });
  res.status(200).send({"onholdcount": countWithStatusonhold, "onprocesscount" : countWithStatusinprocess , "rejectcount" : countWithStatusreject ,"emptycount" : countWithEmptyStatus})
} catch (error) {
  console.log(error)
  res
  .status(500)
  .json({ message: "something went wrong with the getStatisticsbyworkerid route" });
}
};

exports.getStatisticsbyworkerauth = async (req,res) => {
  const workerid = req.body.venderId
try {
  const countWithStatusonhold = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: "onhold"
    },
  });
  const countWithStatusinprocess = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: "inprocess"
    },
  });
  const countWithStatusreject = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: "reject"
    },
  });
  let countWithStatus = countWithStatusonhold+countWithStatusinprocess+countWithStatusreject
  // console.log(countWithStatus)
  const countWithEmptyStatus = await Users.count({
    where: {
      venderID: workerid,
      venderStatus: '',
    },
  });
  res.status(200).send({"onholdcount": countWithStatusonhold, "onprocesscount" : countWithStatusinprocess , "rejectcount" : countWithStatusreject ,"emptycount" : countWithEmptyStatus})
} catch (error) {
  console.log(error)
  res
  .status(500)
  .json({ message: "something went wrong with the getStatisticsbyworkerid route" });
}
}

exports.getStatisticsbyinspectorid = async (req,res) => {
  const workerid = req.params["inspectorid"];
try {
  const countWithStatusverified = await Users.count({
    where: {
      inspectorId: workerid,
      status: "verified"
    },
  });
  const countWithStatusverification_failed = await Users.count({
    where: {
      inspectorId: workerid,
      status: "verification_failed"
    },
  });
  let countWithStatus = countWithStatusverified+countWithStatusverification_failed
  console.log(countWithStatus)
  const countWithEmptyStatus = await Users.count({
    where: {
      inspectorId: workerid,
      status: 'not_verified',
    },
  });
  res.status(200).send({"verifiedcount" : countWithStatusverified ,  "verification_failedcount" : countWithStatusverification_failed , "empetycount" : countWithEmptyStatus})
} catch (error) {
  console.log(error)
  res
  .status(500)
  .json({ message: "something went wrong with the getStatisticsbyworkerid route" });
}
};


exports.getStatisticsbyinspectorauth = async (req,res) => {
  const workerid = req.body.venderId
try {
  const countWithStatusverified = await Users.count({
    where: {
      inspectorId: workerid,
      status: "verified"
    },
  });
  const countWithStatusverification_failed = await Users.count({
    where: {
      inspectorId: workerid,
      status: "verification_failed"
    },
  });
  let countWithStatus = countWithStatusverified+countWithStatusverification_failed
  console.log(countWithStatus)
  const countWithEmptyStatus = await Users.count({
    where: {
      inspectorId: workerid,
      status: 'not_verified',
    },
  });
  res.status(200).send({"verifiedcount" : countWithStatusverified ,  "verification_failedcount" : countWithStatusverification_failed , "empetycount" : countWithEmptyStatus})
} catch (error) {
  console.log(error)
  res
  .status(500)
  .json({ message: "something went wrong with the getStatisticsbyworkerid route" });
}
};




exports.getcountofnotassignedUserstoworker = async (req, res) => {
  try {
    const count = await Users.count({
      where: {
        venderStatus: '',
        venderID: 0,
      },
    });
    res.status(200).send({ count: count });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "something went wrong with the getcountofnotassignedUsers route",
      });
  }
};

exports.getcountofnotassignedUserstoinspectors = async (req,res) =>{
  try {
    const count = await Users.count({
      where: {
        status: "not_verified",
        venderStatus: {
          [Op.in]: ['onhold', 'reject', 'inprocess'],
        },
        inspectorId: 0,
      },
    });
    res.status(200).send({ count: count });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          "something went wrong with the getcountofnotassignedUsers route",
      });
  }
};


exports.getworkerassignedallUsers = async (req,res) => {
  ID = req.body.venderId
  try {
    const users = await Users.findAll({
      where: {
        venderID: ID,
      },
    });
    res.status(200).send(users)
  } catch (error) {
    res
    .status(500)
    .json({
      message:
        "something went wrong with the getworkerassignedallUsers route",
    });
  }
};


exports.getworkerverifiedUsers = async (req,res) => {
  ID = req.body.venderId;
  try {
    const users = await Users.findAll({
      where: {
        venderID: ID,
        venderStatus: {
          [Op.in]: ['inprocess', 'onhold', 'reject'],
        },
      },
    });
    res.status(200).send(users)
  } catch (error) {
    res
    .status(500)
    .json({
      message:
        "something went wrong with the getworkerverifiedUsers route",
    });
  }
}

exports.getworkernotverifiedUsers = async (req,res) => {
  ID = req.body.venderId;
  try {
    const users = await Users.findAll({
      where: {
        venderID: ID,
        venderStatus: "",
      },
    });
    res.status(200).send(users)
  } catch (error) {
    res
    .status(500)
    .json({
      message:
        "something went wrong with the getworkerverifiedUsers route",
    });
  }
}


exports.getinspectorallassignedUsers = async (req, res) => {
    ID = req.body.venderId;
    try {
        const users = await Users.findAll({
            where: {
              inspectorId: ID,
            },
          });
      
          res.status(200).send(users)
    } catch (error) {
        res
      .status(500)
      .json({
        message:
          "something went wrong with the getinspectorallassignedUsers route",
      });
    }
};


exports.getinspectornotverifiedUsers = async (req, res) => {
    ID = req.body.venderId;
    try {
        const users = await Users.findAll({
            where: {
              inspectorId: ID,
              status: 'not_verified',
            },
          });
      
          res.status(200).send(users)
    } catch (error) {
        res
      .status(500)
      .json({
        message:
          "something went wrong with the getinspectornotverifiedUsers route",
      });
    }
};

exports.getinspectorverifiedUsers = async (req,res) => {
    ID = req.body.venderId;
    // sdfasdfasdfsdf
    try {
        const users = await Users.findAll({
            where: {
              inspectorId: ID,
              status: {
                [Op.in]: ['verified', 'verification_failed'],
              },
            },
          });
      res.status(200).send(users)
    } catch (error) {
        res
      .status(500)
      .json({
        message:
          "something went wrong with the getinspectorverifiedUsers route",
      });
    }
}