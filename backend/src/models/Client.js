import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        userId: { type: String, required: true },
        idCardNo: { type: String, required: true },
        phone: { type: String, required: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
        image: { type: String }, // single image
    },
    { timestamps: true }
);

export default mongoose.model('Client', ClientSchema);
