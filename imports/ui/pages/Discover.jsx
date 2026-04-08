import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSubscribe, useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Trials } from '../../api/trials/collection';
import { SwipeDeck } from '../components/SwipeDeck';
import { ActionBar } from '../components/ActionBar';
import { LiveCounter } from '../components/LiveCounter';
import { MatchModal } from '../components/MatchModal';
import { DemoIntakeForm } from '../components/DemoIntakeForm';

// ─── Geo helpers ─────────────────────────────────────────────────────────────

const US_STATE_COORDS = {
  'Alabama': { lat: 32.8, lon: -86.8 },
  'Alaska': { lat: 64.2, lon: -153.4 },
  'Arizona': { lat: 34.3, lon: -111.1 },
  'Arkansas': { lat: 34.8, lon: -92.2 },
  'California': { lat: 36.7, lon: -119.4 },
  'Colorado': { lat: 39.0, lon: -105.5 },
  'Connecticut': { lat: 41.6, lon: -72.7 },
  'Delaware': { lat: 39.0, lon: -75.5 },
  'Florida': { lat: 27.6, lon: -81.5 },
  'Georgia': { lat: 32.2, lon: -82.9 },
  'Hawaii': { lat: 20.3, lon: -156.4 },
  'Idaho': { lat: 44.4, lon: -114.5 },
  'Illinois': { lat: 40.0, lon: -89.0 },
  'Indiana': { lat: 40.3, lon: -86.1 },
  'Iowa': { lat: 42.0, lon: -93.2 },
  'Kansas': { lat: 38.5, lon: -98.4 },
  'Kentucky': { lat: 37.7, lon: -84.9 },
  'Louisiana': { lat: 31.2, lon: -91.8 },
  'Maine': { lat: 45.3, lon: -69.0 },
  'Maryland': { lat: 39.0, lon: -76.8 },
  'Massachusetts': { lat: 42.2, lon: -71.5 },
  'Michigan': { lat: 44.3, lon: -85.4 },
  'Minnesota': { lat: 46.4, lon: -93.1 },
  'Mississippi': { lat: 32.7, lon: -89.7 },
  'Missouri': { lat: 38.5, lon: -92.5 },
  'Montana': { lat: 47.0, lon: -110.5 },
  'Nebraska': { lat: 41.5, lon: -99.9 },
  'Nevada': { lat: 39.3, lon: -116.6 },
  'New Hampshire': { lat: 43.7, lon: -71.6 },
  'New Jersey': { lat: 40.1, lon: -74.7 },
  'New Mexico': { lat: 34.5, lon: -106.2 },
  'New York': { lat: 43.0, lon: -75.0 },
  'North Carolina': { lat: 35.6, lon: -79.8 },
  'North Dakota': { lat: 47.5, lon: -100.5 },
  'Ohio': { lat: 40.4, lon: -82.9 },
  'Oklahoma': { lat: 35.6, lon: -97.5 },
  'Oregon': { lat: 44.6, lon: -122.1 },
  'Pennsylvania': { lat: 41.2, lon: -77.2 },
  'Rhode Island': { lat: 41.7, lon: -71.6 },
  'South Carolina': { lat: 33.9, lon: -80.9 },
  'South Dakota': { lat: 44.4, lon: -100.2 },
  'Tennessee': { lat: 35.9, lon: -86.4 },
  'Texas': { lat: 31.0, lon: -99.0 },
  'Utah': { lat: 39.4, lon: -111.1 },
  'Vermont': { lat: 44.0, lon: -72.7 },
  'Virginia': { lat: 37.5, lon: -78.5 },
  'Washington': { lat: 47.4, lon: -121.5 },
  'West Virginia': { lat: 38.9, lon: -80.5 },
  'Wisconsin': { lat: 44.3, lon: -89.6 },
  'Wyoming': { lat: 43.0, lon: -107.6 },
  'District of Columbia': { lat: 38.9, lon: -77.0 },
};

const INTERNATIONAL_KEYWORDS = [
  'hong kong', 'china', 'jordan', 'germany', 'france', 'united kingdom',
  'canada', 'australia', 'india', 'japan', 'korea', 'brazil', 'spain',
  'italy', 'netherlands', 'belgium', 'sweden', 'denmark', 'switzerland',
  'austria', 'norway', 'finland', 'poland', 'portugal', 'greece', 'turkey',
  'israel', 'singapore', 'taiwan', 'mexico', 'argentina', 'chile',
  'south africa', 'egypt', 'thailand', 'vietnam', 'indonesia', 'philippines',
  'new zealand', 'ireland', 'scotland', 'ukraine', 'russia', 'czech',
];

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getTrialState(trial) {
  if (!trial.location) return null;
  const parts = trial.location.split(',');
  return parts.length > 1 ? parts[parts.length - 1].trim() : null;
}

function isInternational(trial) {
  if (!trial.location) return false;
  const loc = trial.location.toLowerCase();
  return INTERNATIONAL_KEYWORDS.some((kw) => loc.includes(kw));
}

function getTrialDistance(trial, userCoords) {
  if (!userCoords || !trial.location) return null;
  const state = getTrialState(trial);
  if (!state) return null;
  const coords = US_STATE_COORDS[state];
  if (!coords) return null;
  return haversineDistance(userCoords.lat, userCoords.lon, coords.lat, coords.lon);
}

function filterAndSortTrials(trials, userCoords, maxMiles) {
  const results = [];
  for (const trial of trials) {
    if (isInternational(trial)) continue;
    if (!trial.location) {
      results.push({ trial, distance: null });
      continue;
    }
    const state = getTrialState(trial);
    if (!state || !US_STATE_COORDS[state]) continue; // non-US, skip
    const dist = haversineDistance(
      userCoords.lat, userCoords.lon,
      US_STATE_COORDS[state].lat, US_STATE_COORDS[state].lon
    );
    if (dist <= maxMiles) {
      results.push({ trial, distance: dist });
    }
  }
  results.sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
  return results;
}

function getMatchScore(trial, index, userCoords) {
  const dist = getTrialDistance(trial, userCoords);
  if (dist === null) return (75 + (index * 7)) % 40 + 60;
  if (dist <= 50)  return 85 + (index % 15);
  if (dist <= 150) return 75 + (index % 10);
  if (dist <= 300) return 65 + (index % 10);
  return (75 + (index * 7)) % 40 + 60;
}

function getQualityReasons(trial, userCoords, userCity) {
  const dist = getTrialDistance(trial, userCoords);
  let locationReason = 'Location nearby';
  if (dist !== null) {
    if (dist <= 50) locationReason = userCity ? `Near you · ${userCity}` : 'Close to you';
    else locationReason = `~${Math.round(dist)} mi away`;
  }
  return ['Condition match', locationReason, 'Age eligible'];
}

// ─── Condition matching helper ────────────────────────────────────────────────

function trialConditionMatch(trial, userConditions) {
  if (!userConditions || userConditions.length === 0) return null;
  if (!trial.conditions || trial.conditions.length === 0) return null;
  const userWords = userConditions.map((c) => c.toLowerCase());
  for (const trialCond of trial.conditions) {
    const trialCondLower = trialCond.toLowerCase();
    for (const userCond of userConditions) {
      if (trialCondLower.includes(userCond.toLowerCase())) {
        return userCond;
      }
    }
    for (const word of userWords) {
      if (trialCondLower.includes(word)) {
        return userConditions[userWords.indexOf(word)];
      }
    }
  }
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [locationStatus, setLocationStatus] = useState('detecting');
  const [demoProfile, setDemoProfile] = useState(null);

  useEffect(() => {
    if (!isDemo) return;
    if (!navigator.geolocation) { setLocationStatus('denied'); return; }
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
          setUserCity(addr.city || addr.town || addr.village || addr.county || null);
          setLocationStatus('found');
        } catch {
          setLocationStatus('denied');
        }
      },
      () => setLocationStatus('denied')
    );
  }, [isDemo]);

  const { sortedTrials, trialCount, activeRadius } = useMemo(() => {
    if (!isDemo || !userCoords) return { sortedTrials: trials, trialCount: null, activeRadius: 300 };

    let filtered = filterAndSortTrials(trials, userCoords, 300);
    let radius = 300;
    if (filtered.length < 5) {
      filtered = filterAndSortTrials(trials, userCoords, 500);
      radius = 500;
    }

    let result = filtered.map(({ trial }) => trial);

    if (demoProfile?.conditions?.length > 0) {
      const matched = [];
      const unmatched = [];
      for (const trial of result) {
        if (trialConditionMatch(trial, demoProfile.conditions)) {
          matched.push(trial);
        } else {
          unmatched.push(trial);
        }
      }
      result = [...matched, ...unmatched];
    }

    return {
      sortedTrials: result,
      trialCount: filtered.length,
      activeRadius: radius,
    };
  }, [trials, isDemo, userCoords, demoProfile]);

  // Wrap score/reason functions to capture current coords
  function scoreForCard(trial, index) {
    const base = getMatchScore(trial, index, userCoords);
    const match = trialConditionMatch(trial, demoProfile?.conditions || []);
    if (match) return Math.min(99, base + 10);
    return base;
  }
  function reasonsForCard(trial) {
    const reasons = getQualityReasons(trial, userCoords, userCity);
    const match = trialConditionMatch(trial, demoProfile?.conditions || []);
    if (match) {
      return [match, reasons[1], reasons[2]];
    }
    return reasons;
  }

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
    if (locationStatus === 'detecting') return null;
    if (locationStatus === 'found' && userCity && trialCount !== null) {
      return `showing ${trialCount} trials within ${activeRadius} miles of ${userCity} — swipes won't be saved`;
    }
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
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: 'var(--color-primary-bright)', display: 'inline-block',
                  animation: 'pulse-glow 1.5s ease-in-out infinite', flexShrink: 0,
                }} />
                detecting your location...
              </>
            ) : bannerText()}
            {demoProfile && (
              <button
                onClick={() => setDemoProfile(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary-bright)', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-body)', marginLeft: '8px' }}
              >
                edit profile
              </button>
            )}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: 'var(--color-primary)', color: 'white',
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                border: 'none', cursor: 'pointer', fontSize: '13px',
                fontFamily: 'var(--font-body)',
              }}
            >
              sign up free
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent', border: '1px solid var(--color-border)',
                color: 'var(--color-text-muted)', padding: '8px 16px',
                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                fontSize: '13px', fontFamily: 'var(--font-body)',
              }}
            >
              exit demo
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 16px', width: '100%' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          width: '100%', maxWidth: '420px', marginBottom: '16px',
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--color-text)' }}>
            discover
          </span>
          <LiveCounter />
        </div>

        {/* Deck or loading */}
        {isDemo && !demoProfile ? (
          <DemoIntakeForm onSubmit={(profile) => setDemoProfile(profile)} />
        ) : isLoading() || sortedTrials.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--color-text-muted)' }}>
            {isDemo && locationStatus === 'found' ? 'no trials found nearby' : 'loading trials...'}
          </div>
        ) : (
          <>
            <SwipeDeck
              ref={deckRef}
              trials={sortedTrials}
              userCity={userCity}
              userState={null}
              getMatchScore={scoreForCard}
              getQualityReasons={reasonsForCard}
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
                if (sortedTrials[0] && !isDemo) Meteor.call('matches.super', sortedTrials[0].nctId);
                deck.handleSwipeRight();
              }}
            />
          </>
        )}
      </div>

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
