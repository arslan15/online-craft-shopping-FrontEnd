import React from 'react';

function CraftLogo({ size = 40, color = 'currentColor' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Clay Pot & Leaves Icon Paths */}
      <path 
        d="M256 120C230 120 210 100 210 80C210 65 225 50 256 35C287 50 302 65 302 80C302 100 282 120 256 120Z" 
        fill={color} 
        opacity="0.85" 
      />
      <path 
        d="M180 160H332C345 160 355 170 355 182V195C355 208 345 218 332 218H180C167 218 157 208 157 195V182C157 170 167 160 180 160Z" 
        fill={color} 
      />
      <path 
        d="M185 235H327C355 235 375 270 365 310C345 390 300 440 256 440C212 440 167 390 147 310C137 270 157 235 185 235Z" 
        stroke={color} 
        strokeWidth="24" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Paintbrush Accent */}
      <path 
        d="M220 310L320 210C330 200 345 200 355 210C365 220 365 235 355 245L255 345L220 350L220 310Z" 
        fill={color} 
      />
    </svg>
  );
}

export default CraftLogo;