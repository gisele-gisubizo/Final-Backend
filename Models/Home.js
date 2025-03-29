import mongoose from "mongoose"; // Use import if using ES Modules

const homeItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Main Course", "Appetizer", "Beverage", "Dessert"], required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  description: { type: String, default: "No description available" }, // Default value if description is not provided
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Use ES Module Export
const HomeItem = mongoose.model("HomeItem", homeItemSchema);
export default HomeItem;
