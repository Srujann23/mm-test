module.exports = async function tenantResolver(req, res, next) {
  console.log("Tenant middleware hit → URL:", req.originalUrl);

  const subdomain = getSubdomain(req.hostname);
  console.log("Resolved subdomain:", subdomain);

  if (!subdomain) return res.status(400).json({ error: 'No subdomain provided' });

  const tenant = await Tenant.findOne({ slug: subdomain });
  if (!tenant) return res.status(404).json({ error: 'Tenant not found' });

  req.tenant = tenant;
  next();
};
