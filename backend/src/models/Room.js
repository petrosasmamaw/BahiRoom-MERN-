import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
    {
        hotelId: { type: String, required: true },
        roomNumber: { type: String, required: true },
        type: { type: String, required: true },
        price: { type: Number, required: true },
        status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
        description: { type: String },
        images: { type: [String], required: true }, // array for multiple images
        rating: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('Room', RoomSchema);
