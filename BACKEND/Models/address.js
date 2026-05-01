import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {    
        type: String,
        required: true
    },
    area: {
        type: String,   
        required: true
    },
    district: { 
        type: String,
        required: true
    },
    division: {
        type: String,
    },
    
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema);

export default Address;