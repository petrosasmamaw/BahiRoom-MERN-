import Reservation from "../models/Reservation.js";

export const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getReservationsByClientId = async (req, res) => {
    try {
        const reservations = await Reservation.find({ clientId: req.params.clientId });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const getReservationsByHotelId = async (req, res) => {
    try {
        const reservations = await Reservation.find({ hotelId: req.params.hotelId });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const createReservation = async (req, res) => {
    const { clientId, hotelId, roomNumber, status } = req.body;
    const newReservation = new Reservation({ clientId, hotelId, roomNumber, status });
    try {
        const savedReservation = await newReservation.save();
        res.status(201).json(savedReservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
export const getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);  
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateReservation = async (req, res) => {
    try {
        const updatedFields = req.body;
        const updatedReservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );
        if (!updatedReservation) return res.status(404).json({ message: "Reservation not found" });
        res.json(updatedReservation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
export const deleteReservation = async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);
        if (!deletedReservation) return res.status(404).json({ message: 'Reservation not found' });
        res.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}