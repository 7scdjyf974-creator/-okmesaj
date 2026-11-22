import React, { useEffect, useState } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { CallMediaType, Contact } from '../types/messaging';
import {
  getAudioContext,
  playCallConnectedChime,
  startCallRingbackTone,
} from '../utils/soundEngine';
import { Avatar } from './Avatar';

interface CallOverlayModalProps {
  contact: Contact | null;
  mediaType: CallMediaType;
  onEndCall: (durationSec: number) => void;
}

export const CallOverlayModal: React.FC<CallOverlayModalProps> = ({
  contact,
  mediaType,
  onEndCall,
}) => {
  const [connected, setConnected] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [videoOn, setVideoOn] = useState(mediaType === 'video');

  useEffect(() => {
    if (!contact) return;
    getAudioContext();
    setConnected(false);
    setElapsedSec(0);
    setMuted(false);
    setSpeaker(false);
    setVideoOn(mediaType === 'video');

    const stopRing = startCallRingbackTone();
    const connectTimer = setTimeout(() => {
      stopRing();
      playCallConnectedChime();
      setConnected(true);
    }, 2000);

    return () => {
      stopRing();
      clearTimeout(connectTimer);
    };
  }, [contact, mediaType]);

  useEffect(() => {
    if (!connected) return;
    const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [connected]);

  if (!contact) return null;

  const mins = Math.floor(elapsedSec / 60)
    .toString()
    .padStart(2, '0');
  const secs = (elapsedSec % 60).toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 bg-[#0B141A] text-white flex flex-col items-center justify-between py-12 px-6 select-none">
      {/* Top Encryption & Contact Identity */}
      <div className="flex flex-col items-center text-center mt-4">
        <p className="text-[12px] text-[#8696A0] tracking-wide mb-6">
          Uçtan uca şifreli {videoOn ? 'görüntülü' : 'sesli'} arama
        </p>

        <div className="relative">
          {!connected && (
            <span className="absolute -inset-3 rounded-full border-2 border-[#25D366]/40 animate-ping" />
          )}
          <Avatar contact={contact} size={112} />
        </div>

        <h2 className="text-[24px] font-semibold mt-6 text-[#E9EDEF]">
          {contact.name}
        </h2>

        <p className="text-[15px] text-[#8696A0] mt-1.5 tabular-nums">
          {connected ? `${mins}:${secs}` : 'Çalıyor...'}
        </p>

        {videoOn && (
          <div className="mt-6 px-4 py-2 rounded-full bg-white/10 text-[13px] text-[#92f5d9]">
            Kamera önizlemesi etkin
          </div>
        )}
      </div>

      {/* Bottom Call Control Bar */}
      <div className="w-full max-w-sm bg-[#1F2C34] rounded-3xl px-6 py-4 flex items-center justify-between shadow-2xl border border-white/10">
        <button
          type="button"
          onClick={() => setSpeaker((s) => !s)}
          aria-label={speaker ? 'Hoparlörü kapat' : 'Hoparlörü aç'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            speaker ? 'bg-white text-[#0B141A]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {speaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => setVideoOn((v) => !v)}
          aria-label={videoOn ? 'Kamerayı kapat' : 'Kamerayı aç'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            videoOn ? 'bg-white text-[#0B141A]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Sesi aç' : 'Sessize al'}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            muted ? 'bg-white text-[#0B141A]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <button
          type="button"
          onClick={() => onEndCall(connected ? elapsedSec : 0)}
          aria-label="Aramayı sonlandır"
          className="w-14 h-12 rounded-full bg-[#ba1a1a] hover:bg-[#93000a] text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
