const jwt = require("jsonwebtoken");
require("dotenv").config();

function userAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.secrete, (err, decoded) => {
    if (decoded) {
      // console.log(decoded);

      if (decoded.role == "user") {
        (req.body.userID = decoded.userID),
          (req.body.userName = decoded.userName),
          next();
      }
    } else {
      res.statusMessage = "Login Required.";
      res.json({ msg: "You are not Authorized!!", status: "error" });
    }
  });
}

module.exports = { userAuth };
