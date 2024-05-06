// webserver.ts
import express from 'express';
import cors from 'cors';
import sessionsRouter from './src/routes/sessions.js';
import publicationsRouter from './src/routes/publications.js';
import usersRouter from './src//routes/users.js';
import adminRouter from './src/routes/admin.js';
import utilsRouter from './src/routes/utils.js';

const app = express();
const PORT = 3002;

app.use(express.json({ limit: '50mb', extended: true  })); 

// CORS options
const corsOptions = {
  origin: '*', // Adjust this to be more restrictive according to your needs
  methods: ['GET'], // Assuming you're only serving static files
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  credentials: false, // This is important for setting `crossOrigin` to "anonymous"
};

// Apply CORS middleware to all requests
app.use(cors(corsOptions));

app.use(express.static('assets'));

app.use('/users', usersRouter);
app.use('/sessions', sessionsRouter);
app.use('/publications', publicationsRouter);
app.use('/admin', adminRouter);
app.use('/utils', utilsRouter);

app.listen(PORT, () => {
  console.log(`Web server running on http://localhost:${PORT}`);
});
