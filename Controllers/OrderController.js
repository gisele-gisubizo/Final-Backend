import Order from '../models/Order.js';
import User from '../Models/User.js';

// Create orders from cart items
export const createOrder = async (req, res) => {
    try {
        const { cartItems } = req.body;
        const userId = req.user._id; // From auth middleware

        if (!Array.isArray(cartItems)) {
            return res.status(400).json({ success: false, message: 'Cart items must be an array' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Verify user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Create order documents
        const orders = cartItems.map(item => ({
            user: userId,
            item: {
                name: item.name,
                image: item.image,
                price: item.price,
                description: item.description || 'No description available',
            },
            quantity: item.quantity || 1,
            status: 'Pending',
            isFavorite: false
        }));

        // Save orders
        const savedOrders = await Order.insertMany(orders);

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
            io.emit('newOrders', savedOrders);
        }

        res.status(201).json({ 
            success: true, 
            message: 'Orders created successfully',
            orders: savedOrders
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error creating orders',
            error: error.message 
        });
    }
};

// Get all favorite orders for current user
export const getFavorites = async (req, res) => {
    try {
        const favorites = await Order.find({ 
            user: req.user._id,
            isFavorite: true 
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, favorites });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching favorites',
            error: error.message 
        });
    }
};

// Get all current orders for user (non-favorites)
export const getCurrentOrders = async (req, res) => {
    try {
        const currentOrders = await Order.find({ 
            user: req.user._id,
            isFavorite: false 
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, currentOrders });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching current orders',
            error: error.message 
        });
    }
};

// Get order by ID (with user verification)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.orderId,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        res.status(200).json({ success: true, order });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching order',
            error: error.message 
        });
    }
};
// Add this with your other exports
export const getOrdersByUser = async (req, res) => {
  try {
      const orders = await Order.find({ user: req.user._id })
                             .sort({ createdAt: -1 });
                             
      res.status(200).json({ success: true, orders });
  } catch (error) {
      res.status(500).json({ 
          success: false, 
          message: "Failed to fetch user orders",
          error: error.message 
      });
  }
};

// Update order status (generic function)
const updateOrderStatus = async (req, res, status) => {
    try {
        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.orderId,
                user: req.user._id
            },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
            io.emit('orderStatusUpdate', { 
                orderId: order._id, 
                status 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: `Order status updated to ${status}`,
            order 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error updating order status',
            error: error.message 
        });
    }
};

// Confirm order (specific status update)
export const confirmOrder = async (req, res) => {
    await updateOrderStatus(req, res, 'Confirmed');
};

// Send to kitchen (specific status update)
export const sendToKitchen = async (req, res) => {
    await updateOrderStatus(req, res, 'In Kitchen');
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            { isFavorite: false },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Removed from favorites',
            order 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error removing from favorites',
            error: error.message 
        });
    }
};

// Delete order (with user verification)
export const removeFromCurrentOrders = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Order deleted successfully' 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting order',
            error: error.message 
        });
    }
};

// Send preparation time update
export const sendPrepTimeMessage = async (req, res) => {
    try {
        const { prepTime } = req.body;

        if (!prepTime || isNaN(prepTime) ){
            return res.status(400).json({ 
                success: false, 
                message: 'Valid preparation time is required' 
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            { 
                prepTime,
                prepTimeSetAt: new Date(),
                messageSent: true 
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
            io.emit('prepTimeUpdate', { 
                orderId: order._id, 
                prepTime,
                prepTimeSetAt: order.prepTimeSetAt 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Preparation time updated',
            order 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error updating preparation time',
            error: error.message 
        });
    }
};

// Send kitchen message
export const sendKitchenMessage = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid message is required' 
            });
        }

        const order = await Order.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            { kitchenMessage: message },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found or not authorized' 
            });
        }

        // Emit socket event
        const io = req.app.get('socketio');
        if (io) {
            io.emit('kitchenMessageUpdate', { 
                orderId: order._id, 
                message 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Kitchen message sent',
            order 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error sending kitchen message',
            error: error.message 
        });
    }
}