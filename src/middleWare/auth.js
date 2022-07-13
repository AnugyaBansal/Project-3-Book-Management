const jwt = require("jsonwebtoken");
const booksModel = require("../models/booksModel");
const userModel = require("../models/userModel");
const Authentication = function (req, res, next) {
    try {
    token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, message: "token must be present " })
  
    jwt.verify(token, "group11-project3",function(err,data){
        if(err) return res.status(401).send({status:false, message:"token is not valid"})
    
    else {req.userdata = data}
    next()
    })
    } catch (err) {
        res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

let Auth2= async function (req, res, next) {
    try {
      let token = req.headers["x-api-key"];
  
      let decodeToken = jwt.verify(token, "group11-project3" );
      if (Object.keys(req.body).length == 0) { return res.status(400).send({ status: false, message: "Please provide your Book details in body" }) };

      
      let requestUserId = req.body.userId 
      if(!requestUserId) return res.status(400).send({err:"please enter userID"}) 
  
      if(requestUserId.length != 24) return res.status(400).send({ message: "enter valid userID" });
  
     const userloggId = await userModel.findOne({ _id: requestUserId });
      if (! userloggId) return res.status(404).send({ err: "UserID not found " });
      let userLoggin = decodeToken.userId
      if (userloggId._id!= userLoggin)
        return res.status(403).send({ message: "logedin user is not authorized To create book"});
  
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ err: error.message });
    }
  }; 

let AuthByQuery = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];

        let decodeToken = jwt.verify(token, "group11-project3");

        let requestBookId = req.params.bookId
        if (requestBookId.length != 24)
            return res.status(400).send({ message: "enter valid bookid" });

        let findBookID = await booksModel.findById({ _id: requestBookId });
        if (!findBookID) return res.status(404).send({ err: "Book not found " });

        let userLogin = decodeToken.userId
        if (findBookID.userId != userLogin)
            return res.status(403).send({ message: "logedin user is not authorized " });

        next();
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};


module.exports = { Authentication, Auth2, AuthByQuery };
