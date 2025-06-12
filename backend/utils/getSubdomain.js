function getSubdomain(hostname) {
  if (!hostname || hostname === 'localhost') return null;

  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0]; // e.g., client1.themeasuremate.co → "client1"
  }

  return null; // No subdomain
}
module.exports = getSubdomain;