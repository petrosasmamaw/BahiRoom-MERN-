import express from "express";
import upload from "../middleware/uploadImage.js";
import { getAllRooms, createRoom, getRoomById, updateRoom, deleteRoom, getRoomsByHotelId } from "../controllers/roomController.js";

const router = express.Router();

router.get("/", getAllRooms);
router.get("/hotel/:hotelId", getRoomsByHotelId);
router.post("/", upload.array("images", 5), createRoom); // multiple images (max 5)
router.get("/:id", getRoomById);
router.put("/:id", upload.array("images", 5), updateRoom);
router.delete("/:id", deleteRoom);

export default router;
