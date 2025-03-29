import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
import cors from "cors";
import { Server } from 'socket.io'; // Import Socket.io
import http from 'http'; // Import HTTP module to create a server

import indexRouter from './Routes/IndexRouter.js';
import IndexRouting from './Routes/IndexRouting.js';
import OrdersRouter from './Routes/OrdersRouter.js';
import MainCourseRouting from './Routes/MainCourseRoute.js';
import AppetizerRouting from './Routes/AppetizerRouting.js';
import DessertRouting from './Routes/DessertRouting.js';
import authRouting from './Routes/authRouting.js';

dotenv.config();
const app = express();

// Create an HTTP server for Express and Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Allow frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Enable CORS for Express routes
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Use Express's built-in JSON parser instead of body-parser
app.use(express.json());

// Make io available to routes via app.locals
app.locals.io = io;

// Routes - Mount on distinct paths to avoid conflicts
app.use('/', indexRouter); // For menu items
app.use('/', OrdersRouter); // For orders
app.use('/', IndexRouting); // For home items
app.use('/', MainCourseRouting); // For main course items
app.use('/', AppetizerRouting); // For appetizers
app.use('/', DessertRouting); // For desserts
app.use('/', authRouting); // For authentication

// Variables from .env file
const db_user = process.env.DB_USER;
const db_name = process.env.DB_NAME;
const port = process.env.PORT || 5000;
const db_pass = process.env.DB_PASS;

// MongoDB Connection
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.el91e.mongodb.net/${db_name}`;
console.log("MongoDB URI:", dbUri);

mongoose.set("strictQuery", false);
mongoose.connect(dbUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});