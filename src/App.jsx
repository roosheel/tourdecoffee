import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Schedule from './components/Schedule';
import CoffeeLog from './components/CoffeeLog';
import Marquee from './components/Marquee';
import Journal from './components/Journal';
import Instagram from './components/Instagram';
import Merch from './components/Merch';
import Footer from './components/Footer';
import { MARQUEE_BOTTOM } from './data';

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{
      background: "#faf9f7",
      color: "#1a1a1a",
      margin: 0,
      fontFamily: '"DM Sans", system-ui, -apple-system, sans-serif',
      overflowX: "hidden",
    }}>
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.6; } }
        .hover-lift { transition: transform 0.2s; }
        .hover-lift:hover { transform: translateY(-2px); }
        .hover-orange:hover { color: #E8913A !important; }
      `}</style>

      <Navbar scrolled={scrolled} onNav={navigateTo} />
      <Hero onNav={navigateTo} />
      <About />
      <Schedule />
      <CoffeeLog />

      {/* Bottom marquee */}
      <div style={{
        background: "#7BBAD4",
        padding: "10px 0",
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: 1,
        fontFamily: '"Caveat", cursive',
      }}>
        <Marquee speed={25}>
          <span style={{ padding: "0 4px" }}>{MARQUEE_BOTTOM}</span>
        </Marquee>
      </div>

      <Journal />
      <Instagram />
      <Merch />
      <Footer />
    </div>
  );
}
