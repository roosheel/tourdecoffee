import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import tdcLogo from '../assets/tdc-logo.png';

const NAV_ITEMS = ["about", "schedule", "journal", "log", "instagram", "merch"];

export default function Navbar({ scrolled, onNav }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    onNav(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <motion.img
            onClick={() => handleNav("top")}
            src={tdcLogo}
            alt="TDC"
            style={{ height: 38, cursor: "pointer" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
          <div className="nav-links">
            {NAV_ITEMS.map((item, i) => (
              <motion.span
                key={item}
                onClick={() => handleNav(item)}
                className="nav-link"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                {item}
              </motion.span>
            ))}
          </div>
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu open"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.div
                key={item}
                className="mobile-menu-link"
                onClick={() => handleNav(item)}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
