import mongoose from "mongoose"; // Use import if using ES Modules

const mainCourseItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Main Course", "Appetizers", "Beverages", "Desserts"], required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  description: { type: String, default: "" },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Use ES Module Export
const MainCourseItem= mongoose.model("MainCourseItem",mainCourseItemSchema);
export default MainCourseItem;