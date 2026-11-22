import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, SendHorizontal, X } from 'lucide-react';
import { Contact, StatusSegment } from '../types/messaging';
import { Avatar } from './Avatar';
import { SceneArtwork } from './SceneArtwork';

interface StatusViewerModalProps {
  contact: Contact | null;
  segments: StatusSegment[];
  isOwn: boolean;
  onClose: () => void;
  onMarkViewed: (contactId: string, segmentId: string) => void;
  onReplyToStatus: (contactId: string, statusPreview: string, replyText: string) => void;
}

export const StatusViewerModal: React.FC<StatusViewerModalProps> = ({
  contact,
  segments,
  isOwn,
  onClose,
  onMarkViewed,
  onReplyToStatus,
}) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [replyText, setReplyText] = useState('');

  const current = segments[index];

  useEffect(() => {
    setIndex(0);
    setProgress(0);
    setPaused(false);
  }, [contact?.id]);

  useEffect(() => {
    if (contact && current && !current.viewed) {
      onMarkViewed(contact.id, current.id);
    }
  }, [contact, current, onMarkViewed]);

  useEffect(() => {
    if (!contact || !current || paused) return;
    const durationMs = 5000;
    const stepMs = 50;
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (stepMs / durationMs) * 100;
        if (next >= 100) {
          if (index < segments.length - 1) {
            setIndex((i) => i + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return next;
      });
    }, stepMs);
    return () => clearInterval(timer);
  }, [contact, current, paused, index, segments.length, onClose]);

  if (!contact || !current) return null;

  const goPrev = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const goNext = () => {
    if (index < segments.length - 1) {
      setIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const preview =
      current.type === 'text'
        ? current.text || 'Durum'
        : current.caption || 'Fotoğraf durumu';
    onReplyToStatus(contact.id, preview, replyText.trim());
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B141A] text-white flex flex-col items-center justify-between select-none">
      {/* Top Progress Bars & Header */}
      <div className="w-full max-w-lg px-3 pt-3 z-20">
        <div className="flex gap-1.5 mb-3">
          {segments.map((seg, idx) => (
            <div key={seg.id} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-75"
                style={{
                  width:
                    idx < index ? '100%' : idx === index ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar contact={contact} size={40} />
            <div className="min-w-0">
              <p className="text-[15px] font-semibold truncate">
                {isOwn ? 'Durumum' : contact.name}
              </p>
              <p className="text-[12px] text-white/75">{current.timeAgo}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Devam ettir' : 'Duraklat'}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              {paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Durumu kapat"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Story Canvas */}
      <div className="relative flex-1 w-full max-w-lg flex items-center justify-center px-4 my-2">
        {/* Tap/Click Prev & Next Controls */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Önceki durum"
          className="hidden sm:flex absolute left-2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 items-center justify-center cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {current.type === 'text' ? (
          <div
            className="w-full h-full max-h-[540px] rounded-2xl flex items-center justify-center p-8 text-center shadow-2xl"
            style={{ backgroundColor: current.bgColor || '#006552' }}
            onClick={goNext}
          >
            <p className="text-[24px] sm:text-[28px] font-semibold leading-snug text-white text-balance">
              {current.text}
            </p>
          </div>
        ) : (
          <div
            className="w-full max-h-[540px] rounded-2xl overflow-hidden shadow-2xl bg-black flex flex-col"
            onClick={goNext}
          >
            <SceneArtwork
              sceneId={current.sceneId || 'bosphorus'}
              className="w-full h-[360px] sm:h-[420px]"
            />
            {current.caption && (
              <div className="bg-black/75 px-5 py-3.5 text-center">
                <p className="text-[15px] text-white leading-snug">{current.caption}</p>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={goNext}
          aria-label="Sonraki durum"
          className="hidden sm:flex absolute right-2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 items-center justify-center cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Reply Bar (for others' statuses) */}
      <div className="w-full max-w-lg px-4 pb-5 z-20">
        {!isOwn ? (
          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              placeholder="Duruma yanıt ver..."
              className="flex-1 bg-white/15 border border-white/20 rounded-full px-4 py-2.5 text-[14.5px] text-white placeholder:text-white/65 focus:outline-none focus:border-white/50"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              aria-label="Yanıt gönder"
              className="w-11 h-11 rounded-full bg-[#25D366] disabled:opacity-40 text-white flex items-center justify-center shrink-0 cursor-pointer"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <p className="text-center text-[13px] text-white/65">
            Kendi durum güncellemeniz · {segments.length} paylaşım
          </p>
        )}
      </div>
    </div>
  );
};
