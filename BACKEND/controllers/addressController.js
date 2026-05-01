import Address from "../Models/address.js";

export const addAddress = async (req, res) => {
    try {
        const address= await Address.create(req.body);
        res.status(201).json({ message: "Address added successfully", address: address });
    } catch (error) {
        res.status(500).json({ message: "Error adding address", error });
    }
};

export const getAddresses = async (req, res) => {
    try {
        
        const addresses = await Address.find({ user: req.body.userId });
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching addresses", error });
    }
};