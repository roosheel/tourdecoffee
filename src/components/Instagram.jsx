import { useEffect } from 'react';
import { Instagram as InstagramIcon, ArrowUpRight } from 'lucide-react';

const cursive = { fontFamily: '"Caveat", cursive' };

export default function Instagram() {
  useEffect(() => {
    if (!document.querySelector('script[src*="elfsight"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <section id="instagram" style={{ padding: "60px 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <InstagramIcon size={20} color="#E8913A" />
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, ...cursive }}>@tourdecoffee_runclub</h2>
        </div>
        <a
          href="https://www.instagram.com/tourdecoffee_runclub/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover-lift"
          style={{
            color: "#fff",
            background: "#E8913A",
            fontSize: 12,
            fontWeight: 700,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "8px 16px",
            borderRadius: 20,
          }}
        >
          follow us <ArrowUpRight size={12} />
        </a>
      </div>
      <div className="elfsight-app-f17fe89a-6f10-4822-b8f9-ea5747bb42f3" data-elfsight-app-lazy></div>
    </section>
  );
}
