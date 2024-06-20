import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import express from 'express';

const app = express();
app.use(bodyParser.json());


import { generateTokenAndSetCookie } from "../util/jsonwebtokengenerate.js";
export const signup = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;
        console.log(username);
        console.log(fullname);
        console.log(email);
        console.log(password);

        if (!fullname || !username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Check valid email format

        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        generateTokenAndSetCookie(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            followers: newUser.followers,
            following: newUser.following,
            profileImg: newUser.profileImg,
            coverImg: newUser.coverImg
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
};

export const login = async (req,res)=>{

try {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    const ispasswordcorrect = await bcrypt.compare(password,user?.password || "");

    if(!user || !ispasswordcorrect)
    {
        return res.status(400).json({error:"invalid username and password"});
    }

    generateTokenAndSetCookie(user._id,res);


    return res.status(201).json({
        _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg
    });

    
} catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
}

}
export const logout = async (req,res)=>{
  try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({msg:"logged out successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }

}

export const getme = async (req,res) =>{
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json({user});
    } catch (error) {
        console.error(error);
    return res.status(500).json({ error: "Server error" });
    }
}