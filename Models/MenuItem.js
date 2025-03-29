import mongoose from "mongoose"; // Use import if using ES Modules

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Main Course", "Appetizer", "Beverage", "Dessert"], required: true },
  price: { type: String, required: true },
  image: { type: Array, required: true },
  description: { type: String, default: "" },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Use ES Module Export
const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;