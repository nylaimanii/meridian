import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export function Login() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [emailValue, setEmailValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const [googleHovered, setGoogleHovered] = useState(false);
  const [error, setError] = useState('');

  const inputStyle = (focused) => ({
    width: '100%',
    boxSizing: 'border-box',
    background: 'var(--color-bg-3)',
    border: `1px solid ${focused ? 'var(--color-primary-bright)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    color: 'var(--color-text)',
    fontSize: '16px',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  });

  const tabStyle = (active) => ({
    borderBottom: active
      ? '2px solid var(--color-primary-bright)'
      : '2px solid transparent',
    color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
    background: 'none',
    padding: '10px 24px',
    fontSize: '14px',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    border: 'none',
    borderBottom: active
      ? '2px solid var(--color-primary-bright)'
      : '2px solid transparent',
  });

  function handleSubmit() {
    setError('');
    if (isSignUp) {
      try {
        Accounts.createUser({ email: emailValue, password: passwordValue }, (err) => {
          if (err) {
            setError(err.message);
          } else {
            navigate('/discover');
          }
        });
      } catch (err) {
        setError(err.message);
      }
    } else {
      Meteor.loginWithPassword(emailValue, passwordValue, (err) => {
        if (err) {
          setError(err.message);
        } else {
          navigate('/discover');
        }
      });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: 'var(--color-bg-2)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--color-primary-bright)',
          textAlign: 'center',
          marginBottom: '8px',
        }}
      >
        meridian
      </div>

      {/* Subtitle */}
      <div
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        find your next chapter
      </div>

      {/* Mode toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '28px',
        }}
      >
        <button
          onClick={() => { setIsSignUp(true); setError(''); }}
          style={tabStyle(isSignUp)}
        >
          sign up
        </button>
        <button
          onClick={() => { setIsSignUp(false); setError(''); }}
          style={tabStyle(!isSignUp)}
        >
          log in
        </button>
      </div>

      {/* Inputs */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <input
          type="email"
          placeholder="email address"
          value={emailValue}
          onChange={(e) => setEmailValue(e.target.value)}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={inputStyle(emailFocused)}
        />
        <input
          type="password"
          placeholder="password"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          style={inputStyle(passwordFocused)}
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: '100%',
          background: btnHovered ? 'var(--color-primary-glow)' : 'var(--color-primary)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          fontFamily: 'var(--font-body)',
          marginBottom: '16px',
          transition: 'background 0.15s ease',
        }}
      >
        {isSignUp ? 'create account' : 'log in'}
      </button>

      {/* Error message */}
      {error && (
        <div
          style={{
            color: 'var(--color-decline)',
            fontSize: '13px',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {error}
        </div>
      )}

      {/* Divider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <hr style={{ flex: 1, borderColor: 'var(--color-border)', borderTop: 'none' }} />
        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>or</span>
        <hr style={{ flex: 1, borderColor: 'var(--color-border)', borderTop: 'none' }} />
      </div>

      {/* Google button */}
      <button
        onClick={() => setError('Google login coming soon')}
        onMouseEnter={() => setGoogleHovered(true)}
        onMouseLeave={() => setGoogleHovered(false)}
        style={{
          width: '100%',
          background: 'transparent',
          border: `1px solid ${googleHovered ? 'var(--color-primary-bright)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'border-color 0.15s ease',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: '15px' }}>G</span>
        Continue with Google
      </button>
    </motion.div>
  );
}
