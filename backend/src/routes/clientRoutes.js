import express from "express";
import upload from "../middleware/uploadImage.js";
import { getAllClients, createClient, getClientById, updateClient, deleteClient } from "../controllers/clientController.js";

const router = express.Router();

router.get("/", getAllClients);
router.post("/", upload.single("image"), createClient); // single image
router.get("/:id", getClientById);
router.put("/:id", upload.single("image"), updateClient);
router.delete("/:id", deleteClient);

export default router;
