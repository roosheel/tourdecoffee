import { useState, useMemo, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, Search, Coffee, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { coffeeLog } from '../data';
import tdcDecoration from '../assets/tdc-decoration.png';

const PAGE_SIZE_OPTIONS = [10, 20, 30];

const SORT_OPTIONS = [
  { key: "recent", label: "Recent" },
  { key: "name", label: "Name" },
  { key: "distance-desc", label: "Distance" },
  { key: "stars-desc", label: "Rating" },
];

export default function CoffeeLog() {
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("recent");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const filtered = useMemo(() => {
    let items = [...coffeeLog];

    // Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(s =>
        s.n.toLowerCase().includes(q) ||
        (s.h && s.h.toLowerCase().includes(q))
      );
    }

    // Sort
    switch (sortBy) {
      case "name":
        items.sort((a, b) => a.n.localeCompare(b.n));
        break;
      case "distance-desc":
        items.sort((a, b) => b.d - a.d);
        break;
      case "stars-desc":
        items.sort((a, b) => b.s - a.s);
        break;
      // "recent" is default order from data
    }

    return items;
  }, [search, sortBy]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(0);
    setExpanded(null);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
    setExpanded(null);
  };

  const handleSort = (key) => {
    setSortBy(key);
    setPage(0);
    setExpanded(null);
  };

  return (
    <section id="log" className="coffee-log" ref={ref}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 28,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 4px" }}>
              Coffee Log
            </h2>
            <p style={{ color: "#ccc", fontSize: 13, margin: 0 }}>click any shop for the review</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <img src={tdcDecoration} alt="" style={{ height: 22, opacity: 0.4 }} />
            <span style={{ color: "#ccc", fontSize: 12 }}>{coffeeLog.length} shops and counting</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{ position: "relative", marginBottom: 20 }}
        >
          <Search
            size={16}
            color="#ccc"
            style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}
          />
          <input
            type="text"
            className="log-search"
            placeholder="Search shops by name or neighborhood..."
            value={search}
            onChange={handleSearchChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#999", fontSize: 12 }}>
              Showing {Math.min(page * pageSize + 1, filtered.length)}–{Math.min((page + 1) * pageSize, filtered.length)} of {filtered.length}
            </span>
            <span style={{ color: "#e0dcd7", fontSize: 12 }}>|</span>
            <div className="sort-controls">
              <ArrowUpDown size={11} color="#bbb" />
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleSort(opt.key)}
                  className={`sort-btn ${sortBy === opt.key ? 'active' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: "#999", fontSize: 12, marginRight: 4 }}>Per page:</span>
            {PAGE_SIZE_OPTIONS.map(size => (
              <button
                key={size}
                onClick={() => handlePageSizeChange(size)}
                style={{
                  padding: "4px 10px",
                  fontSize: 12,
                  fontWeight: pageSize === size ? 700 : 400,
                  color: pageSize === size ? "#fff" : "#999",
                  background: pageSize === size ? "#E8913A" : "#f3f1ed",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "#ccc",
            }}>
              <Coffee size={32} color="#e0dcd7" style={{ marginBottom: 12 }} />
              <div className="font-hand" style={{ fontSize: 16 }}>
                No shops match "{search}"
              </div>
            </div>
          )}
          <AnimatePresence mode="popLayout">
            {paginated.map((shop, i) => (
              <motion.div
                key={shop.n + shop.dt}
                className={`log-entry ${expanded === i ? 'expanded' : ''}`}
                onClick={() => setExpanded(expanded === i ? null : i)}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                  flexWrap: "wrap",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#1a1a1a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {shop.n}
                    </span>
                    {shop.h && (
                      <span style={{
                        fontSize: 11,
                        color: "#bbb",
                        background: "#f3f1ed",
                        padding: "3px 10px",
                        borderRadius: 6,
                        flexShrink: 0,
                      }}>
                        {shop.h}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                    <span style={{
                      color: "#E8913A",
                      fontSize: 13,
                      fontWeight: 700,
                      background: "#fef8f0",
                      padding: "3px 10px",
                      borderRadius: 6,
                    }}>
                      {shop.d} mi
                    </span>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: 5 }, (_, j) => (
                        <Star
                          key={j}
                          size={12}
                          fill={j < shop.s ? "#E8913A" : "transparent"}
                          color={j < shop.s ? "#E8913A" : "#e0dcd7"}
                        />
                      ))}
                    </div>
                    <span style={{
                      color: "#ccc",
                      fontSize: 11,
                      minWidth: 48,
                      textAlign: "right",
                    }}>
                      {shop.dt}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === i && shop.t && (
                    <motion.p
                      className="font-hand"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: "#999",
                        fontSize: 15,
                        margin: "12px 0 4px 0",
                        overflow: "hidden",
                      }}
                    >
                      &ldquo;{shop.t}&rdquo;
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {totalPages > 1 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 20,
          }}>
            <button
              onClick={() => { setPage(p => p - 1); setExpanded(null); }}
              disabled={page === 0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "6px 12px",
                fontSize: 13,
                color: page === 0 ? "#ccc" : "#E8913A",
                background: page === 0 ? "#f3f1ed" : "#fef8f0",
                border: "none",
                borderRadius: 8,
                cursor: page === 0 ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => { setPage(i); setExpanded(null); }}
                  style={{
                    width: 30,
                    height: 30,
                    fontSize: 12,
                    fontWeight: page === i ? 700 : 400,
                    color: page === i ? "#fff" : "#999",
                    background: page === i ? "#E8913A" : "#f3f1ed",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setPage(p => p + 1); setExpanded(null); }}
              disabled={page >= totalPages - 1}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: "6px 12px",
                fontSize: 13,
                color: page >= totalPages - 1 ? "#ccc" : "#E8913A",
                background: page >= totalPages - 1 ? "#f3f1ed" : "#fef8f0",
                border: "none",
                borderRadius: 8,
                cursor: page >= totalPages - 1 ? "default" : "pointer",
                transition: "all 0.15s",
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
