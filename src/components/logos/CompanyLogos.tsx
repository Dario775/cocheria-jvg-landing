import React from 'react';

export type LogoVariant = 'full' | 'emblem' | 'horizontal' | 'compact';
export type CompanyBrand = 'jv_gonzalez' | 'guemes' | 'metan';

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  customColor?: string;
  isDark?: boolean;
}

// Common Emblem SVG containing the iconic double circle, gothic arch, and stylized cross
export const EmblemIcon: React.FC<{
  primaryColor?: string;
  accentColor?: string;
  className?: string;
  size?: number;
}> = ({
  primaryColor = '#1B4D75',
  accentColor = '#ffffff',
  className = 'w-12 h-12',
  size
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer thick ring */}
      <circle cx="100" cy="100" r="92" stroke={primaryColor} strokeWidth="12" fill={primaryColor} />
      
      {/* Inner white separator ring */}
      <circle cx="100" cy="100" r="82" stroke={accentColor} strokeWidth="3.5" fill="none" />
      
      {/* Inner dark circle fill */}
      <circle cx="100" cy="100" r="79" fill={primaryColor} />

      {/* Gothic Arch Window Outline */}
      <path
        d="M 64 148 L 64 78 C 64 46, 82 28, 100 24 C 118 28, 136 46, 136 78 L 136 148 Z"
        stroke={accentColor}
        strokeWidth="4"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Inner subtle arch contour */}
      <path
        d="M 69 148 L 69 79 C 69 50, 84 34, 100 30 C 116 34, 131 50, 131 79 L 131 148"
        stroke={accentColor}
        strokeWidth="1.2"
        strokeOpacity="0.6"
        fill="none"
      />

      {/* Stylized Cross */}
      {/* Vertical beam */}
      <path
        d="M 98 42 L 102 42 L 102.5 73 L 100 75 L 97.5 73 Z"
        fill={accentColor}
      />
      <path
        d="M 97.5 75 L 102.5 75 L 100.8 136 L 99.2 136 Z"
        fill={accentColor}
      />
      
      {/* Horizontal flared beam */}
      <path
        d="M 73 66 C 73 66, 86 69, 97 73.5 L 97 75.5 C 86 79, 74 81, 74 81 L 74 72 L 73 66 Z"
        fill={accentColor}
      />
      <path
        d="M 127 66 C 127 66, 114 69, 103 73.5 L 103 75.5 C 114 79, 126 81, 126 81 L 126 72 L 127 66 Z"
        fill={accentColor}
      />

      {/* Cross Center Intersect Details */}
      <polygon
        points="93,74.5 100,69 107,74.5 100,80"
        fill={accentColor}
      />

      {/* Flowing ribbon swoosh at the foot of the cross */}
      <path
        d="M 78 144 C 92 144, 98 137, 107 141 C 116 145, 126 144, 129 142 C 126 144, 115 147, 106 144 C 97 141, 91 146, 78 144 Z"
        fill={accentColor}
      />
    </svg>
  );
};

// Symmetrical Baroque Filigree Scrollwork Ornament
export const FiligreeOrnament: React.FC<{
  color?: string;
  className?: string;
}> = ({ color = '#1B4D75', className = 'w-full h-10' }) => {
  return (
    <svg
      viewBox="0 0 600 130"
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(300, 45)">
        {/* Right Symmetrical Branch */}
        <path
          d="M 0 0 C 15 -18, 42 -26, 70 -20 C 105 -12, 120 18, 145 18 C 170 18, 192 -5, 218 -5 C 248 -5, 270 20, 260 40 C 250 56, 225 50, 222 36 C 220 25, 230 18, 238 22 C 244 26, 240 32, 235 32 C 230 32, 232 24, 226 24 C 210 24, 195 44, 170 44 C 145 44, 130 14, 105 14 C 80 14, 60 38, 35 38 C 18 38, 5 22, 0 10 Z"
        />
        <path
          d="M 28 12 C 45 -4, 75 -8, 95 6 C 115 20, 130 20, 150 10 C 130 25, 105 28, 85 18 C 65 8, 45 15, 28 12 Z"
        />
        <path
          d="M 95 -12 C 120 -28, 155 -28, 175 -8 C 160 -18, 135 -18, 115 -8 Z"
        />
        <path
          d="M 180 8 C 205 0, 230 8, 245 25 C 235 15, 215 12, 195 18 Z"
        />
        <circle cx="265" cy="38" r="4.5" />
        <circle cx="160" cy="48" r="3.5" />
        <circle cx="95" cy="42" r="3" />

        {/* Left Symmetrical Branch (Mirrored) */}
        <g transform="scale(-1, 1)">
          <path
            d="M 0 0 C 15 -18, 42 -26, 70 -20 C 105 -12, 120 18, 145 18 C 170 18, 192 -5, 218 -5 C 248 -5, 270 20, 260 40 C 250 56, 225 50, 222 36 C 220 25, 230 18, 238 22 C 244 26, 240 32, 235 32 C 230 32, 232 24, 226 24 C 210 24, 195 44, 170 44 C 145 44, 130 14, 105 14 C 80 14, 60 38, 35 38 C 18 38, 5 22, 0 10 Z"
          />
          <path
            d="M 28 12 C 45 -4, 75 -8, 95 6 C 115 20, 130 20, 150 10 C 130 25, 105 28, 85 18 C 65 8, 45 15, 28 12 Z"
          />
          <path
            d="M 95 -12 C 120 -28, 155 -28, 175 -8 C 160 -18, 135 -18, 115 -8 Z"
          />
          <path
            d="M 180 8 C 205 0, 230 8, 245 25 C 235 15, 215 12, 195 18 Z"
          />
          <circle cx="265" cy="38" r="4.5" />
          <circle cx="160" cy="48" r="3.5" />
          <circle cx="95" cy="42" r="3" />
        </g>

        {/* Central Floral Knot */}
        <circle cx="0" cy="6" r="5" />
        <path d="M -8 18 C 0 12, 0 12, 8 18 C 5 24, -5 24, -8 18 Z" />
      </g>
    </svg>
  );
};

// 1. LOGO COCHERÍA J.V. GONZÁLEZ (Original Blue #1B4D75)
export const LogoJVGonzalez: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  customColor,
  isDark = false
}) => {
  const brandColor = customColor || (isDark ? '#5dade2' : '#1B4D75');
  const emblemBgColor = isDark ? '#163d5e' : '#1B4D75';

  if (variant === 'emblem') {
    const sizeClasses = {
      xs: 'w-8 h-8',
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-20 h-20',
      xl: 'w-28 h-28'
    };
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className={sizeClasses[size]} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className="w-10 h-10 flex-shrink-0" />
        <div className="flex flex-col text-left">
          <span
            className="text-[10px] tracking-[0.25em] font-serif italic font-medium uppercase"
            style={{ color: brandColor }}
          >
            C O C H E R Í A
          </span>
          <span
            className="text-base sm:text-lg font-serif font-black tracking-wide leading-tight"
            style={{ color: brandColor }}
          >
            J.V. GONZALEZ
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className="w-12 h-12 flex-shrink-0" />
        <div className="flex flex-col text-left justify-center">
          <span
            className="text-[11px] tracking-[0.3em] font-serif italic font-semibold uppercase"
            style={{ color: brandColor }}
          >
            C O C H E R Í A
          </span>
          <span
            className="text-xl sm:text-2xl font-serif font-black tracking-wider leading-none mt-0.5"
            style={{ color: brandColor }}
          >
            J.V. GONZALEZ
          </span>
        </div>
      </div>
    );
  }

  // Full Stacked Logo (Exact replica of Logo Cocheri JV Gonzales.png)
  const containerWidths = {
    xs: 'w-36',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
    xl: 'w-96'
  };

  return (
    <div className={`flex flex-col items-center text-center select-none ${containerWidths[size]} ${className}`}>
      {/* Top Emblem */}
      <EmblemIcon
        primaryColor={emblemBgColor}
        className="w-24 h-24 sm:w-28 sm:h-28 shadow-sm transition-transform hover:scale-105"
      />

      {/* Symmetrical Baroque Filigree */}
      <FiligreeOrnament
        color={brandColor}
        className="w-full h-8 sm:h-10 -mt-1 opacity-95"
      />

      {/* Typography */}
      <div className="flex flex-col items-center w-full mt-1">
        <span
          className="text-xs sm:text-sm tracking-[0.35em] font-serif italic font-medium uppercase transition-colors"
          style={{ color: brandColor }}
        >
          C O C H E R Í A
        </span>
        <span
          className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight uppercase transition-colors"
          style={{ color: brandColor }}
        >
          J.V. GONZALEZ
        </span>
      </div>
    </div>
  );
};

// 2. LOGO SERVICIOS SOCIALES GÜEMES (Original Noble Black #111111)
export const LogoGuemes: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  customColor,
  isDark = false
}) => {
  const brandColor = customColor || (isDark ? '#e7e5e4' : '#1c1917');
  const emblemBgColor = isDark ? '#292524' : '#111111';

  if (variant === 'emblem') {
    const sizeClasses = {
      xs: 'w-8 h-8',
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-20 h-20',
      xl: 'w-28 h-28'
    };
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className={sizeClasses[size]} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className="w-10 h-10 flex-shrink-0" />
        <div className="flex flex-col text-left">
          <span
            className="text-[9px] tracking-[0.2em] font-serif italic font-semibold uppercase"
            style={{ color: brandColor }}
          >
            SERVICIOS SOCIALES
          </span>
          <span
            className="text-base sm:text-lg font-serif font-black tracking-wide leading-tight"
            style={{ color: brandColor }}
          >
            GÜEMES
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className="w-12 h-12 flex-shrink-0" />
        <div className="flex flex-col text-left justify-center">
          <span
            className="text-[10px] tracking-[0.25em] font-serif italic font-semibold uppercase"
            style={{ color: brandColor }}
          >
            SERVICIOS SOCIALES
          </span>
          <span
            className="text-xl sm:text-2xl font-serif font-black tracking-wider leading-none mt-0.5"
            style={{ color: brandColor }}
          >
            GÜEMES
          </span>
        </div>
      </div>
    );
  }

  const containerWidths = {
    xs: 'w-36',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
    xl: 'w-96'
  };

  return (
    <div className={`flex flex-col items-center text-center select-none ${containerWidths[size]} ${className}`}>
      <EmblemIcon
        primaryColor={emblemBgColor}
        className="w-24 h-24 sm:w-28 sm:h-28 shadow-sm transition-transform hover:scale-105"
      />

      <FiligreeOrnament
        color={brandColor}
        className="w-full h-8 sm:h-10 -mt-1 opacity-95"
      />

      <div className="flex flex-col items-center w-full mt-1">
        <span
          className="text-[11px] sm:text-xs tracking-[0.25em] font-serif italic font-semibold uppercase transition-colors"
          style={{ color: brandColor }}
        >
          SERVICIOS SOCIALES
        </span>
        <span
          className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight uppercase transition-colors"
          style={{ color: brandColor }}
        >
          GÜEMES
        </span>
      </div>
    </div>
  );
};

// 3. LOGO COCHERÍA METÁN (Original Terracotta / Wine Burgundy #8C382F)
export const LogoMetan: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  customColor,
  isDark = false
}) => {
  const brandColor = customColor || (isDark ? '#e07a6f' : '#8C382F');
  const emblemBgColor = isDark ? '#6b251e' : '#8C382F';

  if (variant === 'emblem') {
    const sizeClasses = {
      xs: 'w-8 h-8',
      sm: 'w-10 h-10',
      md: 'w-14 h-14',
      lg: 'w-20 h-20',
      xl: 'w-28 h-28'
    };
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className={sizeClasses[size]} />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2.5 ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className="w-10 h-10 flex-shrink-0" />
        <div className="flex flex-col text-left">
          <span
            className="text-[10px] tracking-[0.25em] font-serif italic font-medium uppercase"
            style={{ color: brandColor }}
          >
            COCHERIA
          </span>
          <span
            className="text-base sm:text-lg font-serif font-black tracking-wide leading-tight"
            style={{ color: brandColor }}
          >
            METAN
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <EmblemIcon primaryColor={emblemBgColor} className="w-12 h-12 flex-shrink-0" />
        <div className="flex flex-col text-left justify-center">
          <span
            className="text-[11px] tracking-[0.3em] font-serif italic font-semibold uppercase"
            style={{ color: brandColor }}
          >
            COCHERIA
          </span>
          <span
            className="text-xl sm:text-2xl font-serif font-black tracking-wider leading-none mt-0.5"
            style={{ color: brandColor }}
          >
            METAN
          </span>
        </div>
      </div>
    );
  }

  const containerWidths = {
    xs: 'w-36',
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
    xl: 'w-96'
  };

  return (
    <div className={`flex flex-col items-center text-center select-none ${containerWidths[size]} ${className}`}>
      <EmblemIcon
        primaryColor={emblemBgColor}
        className="w-24 h-24 sm:w-28 sm:h-28 shadow-sm transition-transform hover:scale-105"
      />

      <FiligreeOrnament
        color={brandColor}
        className="w-full h-8 sm:h-10 -mt-1 opacity-95"
      />

      <div className="flex flex-col items-center w-full mt-1">
        <span
          className="text-xs sm:text-sm tracking-[0.35em] font-serif italic font-medium uppercase transition-colors"
          style={{ color: brandColor }}
        >
          COCHERIA
        </span>
        <span
          className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black tracking-tight leading-tight uppercase transition-colors"
          style={{ color: brandColor }}
        >
          METAN
        </span>
      </div>
    </div>
  );
};

// Unified dynamic selector component
export const UnifiedCompanyLogo: React.FC<{
  brand: CompanyBrand;
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isDark?: boolean;
}> = ({ brand, variant = 'full', size = 'md', className, isDark }) => {
  switch (brand) {
    case 'guemes':
      return <LogoGuemes variant={variant} size={size} className={className} isDark={isDark} />;
    case 'metan':
      return <LogoMetan variant={variant} size={size} className={className} isDark={isDark} />;
    case 'jv_gonzalez':
    default:
      return <LogoJVGonzalez variant={variant} size={size} className={className} isDark={isDark} />;
  }
};
