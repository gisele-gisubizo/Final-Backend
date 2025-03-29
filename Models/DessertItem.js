import mongoose from "mongoose"; // Use import if using ES Modules

const dessertItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  description: { type: String, default: "" },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Use ES Module Export
const DessertItem = mongoose.model("DessertItem", dessertItemSchema);
export default DessertItem;