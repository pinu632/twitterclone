
import express from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";
import { getme } from "../controllers/auth.controller.js";

router.get("/me",protectRoute,getme);
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);




export default router;