import Order from "../Models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, items, totalAmount, address, status } = req.body;
    const Code = `QSO-${Date.now().toString().slice(-5)}`;
    const newOrder = new Order({
      user,
      items,
      totalAmount,
      address,
      status,
      Code,
    });

    const order = await newOrder.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create order", error });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = (await Order.find().populate("user", "name email").populate("address").populate("items.product", "title price")).toSorted((a, b) => b.createdAt - a.createdAt);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
  

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error });
  }
};

export const getOneOrder = async (req, res) => {
 
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user","name email")
      .populate("address")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

