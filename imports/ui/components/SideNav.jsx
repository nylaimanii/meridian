import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

const NAV_ITEMS = [
  {
    to: '/discover',
    label: 'Discover',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    to: '/matches',
    label: 'Matches',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    to: '/discover',
    label: 'Search',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export function SideNav({ isDemo = false }) {
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user());
  const email = user?.emails?.[0]?.address;

  return (
    <nav
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '220px',
        background: 'var(--color-bg-2)',
        borderRight: '1px solid var(--color-border)',
        zIndex: 'var(--z-overlay)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '32px 24px',
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--color-text)',
        }}
      >
        meridian
      </div>

      <hr style={{ borderColor: 'var(--color-border)', borderTop: 'none', margin: 0 }} />

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={label}
            to={isDemo ? `${to}?demo=true` : to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 24px',
              fontSize: '14px',
              textDecoration: 'none',
              borderLeft: isActive
                ? '3px solid var(--color-primary-bright)'
                : '3px solid transparent',
              background: isActive ? 'rgba(21, 101, 192, 0.1)' : 'transparent',
              color: isActive ? 'var(--color-primary-bright)' : 'var(--color-text-muted)',
            })}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>

      <div style={{ marginTop: 'auto' }}>
        {isDemo ? (
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              margin: '16px 24px',
              fontFamily: 'var(--font-body)',
              display: 'block',
            }}
          >
            sign up free
          </button>
        ) : (
          <>
            {email && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                  padding: '10px 24px',
                  wordBreak: 'break-all',
                }}
              >
                {email}
              </div>
            )}
            <button
              onClick={() => Meteor.logout()}
              style={{
                color: 'var(--color-decline)',
                fontSize: '12px',
                padding: '0 24px 24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
