import React from 'react';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Trials } from '../../api/trials/collection';

export function Discover() {
  const isLoading = useSubscribe('trials.all');
  const trials = useTracker(() => Trials.find({}).fetch());

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          marginBottom: '24px',
        }}
      >
        Discover Trials
      </h1>

      {isLoading() ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Loading trials...</p>
      ) : (
        <>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>
            {trials.length} trials loaded
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {trials.slice(0, 5).map((trial) => (
              <li key={trial._id} style={{ color: 'var(--color-text)', fontSize: '14px' }}>
                {trial.title}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
