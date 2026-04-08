import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  {
    key: 'conditions',
    label: 'what conditions are you managing?',
    subtitle: 'enter one or more, separated by commas',
    type: 'text',
    placeholder: 'e.g. Type 2 Diabetes, Hypertension',
  },
  {
    key: 'age',
    label: 'how old are you?',
    subtitle: 'used to match age-eligible trials',
    type: 'number',
    placeholder: 'e.g. 42',
  },
  {
    key: 'location',
    label: 'what city or state are you in?',
    subtitle: 'used to find nearby trials',
    type: 'text',
    placeholder: 'e.g. Philadelphia, PA',
  },
  {
    key: 'travelRadius',
    label: 'how far are you willing to travel?',
    subtitle: 'radius in miles',
    type: 'number',
    placeholder: 'e.g. 100',
  },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ conditions: '', age: '', location: '', travelRadius: '' });

  const currentStep = STEPS[step];
  const value = answers[currentStep.key];
  const isFilled = value.trim() !== '';
  const isLast = step === STEPS.length - 1;

  function handleNext() {
    if (!isFilled) return;
    if (isLast) {
      Meteor.call('users.updateProfile', answers, () => navigate('/discover'));
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleNext();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: i <= step ? 'var(--color-primary-bright)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(22px, 4vw, 30px)',
                  color: 'var(--color-text)',
                  lineHeight: 1.25,
                  marginBottom: '8px',
                }}
              >
                {currentStep.label}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                {currentStep.subtitle}
              </div>
            </div>

            <input
              autoFocus
              type={currentStep.type}
              placeholder={currentStep.placeholder}
              value={value}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [currentStep.key]: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                background: 'var(--color-bg-2)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                color: 'var(--color-text)',
                fontSize: '18px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
              }}
            />

            {/* Nav row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                    padding: '14px 20px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '15px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!isFilled}
                style={{
                  flex: 1,
                  background: isFilled ? 'var(--color-primary)' : 'var(--color-bg-3)',
                  color: isFilled ? 'white' : 'var(--color-text-muted)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: isFilled ? 'pointer' : 'default',
                  fontFamily: 'var(--font-body)',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {isLast ? 'finish →' : 'next →'}
              </button>
            </div>

            {/* Skip button */}
            <button
              onClick={() => navigate('/discover')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                textAlign: 'center',
              }}
            >
              skip
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
