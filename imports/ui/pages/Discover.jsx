import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Trials } from '../../api/trials/collection';
import { SwipeDeck } from '../components/SwipeDeck';
import { ActionBar } from '../components/ActionBar';
import { LiveCounter } from '../components/LiveCounter';
import { MatchModal } from '../components/MatchModal';

export function Discover() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true';

  const isLoading = useSubscribe('trials.all');
  const trials = useTracker(() => Trials.find({}).fetch());
  const deckRef = useRef(null);
  const [matchModalTrial, setMatchModalTrial] = useState(null);

  function handleSwipeRight(trial) {
    if (!isDemo) Meteor.call('matches.save', trial.nctId);
    setMatchModalTrial(trial);
  }

  function handleSwipeLeft(trial) {
    if (!isDemo) Meteor.call('matches.pass', trial.nctId);
  }

  function handleSuperMatch(trial) {
    if (!isDemo) Meteor.call('matches.super', trial.nctId);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Demo banner */}
      {isDemo && (
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            background: 'rgba(21,101,192,0.15)',
            borderBottom: '1px solid var(--color-primary)',
            padding: '10px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            you're in demo mode — swipes won't be saved
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
              }}
            >
              sign up free
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
              }}
            >
              exit demo
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 16px',
          width: '100%',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '420px',
            marginBottom: '16px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              color: 'var(--color-text)',
            }}
          >
            discover
          </span>
          <LiveCounter />
        </div>

        {/* Deck or loading */}
        {trials.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '400px',
              color: 'var(--color-text-muted)',
            }}
          >
            loading trials...
          </div>
        ) : (
          <>
            <SwipeDeck
              ref={deckRef}
              trials={trials}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
              onSuperMatch={handleSuperMatch}
            />
            <ActionBar
              onPass={() => deckRef.current?.handleSwipeLeft()}
              onSave={() => deckRef.current?.handleSwipeRight()}
              onSuper={() => {
                const deck = deckRef.current;
                if (!deck) return;
                const currentTrial = trials[0];
                if (currentTrial && !isDemo) {
                  Meteor.call('matches.super', currentTrial.nctId);
                }
                deck.handleSwipeRight();
              }}
            />
          </>
        )}
      </div>

      {/* Match modal */}
      <MatchModal
        isOpen={!!matchModalTrial}
        trial={matchModalTrial}
        onClose={() => setMatchModalTrial(null)}
        onViewTrial={(nctId) => {
          navigate('/trial/' + nctId + (isDemo ? '?demo=true' : ''));
          setMatchModalTrial(null);
        }}
      />
    </div>
  );
}
