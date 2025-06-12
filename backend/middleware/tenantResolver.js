const Tenant = require('../models/Tenant');

// Utility to extract subdomain from hostname
const getSubdomain = (hostname) => {
  const parts = hostname.split('.');
  // Expect at least 3 parts (e.g., client1.themeasuremate.co)
  if (parts.length < 3) return null;
  return parts[0];
};

module.exports = async function tenantResolver(req, res, next) {
  let hostname = req.hostname;

  // Case 1: Localhost (development)
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1')) {
    const slug = req.headers['x-tenant-slug'];
    if (!slug) {
      console.log("❌ No subdomain or x-tenant-slug found for localhost request");
      return res.status(400).json({ error: "Tenant not found (no slug provided)" });
    }

    try {
      const tenant = await Tenant.findOne({ slug });
      if (!tenant) {
        return res.status(404).json({ error: "Tenant not found" });
      }

      req.tenant = tenant;
      return next();
    } catch (err) {
      console.error("❌ Error resolving tenant for localhost:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // Case 2: Production - real subdomain
  const subdomain = getSubdomain(hostname);
  if (!subdomain) {
    console.log("❌ No subdomain found for hostname:", hostname);
    return res.status(404).json({ error: "Subdomain missing" });
  }

  try {
    const tenant = await Tenant.findOne({ slug: subdomain });
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
