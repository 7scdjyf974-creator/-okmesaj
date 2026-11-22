import React from 'react';
import { SceneId } from '../types/messaging';

interface SceneArtworkProps {
  sceneId: SceneId;
  className?: string;
}

export const SCENE_META: Record<SceneId, { title: string; subtitle: string }> = {
  bosphorus: {
    title: 'Boğaz’da Gün Batımı',
    subtitle: 'Karaköy İskelesi, İstanbul',
  },
  'turkish-coffee': {
    title: 'Sabah Kahvesi & Çalışma',
    subtitle: 'Moda, Kadıköy',
  },
  cappadocia: {
    title: 'Kapadokya Şafağı',
    subtitle: 'Göreme Vadisi, Nevşehir',
  },
  kadikoy: {
    title: 'Nostaljik Tramvay',
    subtitle: 'Bahariye Caddesi',
  },
  forest: {
    title: 'Sabah Yürüyüşü',
    subtitle: 'Belgrad Ormanı',
  },
};

export const SceneArtwork: React.FC<SceneArtworkProps> = ({ sceneId, className = 'w-full h-48' }) => {
  switch (sceneId) {
    case 'bosphorus':
      return (
        <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" aria-label="Boğaz gün batımı illüstrasyonu">
          <defs>
            <linearGradient id="bosphorus-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="50%" stopColor="#d97757" />
              <stop offset="100%" stopColor="#f5c26b" />
            </linearGradient>
            <linearGradient id="bosphorus-sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#264b6e" />
              <stop offset="100%" stopColor="#0f2338" />
            </linearGradient>
          </defs>
          <rect width="400" height="170" fill="url(#bosphorus-sky)" />
          <circle cx="290" cy="118" r="32" fill="#ffe29a" opacity="0.9" />
          {/* Distant hill silhouette */}
          <path d="M0 155 Q70 130 140 148 T280 145 T400 138 L400 170 L0 170 Z" fill="#233142" opacity="0.85" />
          {/* Minarets & dome silhouette */}
          <path d="M72 146 v-28 l2-6 2 6 v28 M92 146 c0-12 18-12 18 0 M118 146 v-24 l2-5 2 5 v24" fill="#1b2634" />
          {/* Bosphorus bridge silhouette */}
          <path d="M160 150 L160 98 M315 150 L315 98 M130 142 L365 142" stroke="#182230" strokeWidth="2.5" />
          <path d="M160 100 Q237 140 315 100" fill="none" stroke="#182230" strokeWidth="1.5" />
          {/* Sea */}
          <rect y="165" width="400" height="95" fill="url(#bosphorus-sea)" />
          {/* Sun reflection */}
          <ellipse cx="290" cy="185" rx="22" ry="4" fill="#ffd984" opacity="0.55" />
          <ellipse cx="288" cy="202" rx="30" ry="3.5" fill="#ffd984" opacity="0.4" />
          <ellipse cx="292" cy="222" rx="18" ry="3" fill="#ffd984" opacity="0.3" />
          {/* Ferry */}
          <path d="M105 186 h74 l-6 14 h-62 z" fill="#ffffff" />
          <rect x="122" y="176" width="38" height="10" rx="2" fill="#f1f5f9" />
          <rect x="136" y="167" width="8" height="9" fill="#008069" />
          <path d="M105 200 h74" stroke="#008069" strokeWidth="3" />
        </svg>
      );

    case 'turkish-coffee':
      return (
        <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" aria-label="Türk kahvesi masası illüstrasyonu">
          <defs>
            <linearGradient id="table-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#efe4d4" />
              <stop offset="100%" stopColor="#d8c3a8" />
            </linearGradient>
          </defs>
          <rect width="400" height="260" fill="url(#table-grad)" />
          {/* Sunlight stripe */}
          <polygon points="0,0 240,0 130,260 0,260" fill="#fff8ec" opacity="0.45" />
          {/* Notebook */}
          <rect x="40" y="55" width="150" height="180" rx="8" fill="#ffffff" />
          <line x1="60" y1="90" x2="170" y2="90" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="60" y1="112" x2="155" y2="112" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="60" y1="134" x2="165" y2="134" stroke="#cbd5e1" strokeWidth="2" />
          <line x1="60" y1="156" x2="135" y2="156" stroke="#008069" strokeWidth="2.5" />
          {/* Saucer & Coffee cup */}
          <circle cx="285" cy="148" r="56" fill="#f8fafc" />
          <circle cx="285" cy="148" r="48" fill="#e2e8f0" opacity="0.5" />
          <circle cx="285" cy="148" r="34" fill="#ffffff" />
          <path d="M318 142 c14 0 14 14 0 14" fill="none" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          <circle cx="285" cy="148" r="27" fill="#4b2e1b" />
          <circle cx="280" cy="143" r="10" fill="#7c4d2f" opacity="0.65" />
          {/* Turkish delight (Lokum) */}
          <rect x="240" y="210" width="22" height="22" rx="4" fill="#d97757" />
          <rect x="268" y="206" width="22" height="22" rx="4" fill="#25D366" opacity="0.8" />
        </svg>
      );

    case 'cappadocia':
      return (
        <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" aria-label="Kapadokya balonları illüstrasyonu">
          <defs>
            <linearGradient id="cappa-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#354f6b" />
              <stop offset="65%" stopColor="#e5987e" />
              <stop offset="100%" stopColor="#fce1b6" />
            </linearGradient>
          </defs>
          <rect width="400" height="260" fill="url(#cappa-sky)" />
          {/* Valleys & fairy chimneys */}
          <path d="M0 215 Q85 165 170 205 T330 190 L400 175 L400 260 L0 260 Z" fill="#8b5d47" />
          <path d="M0 230 Q120 195 250 225 T400 210 L400 260 L0 260 Z" fill="#633f30" />
          {/* Hot air balloons */}
          <g transform="translate(110, 75)">
            <ellipse cx="0" cy="0" rx="22" ry="26" fill="#e63946" />
            <path d="M-8 -24 Q0 0 -6 25 M8 -24 Q0 0 6 25" fill="none" stroke="#ffd166" strokeWidth="4" />
            <rect x="-5" y="29" width="10" height="8" rx="1.5" fill="#4a3022" />
          </g>
          <g transform="translate(245, 58)">
            <ellipse cx="0" cy="0" rx="16" ry="19" fill="#008069" />
            <path d="M-6 -18 Q0 0 -4 18 M6 -18 Q0 0 4 18" fill="none" stroke="#92f5d9" strokeWidth="3" />
            <rect x="-4" y="22" width="8" height="6" rx="1" fill="#4a3022" />
          </g>
          <g transform="translate(315, 110)">
            <ellipse cx="0" cy="0" rx="12" ry="14" fill="#f4a261" />
            <rect x="-3" y="16" width="6" height="5" rx="1" fill="#4a3022" />
          </g>
        </svg>
      );

    case 'kadikoy':
      return (
        <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" aria-label="Kadıköy tramvay illüstrasyonu">
          <rect width="400" height="260" fill="#cfe8f3" />
          <rect y="185" width="400" height="75" fill="#707880" />
          {/* Buildings */}
          <rect x="20" y="30" width="90" height="155" fill="#f2dec4" />
          <rect x="115" y="50" width="85" height="135" fill="#e5b899" />
          <rect x="205" y="20" width="95" height="165" fill="#d9e4dd" />
          <rect x="305" y="45" width="80" height="140" fill="#f6e7d8" />
          {/* Tram */}
          <rect x="120" y="110" width="160" height="82" rx="14" fill="#b91c1c" />
          <rect x="132" y="124" width="136" height="34" rx="6" fill="#e2f1f8" />
          <rect x="120" y="164" width="160" height="12" fill="#fde68a" />
          <circle cx="152" cy="184" r="6" fill="#fff7ed" />
          <circle cx="248" cy="184" r="6" fill="#fff7ed" />
          {/* Tracks */}
          <line x1="115" y1="260" x2="155" y2="192" stroke="#475569" strokeWidth="3" />
          <line x1="285" y1="260" x2="245" y2="192" stroke="#475569" strokeWidth="3" />
        </svg>
      );

    case 'forest':
      return (
        <svg viewBox="0 0 400 260" className={className} preserveAspectRatio="xMidYMid slice" aria-label="Belgrad ormanı sabah yürüyüşü illüstrasyonu">
          <defs>
            <linearGradient id="forest-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d8f3dc" />
              <stop offset="100%" stopColor="#95d5b2" />
            </linearGradient>
          </defs>
          <rect width="400" height="260" fill="url(#forest-sky)" />
          <circle cx="200" cy="80" r="38" fill="#fffbeb" opacity="0.7" />
          {/* Trees */}
          <path d="M50 220 L85 95 L120 220 Z" fill="#2d6a4f" />
          <path d="M125 220 L165 75 L205 220 Z" fill="#1b4332" />
          <path d="M235 220 L275 88 L315 220 Z" fill="#2d6a4f" />
          <path d="M300 220 L340 105 L380 220 Z" fill="#40916c" />
          {/* Path */}
          <path d="M0 215 Q200 190 400 220 L400 260 L0 260 Z" fill="#52b788" />
          <path d="M165 260 Q195 220 210 205 Q220 220 245 260 Z" fill="#d4a373" />
        </svg>
      );
  }
};
