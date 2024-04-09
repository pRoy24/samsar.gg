// webserver.ts
import express from 'express';
import cors from 'cors';
import sessionsRouter from './src/routes/sessions.js';
import productsRouter from './src/routes/products.js';
import usersRouter from './src//routes/users.js';
import adminRouter from './src/routes/admin.js';

import {  createReplicas } from './src/storage/Documents.js';
const app = express();
const PORT = 3002;


app.use(express.json({ limit: '50mb' })); 

// CORS options
const corsOptions = {
  origin: '*', // Adjust this to be more restrictive according to your needs
  methods: ['GET'], // Assuming you're only serving static files
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200,
  credentials: false, // This is important for setting `crossOrigin` to "anonymous"
};

// Apply CORS middleware to all requests
app.use(cors(corsOptions));



app.use(express.static('assets'));

console.log("Creating Replicas");
createReplicas();

app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/products', productsRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Web server running on http://localhost:${PORT}`);
});
