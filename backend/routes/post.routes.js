import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();
import { createPost, deletePost, likeUnlikePost } from "../controllers/post.controller.js";
import { commentPost } from "../controllers/post.controller.js";
import { getAllPost } from "../controllers/post.controller.js";
import { getLikedPost } from "../controllers/post.controller.js";
import { getFollowingPost } from "../controllers/post.controller.js";
import { getUserPosts } from "../controllers/post.controller.js";





router.post('/create',protectRoute,createPost);
router.delete('/:id',protectRoute,deletePost);
router.post('/comment/:id',protectRoute,commentPost);
router.post('/like/:id',protectRoute,likeUnlikePost);
router.get('/all',protectRoute,getAllPost);
router.get('/likes/:id',protectRoute,getLikedPost);
router.get('/following',protectRoute,getFollowingPost);
router.get('/user/:username',protectRoute,getUserPosts);

export default router;