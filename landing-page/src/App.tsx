import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BentoGrid from "./components/BentoGrid";
import GatewayExplorer from "./components/GatewayExplorer";

function Home() {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '1.2fr 1fr', 
      gap: '60px',
      alignItems: 'start'
    }}>
      <section>
        <Hero />
      </section>
      
      <section style={{ marginTop: '80px' }}>
        <BentoGrid />
      </section>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      
      <main className="container" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px',
        paddingBottom: '100px',
        marginTop: '40px'
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<GatewayExplorer />} />
        </Routes>

        <footer style={{ 
          marginTop: '60px', 
          textAlign: 'center',
          padding: '40px 0',
          borderTop: '1px solid var(--border)'
        }}>
          <p style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>
            Abacus API Gateway Integration
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
