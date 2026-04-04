import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Trials } from '../../api/trials/collection';
import { SwipeDeck } from '../components/SwipeDeck';
import { ActionBar } from '../components/ActionBar';
import { LiveCounter } from '../components/LiveCounter';
import { MatchModal } from '../components/MatchModal';

export function Discover() {
  const navigate = useNavigate();
  const isLoading = useSubscribe('trials.all');
  const trials = useTracker(() => Trials.find({}).fetch());
  const deckRef = useRef(null);
  const [matchModalTrial, setMatchModalTrial] = useState(null);

  function handleSwipeRight(trial) {
    Meteor.call('matches.save', trial.nctId);
    setMatchModalTrial(trial);
  }

  function handleSwipeLeft(trial) {
    Meteor.call('matches.pass', trial.nctId);
  }

  function handleSuperMatch(trial) {
    Meteor.call('matches.super', trial.nctId);
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px',
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
              if (currentTrial) {
                Meteor.call('matches.super', currentTrial.nctId);
              }
              deck.handleSwipeRight();
            }}
          />
        </>
      )}

      {/* Match modal */}
      <MatchModal
        isOpen={!!matchModalTrial}
        trial={matchModalTrial}
        onClose={() => setMatchModalTrial(null)}
        onViewTrial={(nctId) => {
          navigate('/trial/' + nctId);
          setMatchModalTrial(null);
        }}
      />
    </div>
  );
}
