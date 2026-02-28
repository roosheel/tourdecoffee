import { useState, useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Route, Calendar, MapPin, Eye, EyeOff, Layers } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { runs, START_COORDS } from '../data';

function createShopIcon(isActive) {
  const size = isActive ? 24 : 16;
  const fill = isActive ? '#E8913A' : '#7BBAD4';
  return L.divIcon({
    className: '',
    html: `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,${isActive ? '0.3' : '0.15'})); transition: all 0.2s ease;">
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
    width:18px;height:18px;
    background:#E8913A;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 2px #E8913A, 0 2px 8px rgba(0,0,0,0.25);
  "></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
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

export default function Journal() {
  const [current, setCurrent] = useState(0);
  const [routeMode, setRouteMode] = useState("heatmap");
  const run = runs[current];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const prev = () => setCurrent(Math.max(0, current - 1));
  const next = () => setCurrent(Math.min(runs.length - 1, current + 1));

  const currentGroup = useMemo(() =>
    shopGroups.find(g => g.runs.some(r => r === run)),
    [run]
  );
  const alsoVisited = currentGroup ? currentGroup.runs.filter(r => r !== run) : [];

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
            {runs.length} runs logged
          </motion.span>
        </div>

        {/* Run selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.15 }}
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
          {runs.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setCurrent(i)}
              className={`run-pill ${current === i ? 'active' : ''}`}
            >
              #{r.id}
            </button>
          ))}
          <button
            onClick={next}
            disabled={current === runs.length - 1}
            style={{
              background: "none",
              border: "1px solid #e0dcd7",
              borderRadius: 8,
              padding: "8px 12px",
              cursor: current === runs.length - 1 ? "default" : "pointer",
              opacity: current === runs.length - 1 ? 0.3 : 1,
              color: "#1a1a1a",
              flexShrink: 0,
              transition: "all 0.2s",
            }}
          >
            <ChevronRight size={16} />
          </button>
        </motion.div>

        {/* Map + details grid */}
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
              <Circle
                center={START_COORDS}
                radius={5000}
                pathOptions={{
                  color: "#7BBAD4",
                  weight: 1.5,
                  opacity: 0.35,
                  fillColor: "#7BBAD4",
                  fillOpacity: 0.04,
                  dashArray: "6 4",
                }}
              />
              {/* Heatmap: show all routes faintly */}
              {routeMode === "heatmap" && runs.map((r, i) => (
                i !== current && (
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
                )
              ))}
              {/* Active route */}
              {routeMode !== "hidden" && (
                <Polyline
                  positions={run.route}
                  pathOptions={{
                    color: "#E8913A",
                    weight: 4,
                    opacity: 0.85,
                    dashArray: "8 6",
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              )}
              {/* Shop markers grouped */}
              {shopGroups.map((group, gi) => {
                const isActive = group.runs.some(r => runs.indexOf(r) === current);
                return (
                  <Marker
                    key={gi}
                    position={group.coords}
                    icon={createShopIcon(isActive)}
                    eventHandlers={{ click: () => setCurrent(runs.indexOf(group.runs[0])) }}
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
                  {alsoVisited.map(r => (
                    <button
                      key={r.id}
                      onClick={() => setCurrent(runs.indexOf(r))}
                      style={{
                        background: "#fef8f0",
                        color: "#E8913A",
                        border: "1px solid #f0d9b5",
                        borderRadius: 14,
                        padding: "4px 12px",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      Run #{r.id} · {r.date}
                    </button>
                  ))}
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
      </div>
    </section>
  );
}
