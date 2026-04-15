import { useState } from "react";
import { API_CONFIG } from "../config";
import { Link } from "react-router-dom";

export default function Hero() {
  const [demoResult, setDemoResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoClick = async () => {
    setIsLoading(true);
    setDemoResult(null);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`);
      const data = await response.json();
      setDemoResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setDemoResult("Error: Could not connect to the API Gateway. Ensure it is running on port 3000.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '80px 0', maxWidth: '800px' }}>
      <h1 style={{ 
        fontSize: '4.5rem', 
        lineHeight: '1.1', 
        fontWeight: '800',
        marginBottom: '24px',
        letterSpacing: '-0.02em'
      }}>
        <span className="text-gradient-pink">Abacus</span> API Gateway for <span className="text-gradient-blue">Enterprise</span> integrations
      </h1>
      
      <p className="text-muted" style={{ 
        fontSize: '1.25rem', 
        marginBottom: '40px',
        maxWidth: '600px'
      }}>
        A modular, high-performance gateway connecting Abacus ERP with modern platforms. Built for reliability and secure data synchronization.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link 
            to="/explorer"
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none'
            }}
          >
            See Documentation
          </Link>
          <button 
            onClick={handleDemoClick}
            disabled={isLoading}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? "Connecting..." : "Try API Demo"}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: isLoading ? 0 : 1 }}><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>

        {demoResult && (
          <div style={{ 
            background: 'rgba(0,0,0,0.3)', 
            padding: '16px', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            fontFamily: 'monospace',
            fontSize: '0.85rem'
          }}>
            <div style={{ color: 'var(--primary)', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              Response from {API_CONFIG.BASE_URL}/health:
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: demoResult.startsWith('Error') ? '#ef4444' : '#22c55e' }}>
              {demoResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
