import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { API_CONFIG } from "../config";

function StatusIndicator() {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('offline');
        }
      } catch (error) {
        setStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '6px', 
      fontSize: '0.75rem', 
      fontWeight: '600',
      background: 'rgba(255, 255, 255, 0.05)',
      padding: '4px 10px',
      borderRadius: '99px',
      border: '1px solid var(--border)'
    }}>
      <div style={{ 
        width: '8px', 
        height: '8px', 
        borderRadius: '50%', 
        background: status === 'online' ? '#22c55e' : status === 'offline' ? '#ef4444' : '#f59e0b',
        boxShadow: status === 'online' ? '0 0 8px #22c55e' : 'none'
      }} />
      <span style={{ color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Gateway: {status}
      </span>
    </div>
  );
}

export default function Navbar() {
  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
    fontWeight: isActive ? '600' : '400',
    transition: 'color 0.2s'
  });

  return (
    <nav className="container" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '80px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.2rem', color: 'inherit', textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
          <span>Abacus Gateway</span>
        </Link>
        <StatusIndicator />
      </div>

      <div style={{ display: 'flex', gap: '32px', fontSize: '0.95rem' }}>
        <NavLink to="/" style={linkStyle}>Home</NavLink>
        <NavLink to="/explorer" style={linkStyle}>Explorer</NavLink>
        <a href="#features" style={{ color: 'var(--muted-foreground)' }}>Features</a>
        <a href="#pricing" style={{ color: 'var(--muted-foreground)' }}>Pricing</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a 
          href="https://github.com" 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--secondary)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            border: '1px solid var(--border)',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
          Github
        </a>
        <button style={{
          background: 'none',
          border: '1px solid var(--border)',
          padding: '8px',
          borderRadius: '8px',
          color: 'var(--foreground)',
          cursor: 'pointer'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        </button>
      </div>
    </nav>
  );
}
