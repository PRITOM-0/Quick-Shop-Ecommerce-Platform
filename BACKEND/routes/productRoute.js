import express from "express";
import {
  createProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getAllProduct);
productRouter.get("/:id",getOneProduct);
productRouter.post("/add",createProduct);
productRouter.delete("/delete/:id",deleteProduct);
productRouter.put("/update/:id",updateProduct);

export default productRouter;
