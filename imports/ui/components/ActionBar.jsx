import React from 'react';
import { motion } from 'framer-motion';

const labelStyle = {
  fontSize: '10px',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
};

export function ActionBar({ onPass, onSuper, onSave }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        padding: '20px 0',
      }}
    >
      {/* Pass */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPass}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(198,40,40,0.1)',
            border: '2px solid var(--color-decline)',
            color: 'var(--color-decline)',
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ✕
        </motion.button>
        <span style={labelStyle}>pass</span>
      </div>

      {/* Super */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSuper}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(249,168,37,0.1)',
            border: '2px solid var(--color-gold)',
            color: 'var(--color-gold)',
            fontSize: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ★
        </motion.button>
        <span style={labelStyle}>super</span>
      </div>

      {/* Save */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onSave}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(0,137,123,0.1)',
            border: '2px solid var(--color-accept)',
            color: 'var(--color-accept)',
            fontSize: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ♥
        </motion.button>
        <span style={labelStyle}>save</span>
      </div>
    </div>
  );
}
