import React from 'react';

export function MatchScoreRing({ score, size = 80 }) {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const strokeColor =
    score > 80
      ? 'var(--color-accept)'
      : score >= 50
      ? 'var(--color-gold)'
      : 'var(--color-primary-bright)';

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={8}
      />
      {/* Progress arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={strokeColor}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {/* Score label */}
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="var(--color-text)"
        fontSize={size * 0.22}
        fontFamily="var(--font-mono)"
        fontWeight="600"
      >
        {score}
      </text>
    </svg>
  );
}

export default MatchScoreRing;
