const Tenant = require('../models/Tenant');

module.exports = async function tenantResolver(req, res, next) {
  const slug = req.headers['x-tenant-slug']; // always prefer this

  if (!slug) {
    const hostname = req.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      // fallback to subdomain logic
      slug = parts[0];
    } else {
      console.log("❌ No x-tenant-slug or subdomain found");
      return res.status(400).json({ error: "Tenant slug or subdomain not provided" });
    }
  }

  try {
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    req.tenant = tenant;
    next();
  } catch (err) {
    console.error("❌ Error resolving tenant:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
