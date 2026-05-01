import Cart from "../Models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      await Cart.create({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (item) => item.productId.toString() === productId,
      );
      if (!item) {
        cart.items.push({ productId, quantity: 1 });
      } else {
        item.quantity += 1;
      }
      await cart.save();
    }
    res
      .status(200)
      .json({ message: "Product added to cart successfully !", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found !" });
    }
    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item) {
      return res.status(400).json({ message: "Product not found in cart !" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId,
    );

    await cart.save();
    res
      .status(200)
      .json({ message: "Product removed from cart successfully !", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found !" });
    }
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared successfully !", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const updateQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(400).json({ message: "Cart not found !" });
    }
    const item = cart.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (!item) {
      return res.status(400).json({ message: "Product not found in cart !" });
    }
    item.quantity = quantity;
    await cart.save();
    res.status(200).json({ message: "Cart updated successfully !", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.status(400).json({ message: "Cart not found !" });
    }
    res.status(200).json({ message: "Cart fetched successfully !", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
