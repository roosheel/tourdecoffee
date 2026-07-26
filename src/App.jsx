import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Schedule from './components/Schedule';
import CoffeeLog from './components/CoffeeLog';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import Instagram from './components/Instagram';
import Merch from './components/Merch';
import Footer from './components/Footer';
import { MARQUEE_BOTTOM } from './data';

// The Journal pulls in Leaflet + react-leaflet (the heaviest dependencies on the
// page). Load it in its own chunk so the initial bundle stays lean.
const Journal = lazy(() => import('./components/Journal'));

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar scrolled={scrolled} onNav={navigateTo} />
      <Hero onNav={navigateTo} />
      <About />
      <Schedule />
      <Suspense fallback={<div style={{ minHeight: 480 }} />}>
        <Journal />
      </Suspense>
      <Stats />

      <div className="marquee-wrap blue">
        <Marquee speed={28} direction="right">
          <span style={{ padding: "0 6px" }}>{MARQUEE_BOTTOM}</span>
        </Marquee>
      </div>

      <CoffeeLog />
      <Instagram />
      <Merch />
      <Footer />
    </>
  );
}
