import express from "express";
import upload from "../middleware/uploadImage.js";
import { getAllHotels, createHotel, getHotelById, updateHotel, deleteHotel } from "../controllers/hotelController.js";

const router = express.Router();

router.get("/", getAllHotels);
router.post("/", upload.single("image"), createHotel); // single image
router.get("/:id", getHotelById);
router.put("/:id", upload.single("image"), updateHotel);
router.delete("/:id", deleteHotel);

export default router;
