import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function MatchModal({ isOpen, trial, onClose, onViewTrial }) {
  if (!isOpen || !trial) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(2,11,19,0.85)',
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={{
          background: 'var(--color-bg-2)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          padding: '40px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: 'var(--shadow-card)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Animated heart */}
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 0.6, times: [0, 0.4, 1] }}
          style={{ marginBottom: '16px' }}
        >
          <span style={{ fontSize: '48px', lineHeight: 1 }}>💚</span>
        </motion.div>

        {/* Heading */}
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            color: 'var(--color-primary-bright)',
            textAlign: 'center',
            marginBottom: '8px',
          }}
        >
          it's a match!
        </div>

        {/* Trial title */}
        <div
          style={{
            fontSize: '16px',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            maxWidth: '320px',
            margin: '0 auto 32px',
            lineHeight: 1.5,
          }}
        >
          {trial.title}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '100%',
          }}
        >
          <button
            onClick={() => onViewTrial(trial.nctId)}
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            view full trial →
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--color-text-muted)',
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '16px',
              border: '1px solid var(--color-border)',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            keep swiping
          </button>
        </div>
      </motion.div>
    </div>
  );
}
