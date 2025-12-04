import Room from "../models/Room.js";

export const getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getRoomsByHotelId = async (req, res) => {
    try {
        const rooms = await Room.find({ hotelId: req.params.hotelId });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createRoom = async (req, res) => {
    const { hotelId, roomNumber, type, price, status, description } = req.body;
    const images = req.files.map(file => file.path); // multiple images

    const newRoom = new Room({ hotelId, roomNumber, type, price, status, description, images });

    try {
        const savedRoom = await newRoom.save();
        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRoom = async (req, res) => {
    try {
        const updatedFields = req.body;
        if (req.files && req.files.length > 0) {
            updatedFields.images = req.files.map(file => file.path);
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.json(updatedRoom);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteRoom = async (req, res) => {
    try {
        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        if (!deletedRoom) return res.status(404).json({ message: 'Room not found' });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
