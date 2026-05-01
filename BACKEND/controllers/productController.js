import Product from "../Models/Product.js";

//Create

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    if (!product) {
      return res.status(400).json({
        message: "Invalid product data !",
      });
    }
    res.status(200).json({
      message: "Product created successfully !",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Invalid product data !",
      error,
    });
  }
};
export const getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All Product ",
      Products: allProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "server Error",
      error,
    });
  }
};
export const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found !",
      });
    }
    res.status(200).json({
      message: "Product found !",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "server Error",
      error,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "Product Updated !",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "server Error",
      error,
    });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Product Deleted !",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "server Error",
      error,
    });
  }
};
