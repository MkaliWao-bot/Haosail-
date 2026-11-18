import React from 'react';

interface HaoSailLogoProps {
  className?: string;
  variant?: 'full' | 'mark-only';
  inverted?: boolean;
}

export const HaoSailLogo: React.FC<HaoSailLogoProps> = ({
  className = 'h-9',
  inverted = false,
}) => {
  return (
    <div
      className={`inline-flex items-center select-none shrink-0 ${
        inverted ? 'rounded bg-white/95 px-2 py-0.5' : ''
      } ${className}`}
    >
      <img
        src="/assets/aistudio/image_35e6add1.png"
        alt="HaoSaiL Industrial Machinery"
        referrerPolicy="no-referrer"
        className="h-full w-auto object-contain block"
      />
    </div>
  );
};
