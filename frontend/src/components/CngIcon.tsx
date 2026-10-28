import React from 'react';

interface CngIconProps {
  className?: string;
  size?: number;
  color?: string;
}

export const CngIcon: React.FC<CngIconProps> = ({ className = 'w-5 h-5', size = 20, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* CNG auto-rickshaw profile outline */}
      <path d="M4 16h16" />
      <path d="M5 16l2-8h7l4 4v4" />
      <path d="M8 8V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M11 11h3" />
    </svg>
  );
};
