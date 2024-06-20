import post from "../models/post.models.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

import Post from "../models/post.models.js";

export const createPost = async(req,res) =>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }

        if(!text && !img){
            return res.status(400).json({error:"post must have image or text"});

            
        }
if(img){
  const uploadedResponse = await cloudinary.uploader.upload(img);
  img = uploadedResponse.secure_url;
}

        const newPost = new Post({
            user:userId,
            text,
            img
        })

        await newPost.save();
        res.status(201).json(newPost);

        
    } catch (error) {
        res.status(500).json({error:error.message});
        console.log("Error in create post controller: ",error);

    }
}

export const deletePost = async (req,res) =>{
    try {
        
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"you are not authorized to delete this post"});
        }

        if(post.img){
            const imgId = post.img.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({message:"Post deleted successfully"});


    } catch (error) {
        console.log("Error in deletePost constroller: ",error);
        res.status(500).json({error:"Internal Server error"})
    }
}

export const commentPost = async (req,res) =>{
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({error:"text field is empty"});
        }
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({error:"Post not found"});
        }

      const comment = {
        user: userId,
        text,
      }

      post.comments.push(comment);
      await post.save();
      const updatedPost = await Post.findById(postId)
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

      res.status(200).json(updatedPost);
        
    } catch (error) {
      console.log("Error in comment post controller: ",error);
      res.status(500).json({error: "Internal server error"});  
    }
};

export const likeUnlikePost = async (req,res)=>{
   try {
    const userId = req.user._id;
    const{id:postId} =req.params;

    const post = await Post.findById(postId);

    if(!post){
        return res.status(400).json({error:"Post not found"});
    }

    const userLikedPost = post.likes.includes(userId);
    if(userLikedPost){
        //unliked post
        await Post.updateOne({_id:postId},{$pull:{likes:userId}});
        await User.updateOne({_id:userId},{$pull:{likedPost:postId}});

        const updatedLikes = post.likes.filter((id)=>id.toString()!== userId.toString());

        res.status(200).json(updatedLikes);
    }else{
        post.likes.push(userId);
        await User.updateOne({_id:userId},{$push:{likedPost:postId}});
        
        await post.save();

        const notification = new Notification({
            from: userId,
            to:post.user,
            type:"like",
        })
        await notification.save();
        const updatedLikes = post.likes;

        res.status(200).json(updatedLikes);
    }

    
   } catch (error) {
    console.log("error in likedUnlikedPost controller: ",error);
    res.status(500).json({error:"internal server error"});
   }
}

export const getAllPost = async (req,res) =>{
    try {
        const post = await Post.find().sort({createdAt:-1}).populate({
            path:'user',
            select:'-password',
        });

        if(post.length === 0)
            {
                return res.status(200).json([]);
            }

            res.status(200).json(post);

    } catch (error) {
        console.log("error in getAllPosts controller: ",error );
        res.status(500).json({error:"internal server error"});
    }
}

export const getLikedPost = async (req,res) =>{
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error: "User not found"});
        }

        const likedposts = await Post.find({_id:{$in: user.likedPost}})
        .populate({
            path:"user",
            select:"-password",
        })
        .populate({
            path:"comments.user",
            select:"-Password",

        })
        res.status(200).json(likedposts);

    } catch (error) {
         console.log("error in getlikedPosts controller: ",error );
        res.status(500).json({error:"internal server error"});
    }
}

export const getFollowingPost = async (req,res)=>{
    try {
          const userId = req.user._id;
          const user = await User.findById(userId);
          if(!user) return req.status(404).json({error:"user not found"});

          const following = user.following;
          const feedPost = await Post.find({user:{$in:following}})
          .sort({createdAt:-1})
          .populate({
            path:"user",
            select:'-password'
          })
          .populate({
            path:"comments.user",
            select:"-password",
          });
     res.status(200).json(feedPost);

    } catch (error) {
        console.log("error in getfollowingPosts controller: ",error );
        res.status(500).json({error:"internal server error"});
    }
}

export const getUserPosts = async (req,res)=>{
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if(!user) return res.status(404).json({error:'User not found'});

        const posts = await Post.find({user: user._id}).sort({createdAt:-1}).populate({
              path:"user",
            select:'-password'
        })
        .populate({
            path:"comments.user",
            select:"-password",
          });
     res.status(200).json(posts);



    } catch (error) {
         console.log("error in getfollowingPosts controller: ",error );
        res.status(500).json({error:"internal server error"});
    }
}