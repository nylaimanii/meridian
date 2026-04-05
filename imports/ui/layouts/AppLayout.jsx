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

  const { user, loggingIn } = useTracker(() => ({
    user: Meteor.user(),
    loggingIn: Meteor.loggingIn(),
  }));

  // While Meteor is resolving the session, show nothing to avoid flash-redirect
  if (!isDemo && loggingIn) {
    return null;
  }

  // Not demo and no user — redirect to login
  if (!isDemo && !user) {
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
