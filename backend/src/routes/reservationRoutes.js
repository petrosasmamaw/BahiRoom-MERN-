import express from "express";
import { getAllReservations, createReservation, getReservationById, updateReservation, deleteReservation, getReservationsByClientId, getReservationsByHotelId } from "../controllers/reservationController.js";


const router = express.Router();

// Example route for getting all clients
router.get("/", getAllReservations);
router.get("/client/:clientId", getReservationsByClientId);
router.get("/hotel/:hotelId", getReservationsByHotelId);
router.post("/", createReservation);
router.get("/:id", getReservationById);
router.put("/:id", updateReservation);
router.delete("/:id", deleteReservation);
export default router;