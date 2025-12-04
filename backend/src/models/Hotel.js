import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        userId: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        image: { type: String, required: true }, // single image
        status: { type: String, enum: ['open', 'closed'], default: 'closed' },
    },
    { timestamps: true }
);

export default mongoose.model('Hotel', HotelSchema);
