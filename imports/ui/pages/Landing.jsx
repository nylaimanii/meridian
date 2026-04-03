import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWindowSize } from '../hooks/useWindowSize';
import { LiveCounter } from '../components/LiveCounter';

const MOCK_TRIALS = [
  {
    title: 'Phase III: Immunotherapy for Early-Stage NSCLC',
    tag: 'Oncology · Phase III',
    match: '94% match',
    accent: true,
  },
  {
    title: 'Novel mRNA Vaccine for Type 2 Diabetes Prevention',
    tag: 'Endocrinology · Phase II',
    match: '87% match',
    accent: false,
  },
  {
    title: 'CAR-T Cell Therapy in Relapsed B-Cell Lymphoma',
    tag: 'Hematology · Phase II',
    match: '81% match',
    accent: false,
  },
];

export function Landing() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      style={{
        background: 'var(--color-bg)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {/* Layer 1 — deep background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(21,101,192,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(71,197,245,0.05) 0%, transparent 50%)',
          zIndex: 0,
        }}
      />

      {/* Layer 2 — animated orb */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(21,101,192,0.12) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 3 — vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(2,11,19,0.8) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Layer 4 — main content */}
      <div
        style={{
          position: isDesktop ? 'absolute' : 'relative',
          top: isDesktop ? '50%' : 'auto',
          transform: isDesktop ? 'translateY(-50%)' : 'none',
          left: isDesktop ? '8%' : 'auto',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: isDesktop ? '0 24px' : '80px 24px 40px',
          maxWidth: '600px',
          width: '100%',
          margin: isDesktop ? '0' : '0 auto',
          alignItems: isDesktop ? 'flex-start' : 'center',
          textAlign: isDesktop ? 'left' : 'center',
        }}
      >
        {/* Headline lines */}
        {['your next chapter', 'might already be', 'waiting in a lab.'].map(
          (line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.3 }}
              style={{ lineHeight: 1.15 }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 5vw, 60px)',
                  color: 'var(--color-text)',
                  lineHeight: 1.15,
                  display: 'block',
                }}
              >
                {line}
              </span>
            </motion.div>
          )
        )}

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--color-text-muted)',
            maxWidth: '480px',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          meridian matches you to clinical trials that fit your life — in seconds.
        </motion.p>

        {/* CTA button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          onClick={() => navigate('/login')}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            background: btnHovered
              ? 'var(--color-primary-glow)'
              : 'var(--color-primary)',
            color: 'white',
            fontSize: '18px',
            fontWeight: 600,
            padding: '16px 40px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            border: 'none',
            fontFamily: 'var(--font-body)',
            alignSelf: isDesktop ? 'flex-start' : 'center',
            transition: 'background 0.15s ease',
          }}
        >
          find your match →
        </motion.button>

        {/* Live counter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <LiveCounter />
        </motion.div>
      </div>

      {/* Desktop mock phone frame */}
      {isDesktop && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '380px',
            height: '480px',
            borderRadius: '32px',
            border: '2px solid var(--color-border)',
            background: 'var(--color-bg-2)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            zIndex: 10,
          }}
        >
          {/* Phone header */}
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}
          >
            Top matches for you
          </div>

          {/* Mock trial cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_TRIALS.map((trial, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--color-bg-3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                  borderLeft: trial.accent
                    ? '3px solid var(--color-primary-bright)'
                    : '1px solid var(--color-border)',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text)',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    marginBottom: '8px',
                  }}
                >
                  {trial.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {trial.tag}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-primary-bright)',
                      fontWeight: 600,
                    }}
                  >
                    {trial.match}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
