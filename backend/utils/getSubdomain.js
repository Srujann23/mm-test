// utils/getSubdomain.js
module.exports = function getSubdomain(hostname) {
  if (!hostname) return null;

  // Remove port if any (for localhost)
  hostname = hostname.split(':')[0];

  // Remove the main domain from the end
  const parts = hostname.split('.');
  if (parts.length < 3) return null;

  // For domains like client1.themeasuremate.co → return 'client1'
  return parts[0];
};
