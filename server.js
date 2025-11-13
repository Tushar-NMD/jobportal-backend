const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');




// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(cors());

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));

// app.use('/api/admin', require('.routes/adminRoutes'));

app.use('/api/admin/jobs', require('./routes/jobRoutes'));


app.use('/api/users', require('./routes/userRoutes'));
// Error handler

app.use('/api/jobs', require('./routes/publicJobRoutes'));

app.use('/api/applications', require('./routes/applicationRoutes'));

app.use('/api/admin/applications', require('./routes/adminApplicationRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








