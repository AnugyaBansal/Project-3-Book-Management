const jwt = require("jsonwebtoken");
const booksModel = require("../models/booksModel");

const Authentication = function (req, res, next) {
    try {
    token = req.headers["x-api-key"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present " })
  
    jwt.verify(token, "group11-project3",function(err,data){
        if(err) return res.status(401).send({status:false, msg:"token is not valid"})
    
    else {req.userdata = data}
    next()
    })
    } catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message })
    }
}

let AuthByQuery = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];

        let decodeToken = jwt.verify(token, "group11-project3");

        let requestBookId = req.params.bookId
        if (requestBookId.length != 24)
            return res.status(400).send({ msg: "enter valid bookid" });

        let findBookID = await booksModel.findById({ _id: requestBookId });
        if (!findBookID) return res.status(404).send({ err: "Book not found " });

        let userLogin = decodeToken.userId
        if (findBookID.userId != userLogin)
            return res.status(403).send({ msg: "logedin user is not authorized " });

        next();
    } catch (error) {
        return res.status(500).send({ err: error.message });
    }
};


module.exports = { Authentication, Auth2, AuthByQuery };


// module.exports ={Authentication} ;