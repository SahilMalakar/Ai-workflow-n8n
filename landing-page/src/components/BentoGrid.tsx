export default function BentoGrid() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '24px',
      position: 'relative'
    }}>
      {/* 1. Testimonial Card */}
      <div className="glass-card" style={{ padding: '24px', gridColumn: '1 / 2' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            background: 'linear-gradient(45deg, #ec4899, #0ea5e9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem'
          }}>
            SA
          </div>
          <div>
            <div style={{ fontWeight: '600' }}>System Architect</div>
            <div className="text-muted" style={{ fontSize: '0.8rem' }}>@enterprise_dev</div>
          </div>
        </div>
        <p style={{ fontSize: '1.1rem' }}>The Abacus Gateway has significantly reduced our integration latency.</p>
      </div>

      {/* 2. Pricing Card */}
      <div className="glass-card" style={{ padding: '32px', gridRow: 'span 2' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Cloud</h3>
          <span style={{ 
            background: 'rgba(34, 197, 94, 0.1)', 
            color: 'var(--primary)', 
            fontSize: '0.75rem', 
            padding: '4px 12px', 
            borderRadius: '99px',
            fontWeight: '600'
          }}>Recommended</span>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Scalable <span style={{ fontSize: '1rem', color: 'var(--muted-foreground)' }}>Pricing</span></div>
        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px' }}>
          Enterprise-grade features with direct Abacus ERP mapping.
        </p>
        <button style={{ 
          width: '100%', 
          background: 'var(--primary)', 
          color: 'var(--primary-foreground)', 
          padding: '12px', 
          borderRadius: '8px',
          fontWeight: '600',
          marginBottom: '32px'
        }}>
          Contact Sales
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <FeatureItem text="Unlimited API Calls" />
          <FeatureItem text="Custom Webhook Logic" />
          <FeatureItem text="Priority Support" />
        </div>
      </div>

      {/* 3. Core Modules Card */}
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '16px', 
          background: 'rgba(14, 165, 233, 0.1)', 
          color: 'var(--accent-blue)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
        </div>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Core API Modules</h3>
        <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500', marginBottom: '16px' }}>Full ERP Coverage</p>
        <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
           <span>• CRM (Customers & Addresses)</span>
           <span>• Commerce (Invoices & Orders)</span>
           <span>• Project Resource Management</span>
        </div>
        {/* Social SVGs removed as requested */}
      </div>

      {/* 4. Webhook Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ 
          padding: '10px', 
          borderRadius: '12px', 
          background: 'rgba(34, 197, 94, 0.1)', 
          color: 'var(--primary)' 
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11V4h7"/><path d="m4 4 16 16"/><path d="M20 13v7h-7"/></svg>
        </div>
        <div>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Real-time Webhooks</h4>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Instant notifications for ERP events including new orders and inventory updates.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 6 9 17l-5-5"/></svg>
      <span style={{ fontSize: '0.95rem' }}>{text}</span>
    </div>
  );
}
