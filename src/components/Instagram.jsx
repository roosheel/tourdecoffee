import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Instagram as InstagramIcon, ArrowUpRight } from 'lucide-react';
import instagramPosts from '../instagram-data';

const BASE = import.meta.env.BASE_URL;

export default function Instagram() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const hasPosts = instagramPosts.length > 0;

  return (
    <section id="instagram" className="instagram-section" ref={ref}>
      <div className="container">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 14,
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #fef3e6, #fce7d0)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <InstagramIcon size={20} color="#E8913A" />
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 700, margin: 0 }}>
              @tourdecoffee_runclub
            </h2>
          </motion.div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            href="https://www.instagram.com/tourdecoffee_runclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 13 }}
          >
            follow us <ArrowUpRight size={13} />
          </motion.a>
        </div>

        {hasPosts ? (
          <div className="ig-grid">
            {instagramPosts.map((post, i) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="ig-grid-item"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: 0.08 * i }}
              >
                <img
                  src={`${BASE}${post.src}`}
                  alt={post.caption || "Tour de Coffee"}
                  loading="lazy"
                />
                <div className="ig-grid-overlay">
                  <span>{post.caption || "View post"}</span>
                </div>
              </motion.a>
            ))}
          </div>
        ) : (
          <motion.a
            href="https://www.instagram.com/tourdecoffee_runclub/"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="ig-empty"
          >
            <InstagramIcon size={32} color="#E8913A" />
            <p>See every run and coffee stop over on Instagram.</p>
            <span className="ig-empty-cta">@tourdecoffee_runclub <ArrowUpRight size={14} /></span>
          </motion.a>
        )}
      </div>
    </section>
  );
}
