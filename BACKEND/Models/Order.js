import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  Code:{
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true
  }
  ,
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered"],
    default: "pending"
  }
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;