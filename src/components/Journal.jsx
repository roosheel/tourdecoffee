import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Camera } from 'lucide-react';
import { MapContainer, TileLayer, Polyline, Circle, Marker } from 'react-leaflet';
import L from 'leaflet';
import { runs, START_COORDS } from '../data';

const cursive = { fontFamily: '"Caveat", cursive' };
const handwritten = { fontFamily: '"Patrick Hand", cursive' };

function createShopIcon(isActive) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${isActive ? 14 : 10}px;
      height:${isActive ? 14 : 10}px;
      background:${isActive ? '#E8913A' : '#7BBAD4'};
      border:2px solid #fff;
      border-radius:50%;
      box-shadow:0 1px 4px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [isActive ? 14 : 10, isActive ? 14 : 10],
    iconAnchor: [isActive ? 7 : 5, isActive ? 7 : 5],
  });
}

const startIcon = L.divIcon({
  className: '',
  html: `<div style="
    width:16px;height:16px;
    background:#E8913A;
    border:3px solid #fff;
    border-radius:50%;
    box-shadow:0 0 0 2px #E8913A, 0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function RoutePolyline({ route }) {
  return <Polyline positions={route} pathOptions={{ color: "#E8913A", weight: 4, opacity: 0.8, dashArray: "8 6" }} />;
}

export default function Journal() {
  const [current, setCurrent] = useState(0);
  const run = runs[current];

  const prev = () => setCurrent(Math.max(0, current - 1));
  const next = () => setCurrent(Math.min(runs.length - 1, current + 1));

  return (
    <section id="journal" style={{ padding: "60px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "end",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
      }}>
        <div>
          <h2 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 4px", ...cursive }}>Run Journal</h2>
          <p style={{ color: "#bbb", fontSize: 14, margin: 0, ...handwritten }}>
            every run, every route, every coffee shop
          </p>
        </div>
        <span style={{ color: "#ccc", fontSize: 12 }}>{runs.length} runs logged</span>
      </div>

      {/* Run selector */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
        overflowX: "auto",
        paddingBottom: 4,
      }}>
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            background: "none",
            border: "1px solid #e0dcd7",
            borderRadius: 6,
            padding: "6px 10px",
            cursor: current === 0 ? "default" : "pointer",
            opacity: current === 0 ? 0.3 : 1,
            color: "#1a1a1a",
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={16} />
        </button>
        {runs.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setCurrent(i)}
            style={{
              background: current === i ? "#E8913A" : "#fff",
              color: current === i ? "#fff" : "#999",
              border: current === i ? "1px solid #E8913A" : "1px solid #e0dcd7",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
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
            borderRadius: 6,
            padding: "6px 10px",
            cursor: current === runs.length - 1 ? "default" : "pointer",
            opacity: current === runs.length - 1 ? 0.3 : 1,
            color: "#1a1a1a",
            flexShrink: 0,
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Map + details grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 12,
        height: 520,
      }}>
        {/* Map (spans both rows) */}
        <div style={{
          gridRow: "1 / 3",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #e0dcd7",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 1000,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            borderRadius: 8,
            padding: "8px 14px",
            border: "1px solid #e8e4df",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#E8913A", ...cursive }}>Run #{run.id}</span>
              <span style={{ fontSize: 12, color: "#bbb" }}>{run.date}</span>
            </div>
            <div style={{ fontSize: 13, color: "#999", marginTop: 2 }}>
              {run.distance} mi · {run.name}
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
            <RoutePolyline route={run.route} />
            <Circle
              center={START_COORDS}
              radius={5000}
              pathOptions={{
                color: "#7BBAD4",
                weight: 1.5,
                opacity: 0.4,
                fillColor: "#7BBAD4",
                fillOpacity: 0.06,
                dashArray: "6 4",
              }}
            />
            <Polyline
              positions={run.route}
              pathOptions={{ color: "#E8913A", weight: 4, opacity: 0.8, dashArray: "8 6" }}
            />
            {runs.map((r, i) => (
              <Marker
                key={r.id}
                position={r.shopCoords}
                icon={createShopIcon(i === current)}
                eventHandlers={{ click: () => setCurrent(i) }}
              />
            ))}
            <Marker position={START_COORDS} icon={startIcon} />
          </MapContainer>
        </div>

        {/* Run details card */}
        <div style={{
          borderRadius: 12,
          border: "1px solid #e0dcd7",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#fff",
        }}>
          <div style={{ fontSize: 11, color: "#bbb", marginBottom: 4 }}>destination</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, ...cursive }}>{run.name}</div>
          {run.hood && <div style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>{run.hood}</div>}
          {run.stars > 0 && (
            <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
              {Array.from({ length: 5 }, (_, j) => (
                <Star
                  key={j}
                  size={14}
                  fill={j < run.stars ? "#E8913A" : "transparent"}
                  color={j < run.stars ? "#E8913A" : "#e0dcd7"}
                />
              ))}
            </div>
          )}
          {run.note && (
            <p style={{ color: "#999", fontSize: 14, lineHeight: 1.7, margin: 0, ...handwritten }}>
              &ldquo;{run.note}&rdquo;
            </p>
          )}
        </div>

        {/* Photo count / stats card */}
        <div style={{
          borderRadius: 12,
          border: "1px solid #e0dcd7",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#faf8f5",
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#bbb", fontSize: 12 }}>
              <Camera size={14} />
              <span>{run.photos} photos</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#E8913A", ...cursive }}>
              {run.distance} mi
            </span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {Array.from({ length: Math.min(run.photos, 6) }, (_, j) => (
              <div
                key={j}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 6,
                  background: "#e8e4df",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  color: "#bbb",
                  flexShrink: 0,
                }}
              >
                {j + 1}
              </div>
            ))}
          </div>
          <div style={{ color: "#ccc", fontSize: 11, marginTop: 8 }}>
            click a run number to explore · click a pin on the map to jump to that run
          </div>
        </div>
      </div>
    </section>
  );
}
