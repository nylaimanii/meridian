import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { SideNav } from '../components/SideNav';
import { BottomNav } from '../components/BottomNav';

export function AppLayout({ children }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {isDesktop ? <SideNav /> : <BottomNav />}

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
