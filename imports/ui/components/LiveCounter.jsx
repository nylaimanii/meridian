import React from 'react';
import { useTracker, useSubscribe } from 'meteor/react-meteor-data';
import { Trials } from '../../api/trials/collection';

export function LiveCounter() {
  const isLoading = useSubscribe('trials.all');
  const count = useTracker(() => Trials.find({}).count());

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'var(--color-accept)',
          animation: 'pulse-glow 2s ease-in-out infinite',
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
        {isLoading() ? (
          '— trials. updated live.'
        ) : (
          <>
            <span style={{ color: 'var(--color-accept)' }}>+ {count}</span>
            {' trials. updated live.'}
          </>
        )}
      </span>
    </div>
  );
}
