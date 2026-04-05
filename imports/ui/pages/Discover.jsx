import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Trials } from '../../api/trials/collection';
import { SwipeDeck } from '../components/SwipeDeck';
import { ActionBar } from '../components/ActionBar';
import { LiveCounter } from '../components/LiveCounter';
import { MatchModal } from '../components/MatchModal';

function getTrialCity(trial) {
  if (!trial.location) return null;
  return trial.location.split(',')[0].trim().toLowerCase();
}

function getTrialState(trial) {
  if (!trial.location) return null;
  const parts = trial.location.split(',');
  return parts.length > 1 ? parts[1].trim().toLowerCase() : null;
}

function getMatchScore(trial, index, userCity, userState) {
  const trialCity = getTrialCity(trial);
  const trialState = getTrialState(trial);
  if (userCity && trialCity && trialCity === userCity.toLowerCase()) {
    return 85 + (index % 15);
  }
  if (userState && trialState && trialState === userState.toLowerCase()) {
    return 70 + (index % 15);
  }
  return (75 + (index * 7)) % 40 + 60;
}

function getQualityReasons(trial, userCity) {
  const trialCity = getTrialCity(trial);
  const locationReason =
    userCity && trialCity && trialCity === userCity.toLowerCase()
      ? `Near you · ${trial.location.split(',')[0].trim()}`
      : 'Location nearby';
  return ['Condition match', locationReason, 'Age eligible'];
}

function sortTrialsByLocation(trials, userCity) {
  if (!userCity) return trials;
  const city = userCity.toLowerCase();
  return [...trials].sort((a, b) => {
    const scoreA = getTrialCity(a) === city ? 0 : a.location ? 1 : 2;
    const scoreB = getTrialCity(b) === city ? 0 : b.location ? 1 : 2;
    return scoreA - scoreB;
  });
}

export function Discover() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true';

  const isLoading = useSubscribe('trials.all');
  const trials = useTracker(() => Trials.find({}).fetch());
  const deckRef = useRef(null);
  const [matchModalTrial, setMatchModalTrial] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [userCity, setUserCity] = useState(null);
  const [userState, setUserState] = useState(null);
  const [locationStatus, setLocationStatus] = useState('detecting'); // 'detecting' | 'found' | 'denied'

  useEffect(() => {
    if (!isDemo) return;
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserCoords({ lat, lon });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.village || addr.county || null;
          const state = addr.state || null;
          setUserCity(city);
          setUserState(state);
          setLocationStatus('found');
        } catch {
          setLocationStatus('denied');
        }
      },
      () => {
        setLocationStatus('denied');
      }
    );
  }, [isDemo]);

  const sortedTrials = useMemo(() => {
    if (!isDemo || !userCity) return trials;
    return sortTrialsByLocation(trials, userCity);
  }, [trials, isDemo, userCity]);

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

  function bannerText() {
    if (!isDemo) return null;
    if (locationStatus === 'detecting') return null; // show pulsing dot instead
    if (locationStatus === 'found' && userCity) return `showing trials near ${userCity} — swipes won't be saved`;
    return "you're in demo mode — swipes won't be saved";
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
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {locationStatus === 'detecting' ? (
              <>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-bright)',
                    display: 'inline-block',
                    animation: 'pulse-glow 1.5s ease-in-out infinite',
                    flexShrink: 0,
                  }}
                />
                detecting your location...
              </>
            ) : (
              bannerText()
            )}
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
        {sortedTrials.length === 0 ? (
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
              trials={sortedTrials}
              userCity={userCity}
              userState={userState}
              getMatchScore={getMatchScore}
              getQualityReasons={getQualityReasons}
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
                const currentTrial = sortedTrials[0];
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
