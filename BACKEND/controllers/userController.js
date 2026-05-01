import User from "../Models/User.js";

export const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "All User ",
      User: allUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "server Error",
      error,
    });
  }
};
