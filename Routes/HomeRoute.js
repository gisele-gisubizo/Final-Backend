import express from "express";
import upload from "../Middleware/multer.js";
import { addHomeItem, getAllHomeItems, getHomeItemsByCategory, updateHomeItem, deleteHomeItem } from "../Controllers/HomeController.js"; // Ensure path is correct

const router = express.Router(); 

router.get("/home", getAllHomeItems);
router.get("/home/:category", getHomeItemsByCategory);
router.post("/AddHome", upload.single('image'), addHomeItem);
router.patch("/home/:id", updateHomeItem);
router.delete("/home/:id", deleteHomeItem);

export default router;