export const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length < 3) return null; // e.g. "themeasuremate.com"
  return parts[0]; // e.g. "client1"
};
