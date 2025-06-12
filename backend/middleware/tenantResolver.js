const Tenant = require('../models/Tenant');

module.exports = async (req, res, next) => {
  const host = req.headers.host?.split(':')[0];
  const slug = host.split('.')[0]; // Get subdomain

  try {
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    req.tenant = tenant;
    next();
  } catch (err) {
    console.error("Tenant resolution error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};
