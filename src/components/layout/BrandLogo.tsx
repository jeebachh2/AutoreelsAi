import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  showBadge = true,
  badgeText = 'PRO',
  className = '',
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: {
      img: 'h-7 w-7 rounded-lg',
      container: 'h-7 w-7',
      text: 'text-xs sm:text-sm font-bold',
      sub: 'text-[9px]',
      badge: 'text-[8px] px-1 py-0.2',
    },
    md: {
      img: 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-xl',
      container: 'h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10',
      text: 'text-sm sm:text-base md:text-lg font-bold',
      sub: 'text-[10px] sm:text-[11px]',
      badge: 'text-[8px] sm:text-[9px] px-1.5 py-0.2 sm:px-2 sm:py-0.5',
    },
    lg: {
      img: 'h-12 w-12 rounded-xl',
      container: 'h-12 w-12',
      text: 'text-xl font-bold',
      sub: 'text-xs',
      badge: 'text-xs px-2 py-0.5',
    },
    xl: {
      img: 'h-16 w-16 rounded-2xl',
      container: 'h-16 w-16',
      text: 'text-2xl font-extrabold',
      sub: 'text-sm',
      badge: 'text-xs px-2.5 py-1',
    },
    hero: {
      img: 'h-24 w-24 sm:h-32 sm:w-32 rounded-3xl',
      container: 'h-24 w-24 sm:h-32 sm:w-32',
      text: 'text-3xl sm:text-4xl font-black',
      sub: 'text-sm sm:text-base',
      badge: 'text-xs sm:text-sm px-3 py-1',
    },
  };

  const current = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 ${onClick ? 'cursor-pointer transition-opacity hover:opacity-90' : ''} ${className}`}
    >
      {/* 3D Brand Emblem with subtle glow */}
      <div className={`relative flex ${current.container} shrink-0 items-center justify-center rounded-xl bg-slate-950 p-0.5 ring-1 ring-indigo-500/30 shadow-lg shadow-cyan-500/10`}>
        {!imageError ? (
          <img
            src="/autoreel_logo.jpg"
            alt="AutoReel.AI Logo"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className={`h-full w-full object-cover shadow-inner ${current.img}`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-1">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
        )}

        {/* Status dot */}
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-cyan-500 ring-1 ring-slate-950"></span>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className={`font-heading ${current.text} tracking-tight text-white leading-none`}>
              AutoReel<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-pink-400">.AI</span>
            </span>
            {showBadge && (
              <span className={`rounded-full border border-cyan-500/30 bg-cyan-500/10 ${current.badge} font-semibold text-cyan-300`}>
                {badgeText}
              </span>
            )}
          </div>
          <p className={`hidden text-slate-400 md:block ${current.sub} mt-0.5`}>
            Autonomous 9:16 Video & Multi-Platform Dispatch
          </p>
        </div>
      )}
    </div>
  );
};
