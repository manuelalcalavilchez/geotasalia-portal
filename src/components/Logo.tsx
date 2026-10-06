import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  customLogoUrl?: string;
}

export default function Logo({ className = '', size = 'md', showText = true, customLogoUrl }: LogoProps) {
  const dimensions = {
    sm: { svgSize: 40, textSize: 'text-lg', subSize: 'text-[8px]' },
    md: { svgSize: 64, textSize: 'text-2xl', subSize: 'text-xs' },
    lg: { svgSize: 120, textSize: 'text-4xl', subSize: 'text-sm' },
    xl: { svgSize: 200, textSize: 'text-5xl', subSize: 'text-base' },
  }[size];

  // Use custom URL if provided, otherwise fall back to the bundled logo
  const logoSrc = customLogoUrl || '/logo.png';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <img
        src={logoSrc}
        alt="Geotasalia Logo"
        referrerPolicy="no-referrer"
        className="object-contain transition-transform duration-300 hover:scale-105"
        style={{
          width: dimensions.svgSize,
          height: dimensions.svgSize,
          filter: 'drop-shadow(0px 2px 12px rgba(212,175,55,0.3))'
        }}
      />

      {showText && (
        <div className="mt-4 flex flex-col items-center">
          <h1 className={`font-sans tracking-[0.25em] font-light text-white uppercase leading-none ${dimensions.textSize}`}>
            GEOTASALIA
          </h1>
          <p className={`mt-2 font-mono tracking-[0.4em] text-theme-accent uppercase opacity-90 transition-colors duration-300 ${dimensions.subSize}`}>
            CULTIVATING VALUE
          </p>
        </div>
      )}
    </div>
  );
}
