import React, { useEffect, useState } from 'react';

// Utility to extract subdomain from current hostname
const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  // e.g. [client1, themeasuremate, co]
  if (parts.length < 3) return null;
  return parts[0];
};

// Utility to get the backend URL (change to your real backend)
const getBackendURL = () => {
  return `http://localhost:5000`; // Replace with your backend base URL
};

function App() {
  const subdomain = getSubdomain();
  const [tenant, setTenant] = useState(null);
  const [isTenantFound, setIsTenantFound] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subdomain) {
      setIsTenantFound(false);
      setLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        const res = await fetch(`${getBackendURL()}/api/projects`, {
          headers: {
            'X-Tenant-Subdomain': subdomain,
          },
        });

        if (!res.ok) throw new Error('Tenant not found');
        const data = await res.json();
        setTenant(data);
      } catch (error) {
        setIsTenantFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [subdomain]);
  
  if (loading) return <div>Loading...</div>;

  // Fallback: Default "Measuremate" homepage
  if (!isTenantFound) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8f8f8' }}>
        <h1>Welcome to <strong>Measuremate</strong></h1>
        <p>Your data visualization assistant</p>
        <img
          src="https://picsum.photos/id/237/200/300"
          alt="Measuremate Logo"
          style={{ marginTop: '1rem', borderRadius: '8px' }}
        />
      </div>
    );
  }

  // Tenant-specific UI
  return (
    <div style={{ padding: '2rem', backgroundColor: tenant.color || '#ffffff' }}>
      <h1>{tenant.appName || 'Unnamed App'}</h1>
      <p>{tenant.tagline || 'Your personalized dashboard'}</p>
      {tenant.logo && (
        <img
          src={tenant.logo}
          alt="Tenant Logo"
          style={{ marginTop: '1rem', maxHeight: '100px' }}
        />
      )}
    </div>
  );
}

export default App;
