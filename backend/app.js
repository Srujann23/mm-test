const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tenantResolver = require('./middleware/tenantResolver');
const tenantRoutes = require('./routes/tenant');
const projectRoutes = require('./routes/projects');
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /\.themeasuremate\.com$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS denied"));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Public routes
app.use('/api/tenant', tenantRoutes);

// Tenant-based routes
app.use(tenantResolver);
app.use('/api/projects', projectRoutes);

module.exports = app;
