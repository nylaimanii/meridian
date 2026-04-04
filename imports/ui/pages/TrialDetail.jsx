import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Trials } from '../../api/trials/collection';

export function TrialDetail() {
  const { id: nctId } = useParams();
  const navigate = useNavigate();
  useSubscribe('trials.single', nctId);

  const trial = useTracker(() => Trials.findOne({ nctId }));

  if (!trial) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--color-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted)',
        }}
      >
        loading trial...
      </div>
    );
  }

  const metaBadges = [trial.phase, trial.status, trial.sponsor].filter(Boolean);

  const details = [
    { label: 'Location', value: trial.location },
    { label: 'Start Date', value: trial.startDate },
    { label: 'End Date', value: trial.endDate },
    {
      label: 'Conditions',
      value: Array.isArray(trial.conditions) ? trial.conditions.join(', ') : trial.conditions,
    },
  ].filter(({ value }) => !!value);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        padding: '24px 16px',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-primary-bright)',
            cursor: 'pointer',
            fontSize: '14px',
            marginBottom: '24px',
            padding: 0,
            fontFamily: 'var(--font-body)',
          }}
        >
          ← back to matches
        </button>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 36px)',
            color: 'var(--color-text)',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          {trial.title}
        </h1>

        {/* Meta badges */}
        <div style={{ marginBottom: '4px' }}>
          {metaBadges.map((badge) => (
            <span
              key={badge}
              style={{
                background: 'var(--color-bg-2)',
                border: '1px solid var(--color-border)',
                borderRadius: '999px',
                padding: '6px 14px',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                display: 'inline-block',
                marginRight: '8px',
                marginBottom: '8px',
              }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* About section */}
        {trial.plainSummary && (
          <>
            <h2
              style={{
                fontSize: '18px',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
                marginTop: '28px',
                marginBottom: '12px',
              }}
            >
              about this trial
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-text-muted)',
                lineHeight: 1.7,
              }}
            >
              {trial.plainSummary}
            </p>
          </>
        )}

        {/* Details section */}
        {details.length > 0 && (
          <>
            <h2
              style={{
                fontSize: '18px',
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
                marginTop: '28px',
                marginBottom: '12px',
              }}
            >
              details
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px 24px',
                marginTop: '12px',
              }}
            >
              {details.map(({ label, value }) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '2px',
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: '15px', color: 'var(--color-text)' }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <button
          onClick={() =>
            window.open(`https://clinicaltrials.gov/study/${trial.nctId}`, '_blank')
          }
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '16px 32px',
            borderRadius: 'var(--radius-md)',
            fontSize: '17px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            marginTop: '32px',
            fontFamily: 'var(--font-body)',
          }}
        >
          learn more & apply →
        </button>
      </div>
    </div>
  );
}
