import { useMemo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, MapPin, Star, Coffee, Route, Calendar } from 'lucide-react';
import { runs, coffeeLog } from '../data';

export default function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const data = useMemo(() => {
    const totalMiles = runs.reduce((sum, r) => sum + r.distance, 0);
    const avgDistance = totalMiles / runs.length;
    const longest = runs.reduce((max, r) => r.distance > max.distance ? r : max, runs[0]);
    const shortest = runs.reduce((min, r) => r.distance < min.distance ? r : min, runs[0]);

    // Unique shops (by coords proximity)
    const uniqueShops = [];
    for (const run of runs) {
      const exists = uniqueShops.some(s =>
        Math.abs(s[0] - run.shopCoords[0]) < 0.001 &&
        Math.abs(s[1] - run.shopCoords[1]) < 0.001
      );
      if (!exists) uniqueShops.push(run.shopCoords);
    }

    // Top rated shops (stars > 0)
    const ratedRuns = runs.filter(r => r.stars > 0);
    const topRated = [...ratedRuns].sort((a, b) => b.stars - a.stars).slice(0, 5);

    // Neighborhood frequency
    const hoodCounts = {};
    for (const r of runs) {
      if (r.hood) {
        hoodCounts[r.hood] = (hoodCounts[r.hood] || 0) + 1;
      }
    }
    const topHoods = Object.entries(hoodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Most visited shops (by coords)
    const shopVisits = {};
    for (const run of runs) {
      const key = `${run.shopCoords[0].toFixed(3)},${run.shopCoords[1].toFixed(3)}`;
      if (!shopVisits[key]) shopVisits[key] = { name: run.name, count: 0 };
      shopVisits[key].count++;
    }
    const mostVisited = Object.values(shopVisits)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalMiles: totalMiles.toFixed(0),
      avgDistance: avgDistance.toFixed(1),
      totalRuns: runs.length,
      uniqueShops: uniqueShops.length,
      longest,
      shortest,
      topRated,
      topHoods,
      mostVisited,
    };
  }, []);

  const statCards = [
    { icon: Route, label: "Total Miles", value: data.totalMiles, color: "#E8913A" },
    { icon: Coffee, label: "Unique Shops", value: data.uniqueShops, color: "#7BBAD4" },
    { icon: TrendingUp, label: "Avg Distance", value: `${data.avgDistance} mi`, color: "#E8913A" },
    { icon: Calendar, label: "Total Runs", value: data.totalRuns, color: "#7BBAD4" },
  ];

  return (
    <section id="stats" className="stats-section" ref={ref}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 32,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            <h2 style={{ fontSize: 40, fontWeight: 700, margin: "0 0 4px" }}>
              By the Numbers
            </h2>
            <p className="font-hand" style={{ color: "#bbb", fontSize: 15, margin: 0 }}>
              {data.totalRuns} runs and counting
            </p>
          </motion.div>
        </div>

        {/* Top stat cards */}
        <div className="stats-top-grid">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              className="stats-big-card"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              <card.icon size={20} color={card.color} style={{ marginBottom: 8 }} />
              <div className="font-cursive" style={{ fontSize: 36, fontWeight: 700, lineHeight: 1, color: card.color }}>
                {card.value}
              </div>
              <div style={{ fontSize: 12, color: "#999", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                {card.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail panels */}
        <div className="stats-detail-grid">
          {/* Records */}
          <motion.div
            className="stats-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <div className="stats-panel-title">
              <TrendingUp size={14} color="#E8913A" />
              Records
            </div>
            <div className="stats-record-row">
              <span className="stats-record-label">Longest run</span>
              <span className="stats-record-value">{data.longest.distance} mi</span>
            </div>
            <div style={{ fontSize: 12, color: "#bbb", marginBottom: 12 }}>{data.longest.name}</div>
            <div className="stats-record-row">
              <span className="stats-record-label">Shortest run</span>
              <span className="stats-record-value">{data.shortest.distance} mi</span>
            </div>
            <div style={{ fontSize: 12, color: "#bbb" }}>{data.shortest.name}</div>
          </motion.div>

          {/* Most visited shops */}
          <motion.div
            className="stats-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <div className="stats-panel-title">
              <Coffee size={14} color="#7BBAD4" />
              Most Visited
            </div>
            {data.mostVisited.map((shop, i) => (
              <div key={i} className="stats-list-item">
                <span className="stats-list-name">{shop.name}</span>
                <span className="stats-list-badge">{shop.count}x</span>
              </div>
            ))}
          </motion.div>

          {/* Top rated */}
          {data.topRated.length > 0 && (
            <motion.div
              className="stats-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <div className="stats-panel-title">
                <Star size={14} color="#E8913A" />
                Top Rated
              </div>
              {data.topRated.map((run, i) => (
                <div key={i} className="stats-list-item">
                  <span className="stats-list-name">{run.name}</span>
                  <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    {Array.from({ length: 5 }, (_, j) => (
                      <Star
                        key={j}
                        size={10}
                        fill={j < run.stars ? "#E8913A" : "transparent"}
                        color={j < run.stars ? "#E8913A" : "#e0dcd7"}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Top neighborhoods */}
          {data.topHoods.length > 0 && (
            <motion.div
              className="stats-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div className="stats-panel-title">
                <MapPin size={14} color="#7BBAD4" />
                Top Neighborhoods
              </div>
              {data.topHoods.map(([hood, count], i) => (
                <div key={i} className="stats-list-item">
                  <span className="stats-list-name">{hood}</span>
                  <span className="stats-list-badge">{count} runs</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
