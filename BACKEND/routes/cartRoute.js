import express from "express";
import {
  addToCart,
  removeFromCart,
  updateQty,
  clearCart,
  getCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.post("/remove", removeFromCart);
cartRouter.post("/clear", clearCart);
cartRouter.post("/update", updateQty);
cartRouter.get("/:userId", getCart);
export default cartRouter;
