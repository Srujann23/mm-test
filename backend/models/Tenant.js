const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  appName: { type: String, required: true },
  tagline: String,
  colorScheme: String,
  logoUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('Tenant', tenantSchema);
