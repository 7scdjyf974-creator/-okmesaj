import React from 'react';
import { Users } from 'lucide-react';
import { Contact, StatusSegment } from '../types/messaging';

interface AvatarProps {
  contact: Pick<Contact, 'name' | 'avatarBg' | 'avatarAccent' | 'avatarVariant' | 'isGroup' | 'isOnline'>;
  size?: number; // px, default 50
  statusSegments?: StatusSegment[];
  showOnlinePip?: boolean;
  className?: string;
}

const PortraitSvg: React.FC<{ variant: Contact['avatarVariant']; accent: string }> = ({
  variant,
  accent,
}) => {
  switch (variant) {
    case 'woman-1':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M18 58c0-10 6-16 14-16s14 6 14 16" fill={accent} />
          <path d="M21 28c0-9 5-15 11-15s11 6 11 15v8c0 3-2 6-5 7h-12c-3-1-5-4-5-7v-8z" fill="#3a261e" />
          <circle cx="32" cy="28" r="9.5" fill="#f3c6a5" />
          <path d="M22.5 26c3-7 15-8 19 0-2-6-6-9-9.5-9s-7.5 3-9.5 9z" fill="#3a261e" />
          <circle cx="28.5" cy="28" r="1.2" fill="#231915" />
          <circle cx="35.5" cy="28" r="1.2" fill="#231915" />
          <path d="M29.5 32.5q2.5 2 5 0" fill="none" stroke="#9e5a47" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'man-1':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M17 58c0-10 7-16 15-16s15 6 15 16" fill={accent} />
          <circle cx="32" cy="28" r="9.5" fill="#eab693" />
          <path d="M22 25c0-6 4-10 10-10s10 4 10 10c-2-3-5-4-10-4s-8 1-10 4z" fill="#24292f" />
          <path d="M25 32c1 4 4 6 7 6s6-2 7-6" fill="none" stroke="#3c2f2a" strokeWidth="1.8" strokeLinecap="round" opacity="0.55" />
          <circle cx="28.5" cy="27.5" r="1.2" fill="#1e242b" />
          <circle cx="35.5" cy="27.5" r="1.2" fill="#1e242b" />
          <path d="M29.5 32.5q2.5 1.8 5 0" fill="none" stroke="#8a4b38" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'woman-2':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M18 58c0-10 6-16 14-16s14 6 14 16" fill={accent} />
          <circle cx="32" cy="27" r="12" fill="#6b3410" />
          <circle cx="32" cy="28" r="9.5" fill="#f7d2b8" />
          <path d="M23 25c4-5 14-5 18 0-1-6-5-9-9-9s-8 3-9 9z" fill="#6b3410" />
          <circle cx="28.5" cy="28" r="1.2" fill="#2b1d14" />
          <circle cx="35.5" cy="28" r="1.2" fill="#2b1d14" />
          <path d="M29.5 32.5q2.5 2 5 0" fill="none" stroke="#b06553" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'man-2':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M17 58c0-10 7-16 15-16s15 6 15 16" fill={accent} />
          <circle cx="32" cy="28" r="9.5" fill="#dfb08c" />
          <path d="M22.5 24c1-6 5-9 9.5-9s8.5 3 9.5 9l-2 1c-2-3-5-4-7.5-4s-5.5 1-7.5 4z" fill="#463529" />
          <rect x="25.5" y="25.5" width="5.5" height="4" rx="1.2" fill="none" stroke="#1f2937" strokeWidth="1.3" />
          <rect x="33" y="25.5" width="5.5" height="4" rx="1.2" fill="none" stroke="#1f2937" strokeWidth="1.3" />
          <line x1="31" y1="27.5" x2="33" y2="27.5" stroke="#1f2937" strokeWidth="1.2" />
          <path d="M29.5 33q2.5 1.5 5 0" fill="none" stroke="#8d5440" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'woman-3':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M18 58c0-10 6-16 14-16s14 6 14 16" fill={accent} />
          <path d="M20 30c0-11 5-17 12-17s12 6 12 17v11h-24z" fill="#1e293b" />
          <circle cx="32" cy="28" r="9" fill="#f1c29f" />
          <circle cx="28.8" cy="28" r="1.2" fill="#1e293b" />
          <circle cx="35.2" cy="28" r="1.2" fill="#1e293b" />
          <path d="M29.5 32.5q2.5 2 5 0" fill="none" stroke="#9e5a47" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'man-3':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M17 58c0-10 7-16 15-16s15 6 15 16" fill={accent} />
          <circle cx="32" cy="28" r="9.5" fill="#f0c4a0" />
          <path d="M22.5 25c2-7 17-7 19 0-3-3-7-4-9.5-4s-6.5 1-9.5 4z" fill="#5b4636" />
          <circle cx="28.5" cy="28" r="1.2" fill="#231915" />
          <circle cx="35.5" cy="28" r="1.2" fill="#231915" />
          <path d="M29.5 32.5q2.5 1.8 5 0" fill="none" stroke="#8a4b38" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'woman-4':
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full" aria-hidden="true">
          <path d="M18 58c0-10 6-16 14-16s14 6 14 16" fill={accent} />
          <circle cx="32" cy="18" r="6" fill="#2d201a" />
          <circle cx="32" cy="28.5" r="9.5" fill="#eec09e" />
          <path d="M22.5 26c3-6 15-6 19 0-3-3-6.5-4-9.5-4s-6.5 1-9.5 4z" fill="#2d201a" />
          <circle cx="28.5" cy="28.5" r="1.2" fill="#231915" />
          <circle cx="35.5" cy="28.5" r="1.2" fill="#231915" />
          <path d="M29.5 33q2.5 1.8 5 0" fill="none" stroke="#9e5a47" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

export const Avatar: React.FC<AvatarProps> = ({
  contact,
  size = 50,
  statusSegments,
  showOnlinePip = false,
  className = '',
}) => {
  const hasRing = statusSegments && statusSegments.length > 0;
  const outerSize = hasRing ? size + 8 : size;
  const radius = (outerSize - 3) / 2;
  const circumference = 2 * Math.PI * radius;
  const count = statusSegments?.length ?? 0;
  const gapPx = count > 1 ? 5 : 0;
  const segmentLength = count > 0 ? (circumference - gapPx * count) / count : 0;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: outerSize, height: outerSize }}
    >
      {hasRing && statusSegments && (
        <svg
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          {statusSegments.map((seg, idx) => {
            const offset = idx * (segmentLength + gapPx);
            return (
              <circle
                key={seg.id}
                cx={outerSize / 2}
                cy={outerSize / 2}
                r={radius}
                fill="none"
                stroke={seg.viewed ? '#8696A0' : '#25D366'}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray={`${Math.max(segmentLength, 4)} ${circumference}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </svg>
      )}

      <div
        className="rounded-full overflow-hidden flex items-center justify-center shadow-xs"
        style={{
          width: size,
          height: size,
          backgroundColor: contact.avatarBg,
        }}
      >
        {contact.isGroup ? (
          <Users
            style={{ width: size * 0.46, height: size * 0.46, color: contact.avatarAccent }}
            strokeWidth={2}
          />
        ) : (
          <PortraitSvg variant={contact.avatarVariant} accent={contact.avatarAccent} />
        )}
      </div>

      {showOnlinePip && contact.isOnline && !contact.isGroup && (
        <span
          className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] ring-2 ring-white dark:ring-[#121B22]"
          title="Çevrimiçi"
        />
      )}
    </div>
  );
};
