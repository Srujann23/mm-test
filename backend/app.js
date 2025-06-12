const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tenantResolver = require('./middleware/tenantResolver');
const tenantRoutes = require('./routes/tenant');
const projectRoutes = require('./routes/projects');
const morgan = require('morgan')
require('dotenv').config();

const app = express();
connectDB();

app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use(express.json());
app.use(morgan())
// Public routes
app.use('/api/tenant', tenantRoutes);

// Tenant-based routes
app.use(tenantResolver);
app.use('/api/projects', projectRoutes);

module.exports = app;
