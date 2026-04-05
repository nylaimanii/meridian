import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useWindowSize } from '../hooks/useWindowSize';
import { SideNav } from '../components/SideNav';
import { BottomNav } from '../components/BottomNav';

export function AppLayout({ children }) {
  const { width } = useWindowSize();
  const isDesktop = width >= 768;
  const location = useLocation();
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true';
  const user = useTracker(() => Meteor.user());
  const loggingIn = useTracker(() => Meteor.loggingIn());

  if (!isDemo && !loggingIn && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {isDesktop ? <SideNav isDemo={isDemo} /> : <BottomNav isDemo={isDemo} />}

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
