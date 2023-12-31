const jwt = require("jsonwebtoken");
require("dotenv").config();

function adminAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, process.env.secrete, (err, decoded) => {
    if (decoded) {
      // console.log(decoded);
      if (decoded.role == "admin") {
        next();
      }
    } else {
      res.json({ msg: "You are not Authorized!!" });
    }
  });
}

module.exports = { adminAuth };
