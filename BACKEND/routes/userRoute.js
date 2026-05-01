import express from "express";
import User from "../Models/User.js";
import { getAllUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/",getAllUser);

export default userRouter;