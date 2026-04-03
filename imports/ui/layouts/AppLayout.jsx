import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';

export function AppLayout({ children }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {isDesktop ? (
        <div
          style={{
            width: '220px',
            background: 'var(--color-bg-2)',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
          }}
        >
          SideNav
        </div>
      ) : (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60px',
            background: 'var(--color-bg-2)',
          }}
        >
          BottomNav
        </div>
      )}

      <main
        style={{
          marginLeft: isDesktop ? '220px' : '0',
          paddingBottom: isDesktop ? '0' : '70px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
