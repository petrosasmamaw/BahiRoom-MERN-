import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema(
    {
        clientId: { type: String, required: true },
        hotelId: { type: String, required: true },
        roomNumber: { type: String, required: true },
        status: { type: String, enum: ['booked', 'checked-in', 'checked-out', 'canceled'], default: 'booked' },
    },
    { timestamps: true }
);
export default mongoose.model('Reservation', ReservationSchema);