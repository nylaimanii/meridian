import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { SavedMatches } from '../../api/matches/collection';

export function Profile() {
  const navigate = useNavigate();
  useSubscribe('matches.mine');

  const { user, savedCount, superCount } = useTracker(() => {
    const u = Meteor.user();
    const saved = SavedMatches.find({ status: 'saved' }).count();
    const supers = SavedMatches.find({ status: 'super' }).count();
    return { user: u, savedCount: saved, superCount: supers };
  });

  const email = user?.emails?.[0]?.address;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: '500px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            color: 'var(--color-text)',
            marginBottom: '8px',
          }}
        >
          profile
        </h1>

        {email && (
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '15px',
              marginBottom: '32px',
            }}
          >
            {email}
          </p>
        )}

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              flex: 1,
              background: 'var(--color-bg-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-accept)',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {savedCount}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              saved
            </div>
          </div>

          <div
            style={{
              flex: 1,
              background: 'var(--color-bg-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-gold)',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              {superCount}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              super matches
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            Meteor.logout(() => navigate('/'));
          }}
          style={{
            color: 'var(--color-decline)',
            background: 'transparent',
            border: '1px solid var(--color-decline)',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: '15px',
            fontFamily: 'var(--font-body)',
          }}
        >
          log out
        </button>
      </div>
    </div>
  );
}
