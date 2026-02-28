import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Route, Calendar, MapPin, Eye, EyeOff, Layers, ArrowUpDown, Play, Search, Instagram, Globe } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { runs, START_COORDS } from '../data';

// Brown roast shades: light → dark roast
const ROAST_BROWNS = [
  '#C4A882', '#A0785A', '#8B6914', '#6F4E37',
  '#5C3A1E', '#3E2723', '#7B5B3A', '#926C4A',
];

function getRoastColor(index) {
  return ROAST_BROWNS[index % ROAST_BROWNS.length];
}

function createShopIcon(isActive, groupIndex) {
  const size = isActive ? 24 : 16;
  const fill = isActive ? '#E8913A' : getRoastColor(groupIndex);
  return L.divIcon({
    className: 'bean-marker',
    html: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,${isActive ? '0.3' : '0.15'}));">
      <ellipse cx="12" cy="12" rx="8" ry="10" fill="${fill}" stroke="#fff" stroke-width="2"/>
      <path d="M12 4 C10 8, 10 16, 12 20" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.6"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const startIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:32px;height:32px;
    background:#E8913A;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 2px #E8913A, 0 2px 8px rgba(0,0,0,0.25);
    display:flex;align-items:center;justify-content:center;
  "><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function groupRunsByShop(allRuns) {
  const groups = [];
  for (const run of allRuns) {
    const existing = groups.find(g =>
      Math.abs(g.coords[0] - run.shopCoords[0]) < 0.001 &&
      Math.abs(g.coords[1] - run.shopCoords[1]) < 0.001
    );
    if (existing) {
      existing.runs.push(run);
    } else {
      groups.push({ coords: run.shopCoords, runs: [run] });
    }
  }
  return groups;
}

const shopGroups = groupRunsByShop(runs);

const ROUTE_MODES = [
  { key: "heatmap", label: "All Routes", icon: Layers },
  { key: "active", label: "Active", icon: Eye },
  { key: "hidden", label: "Hidden", icon: EyeOff },
];

const SORT_OPTIONS = [
  { key: "recent", label: "Recent" },
  { key: "distance-desc", label: "Longest" },
  { key: "distance-asc", label: "Shortest" },
  { key: "stars-desc", label: "Top Rated" },
];

// Animated polyline that draws itself progressively
function AnimatedRoute({ route, isAnimating, onComplete }) {
  const [progress, setProgress] = useState(isAnimating ? 0 : route.length);

  useEffect(() => {
    if (!isAnimating) {
      setProgress(route.length);
      return;
    }
    setProgress(0);
    const totalPoints = route.length;
    // Draw ~60 points per second for smooth animation
    const step = Math.max(1, Math.floor(totalPoints / 90));
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= totalPoints) {
        current = totalPoints;
        clearInterval(timer);
        onComplete?.();
      }
      setProgress(current);
    }, 16);

    return () => clearInterval(timer);
  }, [route, isAnimating]);

  const visibleRoute = route.slice(0, progress);

  if (visibleRoute.length < 2) return null;

  return (
    <Polyline
      positions={visibleRoute}
      pathOptions={{
        color: "#E8913A",
        weight: 4,
        opacity: 0.85,
        dashArray: isAnimating ? undefined : "8 6",
        lineCap: "round",
        lineJoin: "round",
      }}
    />
  );
}

// Auto-fit map to the active route
function MapFitter({ route }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 1) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true, duration: 0.5 });
    }
  }, [route, map]);
  return null;
}

export default function Journal() {
  const [current, setCurrent] = useState(0);
  const [routeMode, setRouteMode] = useState("heatmap");
  const [isAnimating, setIsAnimating] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const [filterSearch, setFilterSearch] = useState("");
  const ref = useRef(null);
  const pillContainerRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Sorted and filtered runs
  const filteredRuns = useMemo(() => {
    let items = [...runs];

    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase();
      items = items.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.hood && r.hood.toLowerCase().includes(q))
      );
    }

    switch (sortBy) {
      case "distance-desc":
        items.sort((a, b) => b.distance - a.distance);
        break;
      case "distance-asc":
        items.sort((a, b) => a.distance - b.distance);
        break;
      case "stars-desc":
        items.sort((a, b) => b.stars - a.stars);
        break;
      // "recent" is default order
    }

    return items;
  }, [sortBy, filterSearch]);

  const run = filteredRuns[current] || runs[0];

  const prev = () => setCurrent(Math.max(0, current - 1));
  const next = () => setCurrent(Math.min(filteredRuns.length - 1, current + 1));

  const currentGroup = useMemo(() =>
    shopGroups.find(g => g.runs.some(r => r === run)),
    [run]
  );
  const alsoVisited = currentGroup ? currentGroup.runs.filter(r => r !== run) : [];

  // Get shop ig/website from any run in the group that has it
  const shopIg = useMemo(() => {
    if (run.ig) return run.ig;
    if (currentGroup) {
      const match = currentGroup.runs.find(r => r.ig);
      if (match) return match.ig;
    }
    return "";
  }, [run, currentGroup]);

  const shopWebsite = useMemo(() => {
    if (run.website) return run.website;
    if (currentGroup) {
      const match = currentGroup.runs.find(r => r.website);
      if (match) return match.website;
    }
    return "";
  }, [run, currentGroup]);

  const handleSelectRun = useCallback((i) => {
    setCurrent(i);
    setIsAnimating(false);
  }, []);

  const handleAnimate = () => {
    setIsAnimating(true);
  };

  // Scroll active pill into view
  useEffect(() => {
    if (pillContainerRef.current) {
      const activeBtn = pillContainerRef.current.querySelector('.run-pill.active');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [current]);

  // Reset current when filter changes
  useEffect(() => {
    setCurrent(0);
    setIsAnimating(false);
  }, [sortBy, filterSearch]);

  return (
    <section id="journal" className="journal-section" ref={ref}>
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
            <h2 className="font-cursive" style={{ fontSize: 40, fontWeight: 700, margin: "0 0 4px" }}>
              Run Journal
            </h2>
            <p className="font-hand" style={{ color: "#bbb", fontSize: 15, margin: 0 }}>
              every run, every route, every coffee shop
            </p>
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              color: "#E8913A",
              fontSize: 13,
              fontWeight: 600,
              background: "#fef8f0",
              padding: "6px 14px",
              borderRadius: 8,
            }}
          >
            {filteredRuns.length} runs {filterSearch || sortBy !== "recent" ? "matched" : "logged"}
          </motion.span>
        </div>

        {/* Filter & sort bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 280 }}>
            <Search size={14} color="#ccc" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Filter by name or hood..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 14px 8px 32px",
                border: "1.5px solid #e8e4df",
                borderRadius: 8,
                fontSize: 12,
                fontFamily: '"DM Sans", sans-serif',
                background: "#fff",
                color: "#1a1a1a",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#E8913A"}
              onBlur={(e) => e.target.style.borderColor = "#e8e4df"}
            />
          </div>
          <div className="sort-controls">
            <ArrowUpDown size={11} color="#bbb" />
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`sort-btn ${sortBy === opt.key ? 'active' : ''}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Run selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
          ref={pillContainerRef}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          <button
            onClick={prev}
            disabled={current === 0}
            style={{
              background: "none",
              border: "1px solid #e0dcd7",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: current === 0 ? "default" : "pointer",
              opacity: current === 0 ? 0.3 : 1,
              color: "#1a1a1a",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          {filteredRuns.map((r, i) => (
            <button
              key={r.id}
              onClick={() => handleSelectRun(i)}
              className={`run-pill ${current === i ? 'active' : ''}`}
            >
              #{r.id}
            </button>
          ))}
          <button
            onClick={next}
            disabled={current === filteredRuns.length - 1}
            style={{
              background: "none",
              border: "1px solid #e0dcd7",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: current === filteredRuns.length - 1 ? "default" : "pointer",
              opacity: current === filteredRuns.length - 1 ? 0.3 : 1,
              color: "#1a1a1a",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </motion.div>

        {filteredRuns.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#ccc",
          }}>
            <Route size={32} color="#e0dcd7" style={{ marginBottom: 12 }} />
            <div className="font-hand" style={{ fontSize: 16 }}>
              No runs match &ldquo;{filterSearch}&rdquo;
            </div>
          </div>
        ) : (
          /* Map + details grid */
          <div className="journal-grid">
            {/* Map */}
            <div className="journal-map">
              <div className="map-overlay">
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span className="font-cursive" style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#E8913A",
                  }}>
                    Run #{run.id}
                  </span>
                  <span style={{ fontSize: 12, color: "#bbb" }}>{run.date}</span>
                </div>
                <div style={{ fontSize: 13, color: "#999", marginTop: 3 }}>
                  {run.distance} mi · {run.name}
                </div>
                <div style={{
                  display: "flex",
                  gap: 4,
                  marginTop: 8,
                  borderTop: "1px solid #e8e4df",
                  paddingTop: 8,
                  flexWrap: "wrap",
                }}>
                  {ROUTE_MODES.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setRouteMode(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "3px 8px",
                        fontSize: 11,
                        fontWeight: routeMode === key ? 700 : 400,
                        color: routeMode === key ? "#fff" : "#999",
                        background: routeMode === key ? "#E8913A" : "#f3f1ed",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <Icon size={11} />
                      {label}
                    </button>
                  ))}
                  <button
                    onClick={handleAnimate}
                    disabled={isAnimating}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 8px",
                      fontSize: 11,
                      fontWeight: 600,
                      color: isAnimating ? "#fff" : "#7BBAD4",
                      background: isAnimating ? "#7BBAD4" : "#eef7fb",
                      border: "none",
                      borderRadius: 6,
                      cursor: isAnimating ? "default" : "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <Play size={10} />
                    {isAnimating ? "Drawing..." : "Replay"}
                  </button>
                </div>
              </div>
              <MapContainer
                center={START_COORDS}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
                />
                <MapFitter route={run.route} />
                {/* Heatmap: show all routes faintly */}
                {routeMode === "heatmap" && runs.map((r) => {
                  if (r === run) return null;
                  return (
                    <Polyline
                      key={`bg-${r.id}`}
                      positions={r.route}
                      pathOptions={{
                        color: "#E8913A",
                        weight: 2,
                        opacity: 0.12,
                        lineCap: "round",
                        lineJoin: "round",
                      }}
                    />
                  );
                })}
                {/* Active route — animated or static */}
                {routeMode !== "hidden" && (
                  <AnimatedRoute
                    key={run.id}
                    route={run.route}
                    isAnimating={isAnimating}
                    onComplete={() => setIsAnimating(false)}
                  />
                )}
                {/* Shop markers grouped */}
                {shopGroups.map((group, gi) => {
                  const isActive = group.runs.some(r => r === run);
                  return (
                    <Marker
                      key={gi}
                      position={group.coords}
                      icon={createShopIcon(isActive, gi)}
                      eventHandlers={{ click: () => {
                        const idx = filteredRuns.indexOf(group.runs[0]);
                        if (idx >= 0) handleSelectRun(idx);
                        else handleSelectRun(0);
                      }}}
                    >
                      <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
                        <span style={{ fontWeight: 700, fontSize: 12 }}>
                          {group.runs.map(r => `#${r.id}`).join(', ')}
                        </span>
                      </Tooltip>
                    </Marker>
                  );
                })}
                <Marker position={START_COORDS} icon={startIcon} />
              </MapContainer>
            </div>

            {/* Run details card */}
            <div className="run-detail-card">
              <div style={{
                fontSize: 11,
                color: "#bbb",
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}>
                destination
              </div>
              <div className="font-cursive" style={{
                fontSize: 24,
                fontWeight: 700,
                marginBottom: 6,
                lineHeight: 1.2,
              }}>
                {run.name}
              </div>
              {run.hood && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  color: "#999",
                  marginBottom: 14,
                }}>
                  <MapPin size={12} />
                  {run.hood}
                </div>
              )}
              {run.stars > 0 && (
                <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: 5 }, (_, j) => (
                    <Star
                      key={j}
                      size={15}
                      fill={j < run.stars ? "#E8913A" : "transparent"}
                      color={j < run.stars ? "#E8913A" : "#e0dcd7"}
                    />
                  ))}
                </div>
              )}
              {(shopIg || shopWebsite) && (
                <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                  {shopIg && (
                    <a
                      href={`https://instagram.com/${shopIg}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#E8913A",
                        background: "#fef8f0",
                        border: "1px solid #f0d9b5",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                    >
                      <Instagram size={13} />
                      @{shopIg}
                    </a>
                  )}
                  {shopWebsite && (
                    <a
                      href={shopWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "6px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#7BBAD4",
                        background: "#eef7fb",
                        border: "1px solid #c8e2ef",
                        borderRadius: 8,
                        textDecoration: "none",
                        transition: "all 0.15s",
                      }}
                    >
                      <Globe size={13} />
                      Website
                    </a>
                  )}
                </div>
              )}
              {run.note && (
                <p className="font-hand" style={{
                  color: "#999",
                  fontSize: 15,
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  &ldquo;{run.note}&rdquo;
                </p>
              )}
              {alsoVisited.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #e8e4df" }}>
                  <div style={{
                    fontSize: 11,
                    color: "#bbb",
                    marginBottom: 6,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}>
                    also visited
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {alsoVisited.map(r => {
                      const idx = filteredRuns.indexOf(r);
                      return (
                        <button
                          key={r.id}
                          onClick={() => idx >= 0 && handleSelectRun(idx)}
                          style={{
                            background: "#fef8f0",
                            color: "#E8913A",
                            border: "1px solid #f0d9b5",
                            borderRadius: 14,
                            padding: "4px 12px",
                            fontSize: 12,
                            fontWeight: 600,
                            cursor: idx >= 0 ? "pointer" : "default",
                            opacity: idx >= 0 ? 1 : 0.5,
                            transition: "all 0.15s",
                          }}
                        >
                          Run #{r.id} · {r.date}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Stats card */}
            <div className="run-stats-card">
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#bbb",
                  fontSize: 12,
                }}>
                  <Calendar size={14} />
                  <span>{run.date}</span>
                </div>
                <span className="font-cursive" style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#E8913A",
                }}>
                  {run.distance} mi
                </span>
              </div>

              <div style={{
                display: "flex",
                gap: 12,
                marginBottom: 14,
              }}>
                <div style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 10,
                  padding: "12px 14px",
                  border: "1px solid #e8e4df",
                  textAlign: "center",
                }}>
                  <Route size={16} color="#7BBAD4" style={{ marginBottom: 4 }} />
                  <div style={{ fontSize: 11, color: "#bbb" }}>route pts</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{run.route.length}</div>
                </div>
                <div style={{
                  flex: 1,
                  background: "#fff",
                  borderRadius: 10,
                  padding: "12px 14px",
                  border: "1px solid #e8e4df",
                  textAlign: "center",
                }}>
                  <span style={{ fontSize: 16, marginBottom: 4, display: "block" }}>#{run.id}</span>
                  <div style={{ fontSize: 11, color: "#bbb" }}>of {runs.length}</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>runs</div>
                </div>
              </div>

              <div style={{
                color: "#ccc",
                fontSize: 11,
                lineHeight: 1.6,
              }}>
                click a run number to explore · hover a pin to see visits
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
