import React, { useEffect, useState } from 'react';

const getSubdomain = () => {
  const host = window.location.hostname;
  const parts = host.split('.');
  if (parts.length < 3) return null;
  return parts[0];
};

const getBackendURL = () => {
  const url = process.env.REACT_APP_BACKEND_URL;
  if (!url) {
    console.error("❌ Missing REACT_APP_BACKEND_URL. Check your Vercel settings.");
  }
  return url || "http://localhost:5000"; // fallback for local dev
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
            'X-Tenant-Slug': subdomain,
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (!res.ok) throw new Error('Tenant not found');
        const data = await res.json();
        setTenant(data);
      } catch (error) {
        console.error('Fetch tenant failed:', error);
        setIsTenantFound(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [subdomain]);

  if (loading) return <div>Loading...</div>;

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
