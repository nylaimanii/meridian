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

const FEATURES = [
  {
    bg: 'rgba(71,197,245,0.06)',
    icon: '🎯',
    title: 'condition matching',
    desc: 'Tell us what you\'re managing. We surface trials that specifically study your condition — filtered from 200,000+ active studies.',
  },
  {
    bg: 'rgba(21,101,192,0.08)',
    icon: '📍',
    title: 'geo-filtered results',
    desc: 'Only see trials you can actually reach. Set your location and travel radius and we handle the distance math.',
  },
  {
    bg: 'rgba(0,137,123,0.06)',
    icon: '⚡',
    title: 'real-time trial data',
    desc: 'Pulled live from ClinicalTrials.gov. Every card in your deck is an active, recruiting study updated continuously.',
  },
];

const STEPS = [
  {
    badge: 'Step 1',
    title: 'tell us about you',
    desc: 'Complete a short intake in under a minute. We ask about your conditions, age, location, and how far you\'re willing to travel.',
    bullets: ['Takes under 60 seconds', 'No account needed for demo', 'Saves to your profile when you sign up'],
    emoji: '🧬',
    bg: 'rgba(71,197,245,0.06)',
  },
  {
    badge: 'Step 2',
    title: 'swipe through your matches',
    desc: 'Browse a personalized deck of recruiting trials. Condition-matched trials rise to the top. Swipe right to save, left to pass.',
    bullets: ['Condition-boosted ranking', 'Distance-filtered by your radius', 'Real trial data from ClinicalTrials.gov'],
    emoji: '📋',
    bg: 'rgba(21,101,192,0.08)',
  },
  {
    badge: 'Step 3',
    title: 'save and connect',
    desc: 'Matched trials land in your saved list with full details — phase, location, eligibility, and sponsor contact info.',
    bullets: ['Full trial details on every card', 'Saved matches in your profile', 'Direct links to study coordinators'],
    emoji: '✅',
    bg: 'rgba(0,137,123,0.06)',
  },
];

const STATS = [
  { number: '200,000+', label: 'active recruiting trials' },
  { number: '< 60s', label: 'to your first match' },
  { number: '100%', label: 'free for patients' },
];

export function Landing() {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div style={{ background: 'var(--color-bg)', overflowX: 'hidden' }}>

      {/* ── Section 1: Hero ────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

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
            background: 'radial-gradient(circle, rgba(21,101,192,0.12) 0%, transparent 70%)',
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
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(2,11,19,0.8) 100%)',
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
          {['your next chapter', 'might already be', 'waiting in a lab.'].map((line, i) => (
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
          ))}

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

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            onClick={() => navigate('/login')}
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
            style={{
              background: btnHovered ? 'var(--color-primary-glow)' : 'var(--color-primary)',
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

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onClick={() => navigate('/discover?demo=true')}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              fontSize: '15px',
              padding: '12px 28px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              alignSelf: isDesktop ? 'flex-start' : 'center',
            }}
          >
            try a demo →
          </motion.button>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{trial.tag}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary-bright)', fontWeight: 600 }}>{trial.match}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pulsing scroll arrow */}
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '22px',
            color: 'var(--color-text-muted)',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          ↓
        </motion.div>
      </div>

      {/* ── Section 2: Features ────────────────────────────────────── */}
      <div style={{ background: 'var(--color-bg)', padding: '120px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '72px' }}>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-primary-bright)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            BUILT FOR PATIENTS
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'var(--color-text)',
              marginBottom: '16px',
            }}
          >
            everything you need to find your trial
          </div>
          <div style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>
            condition matching · geo-filtering · real-time data
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto',
          }}
        >
          {FEATURES.map((card, index) => (
            <motion.div
              key={card.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              style={{
                flex: 1,
                borderRadius: 'var(--radius-card)',
                padding: '0 0 32px 0',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                background: 'var(--color-bg-2)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  background: card.bg,
                }}
              >
                {card.icon}
              </div>
              <div style={{ padding: '0 28px', paddingTop: '28px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '20px',
                    color: 'var(--color-text)',
                    fontWeight: 600,
                    marginBottom: '10px',
                  }}
                >
                  {card.title}
                </div>
                <div style={{ fontSize: '15px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {card.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Section 3: How It Works ────────────────────────────────── */}
      <div style={{ background: 'var(--color-bg-2)', padding: '120px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-primary-bright)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}
          >
            HOW IT WORKS
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'var(--color-text)',
            }}
          >
            from profile to match in 60 seconds
          </div>
        </div>

        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {STEPS.map((step, index) => {
            const isOdd = index % 2 === 0;
            const textBlock = (
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'inline-block',
                    background: 'rgba(71,197,245,0.1)',
                    color: 'var(--color-primary-bright)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: '16px',
                  }}
                >
                  {step.badge}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(24px, 3vw, 34px)',
                    color: 'var(--color-text)',
                    marginBottom: '16px',
                  }}
                >
                  {step.title}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: 'var(--color-text-muted)',
                    lineHeight: 1.7,
                    marginBottom: '24px',
                  }}
                >
                  {step.desc}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {step.bullets.map((bullet) => (
                    <div key={bullet} style={{ marginBottom: '10px' }}>
                      <span style={{ color: 'var(--color-primary-bright)', marginRight: '10px' }}>✓</span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
            const visualBlock = (
              <div
                style={{
                  flex: 1,
                  borderRadius: 'var(--radius-card)',
                  height: isDesktop ? '280px' : '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '80px',
                  background: step.bg,
                  border: '1px solid var(--color-border)',
                }}
              >
                {step.emoji}
              </div>
            );

            return (
              <motion.div
                key={step.badge}
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: isOdd ? -40 : 40 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '60px',
                  marginBottom: '80px',
                  flexDirection: isDesktop
                    ? isOdd ? 'row' : 'row-reverse'
                    : 'column',
                }}
              >
                {textBlock}
                {visualBlock}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Section 4: Stats bar ───────────────────────────────────── */}
      <div
        style={{
          background: 'var(--color-bg-3)',
          padding: '64px 24px',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isDesktop ? 'row' : 'column',
            gap: '48px',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{ textAlign: 'center' }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  color: 'var(--color-primary-bright)',
                  fontWeight: 700,
                }}
              >
                {stat.number}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: 'center' }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Section 5: CTA banner ──────────────────────────────────── */}
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 40 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #47c5f5 100%)',
          padding: '100px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            color: 'white',
            marginBottom: '16px',
          }}
        >
          ready to find your trial?
        </div>
        <div
          style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '40px',
          }}
        >
          Join thousands of patients already using meridian. No credit card, no commitment.
        </div>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'white',
              color: 'var(--color-primary)',
              padding: '16px 40px',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            find your match →
          </button>
          <button
            onClick={() => navigate('/discover?demo=true')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.5)',
              color: 'white',
              padding: '16px 36px',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            try the demo →
          </button>
        </div>
      </motion.div>

    </div>
  );
}
