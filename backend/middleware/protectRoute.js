import User from "../models/user.model.js";
import JWT_SECRET from "../util/jwtsecret.js";
import jwt from "jsonwebtoken";


export const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"unauthorized and No token provoded"});
            
        }

        const decoded = jwt.verify(token,JWT_SECRET);

        if(!decoded){
            return res.status(401).json({error:"Invalid token"});

        }

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        req.user = user;
        next();

    } catch (error) {
        console.log("error in protected middleware",error.message);
        return res.status(500).json({error:"internal server error"});
    }
}