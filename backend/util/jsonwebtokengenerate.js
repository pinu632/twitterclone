import jwt from "jsonwebtoken";
import JWT_SECRET from "./jwtsecret.js";

export const generateTokenAndSetCookie = (userId,res)=>{
    const token = jwt.sign({userId},JWT_SECRET,{
        expiresIn:"15d"
    });

    res.cookie("jwt",token,{
        maxAge:15*24*60*60*1000,//ms
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV != "developement",
    })
}