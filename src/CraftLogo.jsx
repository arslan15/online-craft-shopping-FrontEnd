import React from 'react';

function CraftLogo({ size = 36, color = '#d97706' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {/* Pot Rim / Leaves */}
      <path 
        d="M200 130C200 105 220 85 256 85C292 85 312 105 312 130H200Z" 
        fill={color} 
        opacity="0.85" 
      />
      <path 
        d="M160 155H352C365 155 375 165 375 178V190C375 203 365 213 352 213H160C147 213 137 203 137 190V178C137 165 147 155 160 155Z" 
        fill={color} 
      />
      {/* Pot Body */}
      <path 
        d="M175 230H337C365 230 385 270 375 315C355 395 310 445 256 445C202 445 157 395 137 315C127 270 147 230 175 230Z" 
        stroke={color} 
        strokeWidth="24" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      {/* Paintbrush Diagonally Across */}
      <path 
        d="M190 340L330 200C340 190 355 190 365 200C375 210 375 225 365 235L225 375L190 380L190 340Z" 
        fill={color} 
      />
    </svg>
  );
}

export default CraftLogo;