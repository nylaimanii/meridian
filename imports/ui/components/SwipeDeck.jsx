import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { TrialCard } from './TrialCard';

const DEFAULT_QUALITY_REASONS = ['Condition match', 'Location nearby', 'Age eligible'];

function defaultMatchScore(trial, index) {
  return (75 + (index * 7)) % 40 + 60;
}

export const SwipeDeck = forwardRef(function SwipeDeck(
  {
    trials,
    onSwipeRight,
    onSwipeLeft,
    onSuperMatch,
    userCity,
    userState,
    getMatchScore,
    getQualityReasons,
  },
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dragX = useMotionValue(0);

  const swipe = useCallback(
    (direction) => {
      if (currentIndex >= trials.length) return;
      const target = direction === 'right' ? 600 : -600;
      animate(dragX, target, { duration: 0.4 }).then(() => {
        if (direction === 'right') {
          onSwipeRight && onSwipeRight(trials[currentIndex]);
        } else {
          onSwipeLeft && onSwipeLeft(trials[currentIndex]);
        }
        setCurrentIndex((prev) => prev + 1);
        dragX.set(0);
      });
    },
    [currentIndex, trials, dragX, onSwipeRight, onSwipeLeft]
  );

  const handleSwipeRight = useCallback(() => swipe('right'), [swipe]);
  const handleSwipeLeft = useCallback(() => swipe('left'), [swipe]);

  useImperativeHandle(ref, () => ({
    handleSwipeRight,
    handleSwipeLeft,
  }));

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'ArrowRight') handleSwipeRight();
      if (e.key === 'ArrowLeft') handleSwipeLeft();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleSwipeRight, handleSwipeLeft]);

  if (currentIndex >= trials.length) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '400px',
          gap: '16px',
        }}
      >
        <span style={{ fontSize: '48px' }}>🎉</span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--color-text)',
          }}
        >
          you've seen all trials
        </h2>
        <p style={{ color: 'var(--color-text-muted)' }}>
          check back soon for new matches
        </p>
        <button
          onClick={() => setCurrentIndex(0)}
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            fontFamily: 'var(--font-body)',
          }}
        >
          start over
        </button>
      </div>
    );
  }

  const visibleCards = trials.slice(currentIndex, currentIndex + 3);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '500px',
      }}
    >
      {visibleCards
        .slice()
        .reverse()
        .map((trial, reversedOffset) => {
          const offset = visibleCards.length - 1 - reversedOffset;
          const trialIndex = currentIndex + offset;
          const isTop = offset === 0;

          const matchScore = getMatchScore
            ? getMatchScore(trial, trialIndex, userCity, userState)
            : defaultMatchScore(trial, trialIndex);

          const qualityReasons = getQualityReasons
            ? getQualityReasons(trial, userCity)
            : DEFAULT_QUALITY_REASONS;

          if (isTop) {
            return (
              <motion.div
                key={trial._id || trialIndex}
                style={{
                  x: dragX,
                  position: 'absolute',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  zIndex: 3,
                }}
                drag="x"
                dragConstraints={{ left: -1000, right: 1000 }}
                dragElastic={0.15}
                onDragEnd={(e, info) => {
                  if (info.offset.x > 120) {
                    handleSwipeRight();
                  } else if (info.offset.x < -120) {
                    handleSwipeLeft();
                  } else {
                    animate(dragX, 0, {
                      type: 'spring',
                      stiffness: 300,
                      damping: 30,
                    });
                  }
                }}
              >
                <TrialCard
                  trial={trial}
                  matchScore={matchScore}
                  qualityReasons={qualityReasons}
                  dragX={dragX}
                  isTop={true}
                />
              </motion.div>
            );
          }

          const scale = offset === 1 ? 0.97 : 0.94;
          const translateY = offset === 1 ? '12px' : '24px';

          return (
            <motion.div
              key={trial._id || trialIndex}
              animate={{ scale, y: translateY }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: offset === 1 ? 2 : 1,
                pointerEvents: 'none',
              }}
            >
              {/* No dragX prop for non-top cards — TrialCard uses its internal fallback */}
              <TrialCard
                trial={trial}
                matchScore={matchScore}
                qualityReasons={qualityReasons}
                isTop={false}
              />
            </motion.div>
          );
        })}
    </div>
  );
});
