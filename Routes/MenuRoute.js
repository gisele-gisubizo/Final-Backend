
import express from "express";
import upload  from "../Middleware/multer.js";
import { addMenuItem, getAllMenuItems, getMenuItemsByCategory, updateMenuItem, deleteMenuItem } from "../Controllers/MenuController.js"; // Ensure path is correct

const router = express.Router(); 

router.get("/menu", getAllMenuItems);
router.get("/menu/:category", getMenuItemsByCategory);
// router.post("/AddMenu", addMenuItem);
router.post("/AddMenu", upload.single('image'),addMenuItem);
router.put("/menu/:id", updateMenuItem);
router.delete("/menuDelete/:id", deleteMenuItem);

export default router;