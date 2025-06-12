const express = require('express');
const Tenant = require('../models/Tenant');
const router = express.Router();

router.post('/register', async (req, res) => {
  console.log("REGISTER HIT:", req.body); // ← add this

  const { slug, appName, tagline, colorScheme, logoUrl } = req.body;

  if (!slug || !appName)
    return res.status(400).json({ error: "slug and appName are required" });

  try {
    const exists = await Tenant.findOne({ slug });
    if (exists) return res.status(400).json({ error: "Slug already in use" });

    const newTenant = new Tenant({ slug, appName, tagline, colorScheme, logoUrl });
    await newTenant.save();

    res.status(201).json({ message: "Tenant registered", tenant: newTenant });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;