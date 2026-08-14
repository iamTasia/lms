import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BACKGROUNDS = ['/bg1.jpg', '/bg2.jpg', '/bg3.jpg'];
const ROTATION_MS = 5000;

function pickNextIndex(prev) {
  // Random, but never the same as the previous frame.
  if (BACKGROUNDS.length <= 1) return 0;
  let next = prev;
  while (next === prev) {
    next = Math.floor(Math.random() * BACKGROUNDS.length);
  }
  return next;
}

export default function Homepage() {
  const { user } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    // Preload all three so the first swap has no network delay.
    BACKGROUNDS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const id = setInterval(() => {
      const next = pickNextIndex(prevIndexRef.current);
      prevIndexRef.current = next;
      setActiveIndex(next);
    }, ROTATION_MS);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="homepage-hero">
      <div className="homepage-hero__bg" aria-hidden="true">
        {BACKGROUNDS.map((src, i) => (
          <div
            key={src}
            className={`homepage-hero__bg-layer ${
              i === activeIndex ? 'is-active' : ''
            }`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div className="homepage-hero__content">
        <h1 className="homepage-hero__title">
          Smart Library
          <br />
          <span className="homepage-hero__title-italic">Management</span>
        </h1>
        <p className="homepage-hero__lede">
          A refined collection and circulation system for university communities —
          built on the quiet conviction that knowledge deserves to be tended well.
        </p>

        <div className="homepage-hero__actions">
          <Link to="/books" className="homepage-hero__cta homepage-hero__cta--primary">
            Browse the Catalog
            <span className="homepage-hero__cta-arrow" aria-hidden="true">→</span>
          </Link>
          {!user && (
            <Link to="/register" className="homepage-hero__cta homepage-hero__cta--ghost">
              Get Started
            </Link>
          )}
          {user && (
            <Link to="/dashboard" className="homepage-hero__cta homepage-hero__cta--ghost">
              Your Dashboard
            </Link>
          )}
        </div>

        <div className="homepage-hero__meta">
          <span className="homepage-hero__meta-item">
            <span className="homepage-hero__meta-dot" /> 1,200+ titles indexed
          </span>
          <span className="homepage-hero__meta-divider" aria-hidden="true">·</span>
          <span className="homepage-hero__meta-item">Real-time circulation</span>
          <span className="homepage-hero__meta-divider" aria-hidden="true">·</span>
          <span className="homepage-hero__meta-item">Built for faculty &amp; students</span>
        </div>
      </div>

      <a href="#homepage-below" className="homepage-hero__scroll" aria-label="Scroll for more">
        <span>Scroll</span>
        <span className="homepage-hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  );
}
