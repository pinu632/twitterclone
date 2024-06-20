import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,

    },
    username:{
        type:String,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    follower:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:[],
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            default:[],
        }
    ],

    profileImg:{
        type:String,
        default:"",
    },
    coverImg:{
        type:String,
        default:"",
    },
    bio:{
        type:String,
        default:"",
    },
    link:{
        type:String,
        default:"",
    },
    likedPost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:[],
    }],

    }
,{timestamps:true});

const User = mongoose.model("User",userSchema);
export default User;