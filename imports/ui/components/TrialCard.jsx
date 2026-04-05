import React from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import { MatchScoreRing } from './MatchScoreRing';

export function TrialCard({ trial, matchScore, qualityReasons, dragX, isTop }) {
  const fallbackDragX = useMotionValue(0);
  const activeDragX = isTop && dragX ? dragX : fallbackDragX;

  const glowBg = useTransform(
    activeDragX,
    [-150, 0, 150],
    ['rgba(198,40,40,0.2)', 'rgba(0,0,0,0)', 'rgba(0,137,123,0.2)']
  );

  const isRecruiting = trial.status === 'RECRUITING';

  const infoLine = [trial.sponsor, trial.location]
    .filter(Boolean)
    .join(' · ');

  const Wrapper = isTop ? motion.div : 'div';

  return (
    <Wrapper
      style={{
        background: 'var(--gradient-card)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-border)',
        width: '100%',
        maxWidth: '380px',
        minHeight: '520px',
        position: 'relative',
        overflow: 'hidden',
        padding: '25px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        cursor: isTop ? 'grab' : 'default',
      }}
    >
      {/* Directional glow overlay */}
      {isTop && dragX && (
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex: 1,
            background: glowBg,
          }}
        />
      )}

      {/* Row 1 — phase + status + score ring */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div>
          <span
            style={{
              background: 'var(--color-bg-3)',
              color: 'var(--color-text-muted)',
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: '999px',
              fontFamily: 'var(--font-mono)',
              display: 'inline-block',
              marginBottom: '8px',
            }}
          >
            {trial.phase || 'N/A'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: isRecruiting
                  ? 'var(--color-accept)'
                  : 'var(--color-text-muted)',
                flexShrink: 0,
                animation: isRecruiting
                  ? 'pulse-glow 2s ease-in-out infinite'
                  : 'none',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                color: isRecruiting
                  ? 'var(--color-accept)'
                  : 'var(--color-text-muted)',
              }}
            >
              {isRecruiting ? 'recruiting' : 'closed'}
            </span>
          </div>
        </div>

        <MatchScoreRing score={matchScore} size={72} />
      </div>

      {/* Row 2 — title */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(17px, 3vw, 21px)',
          color: 'var(--color-text)',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {trial.title}
      </div>

      {/* Row 3 — info line */}
      {infoLine && (
        <div
          style={{
            fontSize: '13px',
            color: 'var(--color-text-muted)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {infoLine}
        </div>
      )}

      {/* Row 4 — quality reasons */}
      {qualityReasons && qualityReasons.length > 0 && (
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px',
            }}
          >
            why you match
          </div>
          {qualityReasons.slice(0, 3).map((reason, i) => (
            <div
              key={i}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span
                style={{ color: 'var(--color-accept)', fontSize: '12px' }}
              >
                ✓
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text)' }}>
                {reason}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Row 5 — swipe hint footer */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
          swipe to decide
        </span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-decline)' }}>
            ← pass
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-accept)' }}>
            save →
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

export default TrialCard;
