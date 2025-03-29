// Routes/OrdersRouter.js
import express from 'express';
import router from './Orders.js';  // Make sure you're importing the default export here

const OrdersRouter = express.Router();

// Use the imported router under the '/Order' path
OrdersRouter.use('/Order', router);

export default OrdersRouter; // Ensure you're exporting it as default