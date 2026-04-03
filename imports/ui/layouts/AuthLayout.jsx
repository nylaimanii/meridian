import React from 'react';

export function AuthLayout({ children }) {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
}
