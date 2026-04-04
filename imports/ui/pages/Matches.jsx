import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { SavedMatches } from '../../api/matches/collection';
import { Trials } from '../../api/trials/collection';

export function Matches() {
  const navigate = useNavigate();
  useSubscribe('matches.mine');
  useSubscribe('trials.all');

  const matchesWithTrials = useTracker(() => {
    const saved = SavedMatches.find({ status: { $in: ['saved', 'super'] } }).fetch();
    return saved.map((match) => ({
      match,
      trial: Trials.findOne({ nctId: match.trialId }),
    })).filter(({ trial }) => !!trial);
  });

  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        padding: '24px 16px',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--color-text)',
          marginBottom: '8px',
        }}
      >
        my matches
      </h1>
      <p
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '14px',
          marginBottom: '24px',
        }}
      >
        {matchesWithTrials.length} saved trial{matchesWithTrials.length !== 1 ? 's' : ''}
      </p>

      {matchesWithTrials.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '80px',
            gap: '16px',
          }}
        >
          <span style={{ fontSize: '48px' }}>💊</span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              color: 'var(--color-text)',
            }}
          >
            no matches yet
          </h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            start swiping to save trials
          </p>
        </div>
      ) : (
        <div style={{ maxWidth: '600px' }}>
          {matchesWithTrials.map(({ match, trial }) => (
            <div
              key={match._id}
              onClick={() => navigate('/trial/' + trial.nctId)}
              onMouseEnter={() => setHoveredId(match._id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                background: 'var(--color-bg-2)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${hoveredId === match._id ? 'var(--color-primary-bright)' : 'var(--color-border)'}`,
                padding: '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div style={{ flex: 1, marginRight: '16px' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-text)',
                    marginBottom: '6px',
                    lineHeight: 1.3,
                  }}
                >
                  {trial.title}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {[trial.sponsor, trial.location].filter(Boolean).join(' · ')}
                </div>
              </div>

              <div style={{ flexShrink: 0 }}>
                {match.status === 'super' ? (
                  <span
                    style={{
                      background: 'rgba(249,168,37,0.1)',
                      color: 'var(--color-gold)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ★ super
                  </span>
                ) : (
                  <span
                    style={{
                      background: 'rgba(0,137,123,0.1)',
                      color: 'var(--color-accept)',
                      padding: '4px 10px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    ♥ saved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
