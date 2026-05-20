const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Middleware to protect routes

const protect = async (req,res,next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1]; //Extract token
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decode.id).select("-password");
            next();
        }else{
            res.status(401).json({message: "NOt authorized, no token"});
        }
    } catch (error) {
        res.status(401).json({message: "token failed", error:error.message});
    }
};

//Middleware for Admin- only access
const adminOnly = (req,res,next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({message: "access denied, admin only"});
    }
}

module.exports = {protect,adminOnly}