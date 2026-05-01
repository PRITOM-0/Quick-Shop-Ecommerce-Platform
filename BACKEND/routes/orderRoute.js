import express from "express";
import { createOrder,getAllOrders,updateOrderStatus,deleteOrder,getOneOrder} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/add", createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/:orderId", getOneOrder);
orderRouter.post("/update", updateOrderStatus);
orderRouter.post("/delete", deleteOrder);

export default orderRouter;