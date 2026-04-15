import { useState, useEffect } from 'react';
import { apiService } from '../api.service';
import type { ResourceType } from '../types';

export default function GatewayExplorer() {
  const [activeTab, setActiveTab] = useState<ResourceType>('customers');
  const [data, setData] = useState<any[]>([]);
  const [isMocked, setIsMocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs: { id: ResourceType; label: string; icon: any }[] = [
    { id: 'customers', label: 'Customers', icon: <CustomerIcon /> },
    { id: 'orders', label: 'Orders', icon: <OrderIcon /> },
    { id: 'invoices', label: 'Invoices', icon: <InvoiceIcon /> },
    { id: 'projects', label: 'Projects', icon: <ProjectIcon /> },
    { id: 'addresses', label: 'Addresses', icon: <AddressIcon /> },
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.getAll(activeTab);
      setData(result.data);
      setIsMocked(!!result._mocked);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <section className="container" style={{ padding: '80px 0' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px' }}>Gateway Explorer</h2>
        <p className="text-muted" style={{ fontSize: '1.1rem' }}>
          Directly interact with the Abacus API modules and verify and manage your ERP resources in real-time.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '250px 1fr', 
        gap: '32px',
        minHeight: '600px'
      }}>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--secondary)' : 'transparent',
                border: activeTab === tab.id ? '1px solid var(--border)' : '1px solid transparent',
                color: activeTab === tab.id ? 'var(--primary)' : 'var(--muted-foreground)',
                textAlign: 'left',
                fontWeight: activeTab === tab.id ? '600' : '400',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ fontSize: '1.5rem', textTransform: 'capitalize' }}>{activeTab}</h3>
              {isMocked && (
                <span style={{ 
                  fontSize: '0.7rem', 
                  background: 'rgba(245, 158, 11, 0.1)', 
                  color: '#f59e0b', 
                  padding: '2px 8px', 
                  borderRadius: '4px', 
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  fontWeight: '600'
                }}>
                  DEMO DATA
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={fetchData} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24L21 8"/><path d="M21 3v5h-5"/></svg>
                Refresh
              </button>
              <button disabled className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem', opacity: 0.5, cursor: 'not-allowed' }}>
                Create New
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
               <div className="text-muted">Loading {activeTab}...</div>
            </div>
          ) : error ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>
              <p>{error}</p>
              <p style={{ fontSize: '0.8rem', marginTop: '8px', color: 'var(--muted-foreground)' }}>Ensure the API Gateway is running on port 3000</p>
            </div>
          ) : data.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p className="text-muted">No {activeTab} found in the system.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {Object.keys(data[0]).filter(k => k !== 'id').map(key => (
                      <th key={key} style={{ padding: '12px', color: 'var(--muted-foreground)', fontSize: '0.85rem', textTransform: 'uppercase' }}>{key}</th>
                    ))}
                    <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                      {Object.entries(item).filter(([k]) => k !== 'id').map(([k, v]: [any, any], i) => (
                        <td key={i} style={{ padding: '12px', fontSize: '0.95rem' }}>
                          {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                        </td>
                      ))}
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Icons
function CustomerIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function OrderIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; }
function InvoiceIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function ProjectIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>; }
function AddressIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>; }
