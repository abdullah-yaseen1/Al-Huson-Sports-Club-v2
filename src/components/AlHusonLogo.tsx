import React from "react";

interface AlHusonLogoProps {
  className?: string;
  size?: number;
}

export default function AlHusonLogo({ className = "", size = 48 }: AlHusonLogoProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_2px_8px_rgba(226,184,87,0.3)]`}
    >
      {/* Outer Golden Shield Frame */}
      <path 
        d="M50 8C50 8 82 14 82 45C82 70 50 92 50 92C50 92 18 70 18 45C18 14 50 8 50 8Z" 
        fill="#070a13" 
        stroke="#e2b857" 
        strokeWidth="3.5" 
        strokeLinejoin="round"
      />
      
      {/* Inner Golden Border */}
      <path 
        d="M50 14C50 14 76 19 76 45C76 66 50 85 50 85C50 85 24 66 24 45C24 19 50 14 50 14Z" 
        fill="none" 
        stroke="#e2b857" 
        strokeWidth="1" 
        strokeOpacity="0.6"
        strokeLinejoin="round"
      />

      {/* Castle Gate / Fort Structure */}
      <g transform="translate(28, 26)">
        {/* Main Base Wall */}
        <path 
          d="M6 32H38V44H6V32Z" 
          fill="#e2b857" 
          opacity="0.9"
        />
        {/* Left Tower */}
        <path 
          d="M2 14H12V44H2V14Z" 
          fill="#e2b857" 
        />
        {/* Right Tower */}
        <path 
          d="M32 14H42V44H32V14Z" 
          fill="#e2b857" 
        />
        {/* Left Battlements */}
        <path d="M2 10H5V14H2V10ZM9 10H12V14H9V10Z" fill="#e2b857" />
        {/* Right Battlements */}
        <path d="M32 10H35V14H32V10ZM39 10H42V14H39V10Z" fill="#e2b857" />
        {/* Center Tower / Gate Roof Battlements */}
        <path d="M16 24H20V28H16V24ZM24 24H28V28H24V24Z" fill="#e2b857" />
        <path d="M16 28H28V32H16V28Z" fill="#e2b857" />

        {/* Archway Gate Door (Cutout effect) */}
        <path 
          d="M17 44C17 38 27 38 27 44" 
          fill="#070a13" 
          stroke="#e2b857" 
          strokeWidth="1.5"
        />
      </g>

      {/* Decorative Stars */}
      {/* Center Star */}
      <polygon points="50,19 52,23 57,23 53,26 55,30 50,28 45,30 47,26 43,23 48,23" fill="#e2b857" />
      {/* Left Star */}
      <polygon points="36,23 37.5,26 41,26 38,28 39.5,31 36,29.5 32.5,31 34,28 31,26 34.5,26" fill="#e2b857" opacity="0.8" />
      {/* Right Star */}
      <polygon points="64,23 65.5,26 69,26 66,28 67.5,31 64,29.5 60.5,31 62,28 59,26 62.5,26" fill="#e2b857" opacity="0.8" />

      {/* Small Bottom Star under shield */}
      <polygon points="50,75 51.5,78 55,78 52,80 53.5,83 50,81.5 46.5,83 48,80 45,78 48.5,78" fill="#e2b857" />
    </svg>
  );
}
