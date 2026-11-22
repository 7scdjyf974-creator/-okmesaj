import React, { useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play } from 'lucide-react';
import { Contact } from '../types/messaging';
import { getAudioContext, SynthesizedVoiceTrack } from '../utils/soundEngine';
import { Avatar } from './Avatar';

interface VoiceMessagePlayerProps {
  messageId: string;
  durationSec: number;
  waveform: number[];
  audioUrl?: string;
  isOutgoing: boolean;
  senderContact: Pick<Contact, 'name' | 'avatarBg' | 'avatarAccent' | 'avatarVariant' | 'isGroup'>;
}

function formatSeconds(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}:${rem.toString().padStart(2, '0')}`;
}

export const VoiceMessagePlayer: React.FC<VoiceMessagePlayerProps> = ({
  durationSec,
  waveform,
  audioUrl,
  isOutgoing,
  senderContact,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SynthesizedVoiceTrack | null>(null);

  useEffect(() => {
    if (!synthRef.current) {
      synthRef.current = new SynthesizedVoiceTrack();
    }
    return () => {
      synthRef.current?.stop();
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTickRef.current = null;
      synthRef.current?.stop();
      if (audioElRef.current) {
        audioElRef.current.pause();
      }
      return;
    }

    if (audioUrl && audioElRef.current) {
      const el = audioElRef.current;
      el.playbackRate = speed;
      if (el.duration && Number.isFinite(el.duration)) {
        el.currentTime = Math.min(el.duration - 0.05, progress * el.duration);
      }
      el.play().catch(() => {
        // Fallback to synth if real audio playback fails
        synthRef.current?.start(waveform, durationSec, progress, speed);
      });
    } else {
      synthRef.current?.start(waveform, durationSec, progress, speed);
    }

    const tick = (now: number) => {
      if (audioUrl && audioElRef.current && audioElRef.current.duration && Number.isFinite(audioElRef.current.duration)) {
        const p = audioElRef.current.currentTime / audioElRef.current.duration;
        if (audioElRef.current.ended || p >= 1) {
          setIsPlaying(false);
          setProgress(0);
          return;
        }
        setProgress(p);
      } else {
        if (lastTickRef.current !== null) {
          const dt = (now - lastTickRef.current) / 1000;
          const delta = (dt * speed) / Math.max(1, durationSec);
          setProgress((prev) => {
            const next = prev + delta;
            if (next >= 1) {
              setIsPlaying(false);
              return 0;
            }
            return next;
          });
        }
        lastTickRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      synthRef.current?.stop();
    };
  }, [isPlaying, durationSec, speed, audioUrl, waveform]);

  const togglePlay = () => {
    getAudioContext();
    setIsPlaying((p) => !p);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  const handleBarScrub = (idx: number) => {
    const nextProgress = Math.min(0.99, Math.max(0, (idx + 1) / waveform.length));
    setProgress(nextProgress);
    if (audioUrl && audioElRef.current && audioElRef.current.duration && Number.isFinite(audioElRef.current.duration)) {
      audioElRef.current.currentTime = nextProgress * audioElRef.current.duration;
    } else if (isPlaying) {
      synthRef.current?.start(waveform, durationSec, nextProgress, speed);
    }
  };

  const currentSec = isPlaying || progress > 0 ? Math.floor(progress * durationSec) : durationSec;

  return (
    <div className="flex items-center gap-2.5 min-w-[232px] sm:min-w-[260px] py-0.5 select-none">
      {audioUrl && <audio ref={audioElRef} src={audioUrl} preload="metadata" />}

      {/* Avatar with microphone badge (or speed pill when playing) */}
      <div className="relative shrink-0">
        {isPlaying ? (
          <button
            type="button"
            onClick={cycleSpeed}
            className="w-10 h-10 rounded-full bg-[#008069] text-white text-xs font-semibold tabular-nums flex items-center justify-center hover:bg-[#006552] transition-colors cursor-pointer"
            title="Oynatma hızını değiştir"
          >
            {speed}x
          </button>
        ) : (
          <>
            <Avatar contact={senderContact} size={40} />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-2 ${
                isOutgoing
                  ? 'bg-[#D9FDD3] dark:bg-[#005C4B] ring-[#D9FDD3] dark:ring-[#005C4B]'
                  : 'bg-white dark:bg-[#202C33] ring-white dark:ring-[#202C33]'
              }`}
            >
              <Mic className="w-3 h-3 text-[#53BDEB]" strokeWidth={2.5} />
            </span>
          </>
        )}
      </div>

      {/* 36px Play/Pause circular trigger */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Sesli mesajı duraklat' : 'Sesli mesajı oynat'}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer ${
          isOutgoing
            ? 'bg-[#008069] text-white hover:bg-[#006552]'
            : 'bg-[#008069]/12 dark:bg-white/10 text-[#008069] dark:text-[#E9EDEF] hover:bg-[#008069]/20'
        }`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      {/* Waveform & inline duration */}
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <div
          className="flex items-center gap-[2px] h-7 cursor-pointer"
          role="slider"
          aria-label="Ses kaydı konumu"
          aria-valuemin={0}
          aria-valuemax={durationSec}
          aria-valuenow={Math.round(progress * durationSec)}
        >
          {waveform.map((amp, i) => {
            const barFraction = i / waveform.length;
            const isPlayed = barFraction <= progress && (isPlaying || progress > 0);
            const heightPx = Math.max(4, Math.round(amp * 24));
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleBarScrub(i)}
                aria-label={`Ses saniyesi ${Math.round(barFraction * durationSec)}`}
                className="w-[2.5px] rounded-full transition-colors duration-100 shrink-0 focus:outline-none"
                style={{
                  height: `${heightPx}px`,
                  backgroundColor: isPlayed ? '#53BDEB' : '#8696A0',
                  opacity: isPlayed ? 1 : 0.72,
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[11px] leading-none text-[#8696A0] tabular-nums">
          <span>{formatSeconds(currentSec)}</span>
        </div>
      </div>
    </div>
  );
};
