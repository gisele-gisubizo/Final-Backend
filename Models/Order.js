import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    item: {
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, default: '' },
    },
    quantity: { type: Number, default: 1 },
    totalPrice: { 
        type: Number,
        default: function() {
            return this.item.price * this.quantity;
        }
    },
    status: { 
        type: String, 
        default: 'Pending', 
        enum: ['Pending', 'Confirmed', 'In Kitchen', 'Completed'] 
    },
    isFavorite: { type: Boolean, default: false },
    prepTime: { type: Number, default: null },
    prepTimeSetAt: { type: Date, default: null },
    kitchenMessage: { type: String, default: '' },
    messageSent: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

// Calculate totalPrice before saving
orderSchema.pre('save', function(next) {
    this.totalPrice = this.item.price * this.quantity;
    next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;