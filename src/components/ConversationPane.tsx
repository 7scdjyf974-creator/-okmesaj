import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  FileText,
  Info,
  MapPin,
  Mic,
  Paperclip,
  Phone,
  Reply,
  Search,
  SendHorizontal,
  Smile,
  Star,
  Trash2,
  Video,
  X,
} from 'lucide-react';
import {
  CallMediaType,
  ChatThread,
  Contact,
  Message,
  QuotedReply,
  SceneId,
} from '../types/messaging';
import { QUICK_SCENES } from '../data/mockMessagingData';
import { getAudioContext } from '../utils/soundEngine';
import { Avatar } from './Avatar';
import { ReceiptIcon } from './ReceiptIcon';
import { SCENE_META, SceneArtwork } from './SceneArtwork';
import { VoiceMessagePlayer } from './VoiceMessagePlayer';

interface ConversationPaneProps {
  chat: ChatThread | null;
  contact: Contact | null;
  allContacts: Contact[];
  myProfile: Contact;
  onBackMobile: () => void;
  onSendText: (chatId: string, text: string, replyTo?: QuotedReply) => void;
  onSendVoice: (chatId: string, durationSec: number, waveform: number[], audioUrl?: string) => void;
  onSendPhoto: (chatId: string, sceneId: SceneId, caption: string) => void;
  onSendDocument: (chatId: string, fileName: string, fileSize: string) => void;
  onSendLocation: (chatId: string, title: string, address: string) => void;
  onReactMessage: (chatId: string, messageId: string, emoji: string) => void;
  onToggleStarMessage: (chatId: string, messageId: string) => void;
  onDeleteMessage: (chatId: string, messageId: string) => void;
  onStartCall: (contactId: string, mediaType: CallMediaType) => void;
  onOpenContactInfo: () => void;
  onShowToast: (msg: string) => void;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '🙏', '☕', '🎉', '🔥', '👏', '😊', '🇹🇷', '✨'];

export const ConversationPane: React.FC<ConversationPaneProps> = ({
  chat,
  contact,
  allContacts,
  myProfile,
  onBackMobile,
  onSendText,
  onSendVoice,
  onSendPhoto,
  onSendDocument,
  onSendLocation,
  onReactMessage,
  onToggleStarMessage,
  onDeleteMessage,
  onStartCall,
  onOpenContactInfo,
  onShowToast,
}) => {
  const [draft, setDraft] = useState('');
  const [replyTarget, setReplyTarget] = useState<QuotedReply | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [scenePickerOpen, setScenePickerOpen] = useState(false);
  const [selectedScene, setSelectedScene] = useState<SceneId>('bosphorus');
  const [sceneCaption, setSceneCaption] = useState('');
  const [lightboxScene, setLightboxScene] = useState<{ sceneId: SceneId; caption?: string } | null>(null);
  const [activeActionMsgId, setActiveActionMsgId] = useState<string | null>(null);
  const [inChatSearchOpen, setInChatSearchOpen] = useState(false);
  const [inChatQuery, setInChatQuery] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const [recordBars, setRecordBars] = useState<number[]>([0.3, 0.5, 0.7, 0.4]);

  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.id, chat?.messages.length, chat?.isTyping]);

  // Reset UI popovers when switching chat
  useEffect(() => {
    setReplyTarget(null);
    setEmojiOpen(false);
    setAttachOpen(false);
    setScenePickerOpen(false);
    setActiveActionMsgId(null);
    setInChatSearchOpen(false);
    setInChatQuery('');
    setIsRecording(false);
    setRecordSec(0);
  }, [chat?.id]);

  // Voice recording timer + animated waveform
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setRecordSec((s) => s + 1);
      setRecordBars((prev) => {
        const nextBar = Number((0.22 + Math.random() * 0.75).toFixed(2));
        return [...prev.slice(-27), nextBar];
      });
    }, 1000);

    const barTicker = setInterval(() => {
      setRecordBars((prev) => {
        const nextBar = Number((0.2 + Math.random() * 0.78).toFixed(2));
        return [...prev.slice(-27), nextBar];
      });
    }, 220);

    return () => {
      clearInterval(interval);
      clearInterval(barTicker);
    };
  }, [isRecording]);

  if (!chat || !contact) {
    return (
      <div className="hidden md:flex flex-col items-center justify-center h-full bg-[#f0f2f5] dark:bg-[#222E35] border-b-[6px] border-[#008069] dark:border-[#00A884] px-8 text-center select-none">
        <div className="w-20 h-20 rounded-full bg-[#008069]/12 dark:bg-[#25D366]/12 flex items-center justify-center mb-6">
          <SendHorizontal className="w-9 h-9 text-[#008069] dark:text-[#25D366]" />
        </div>
        <h2 className="text-[24px] font-semibold text-[#111B21] dark:text-[#E9EDEF] tracking-tight">
          İleti Masaüstü ve Mobil
        </h2>
        <p className="text-[14.5px] text-[#667781] dark:text-[#8696A0] max-w-md mt-2 leading-relaxed">
          Anlık mesajlaşmak, sesli mesaj göndermek veya durum güncellemelerini görüntülemek için soldaki listeden bir sohbet seçin.
        </p>
      </div>
    );
  }

  const contactMap = new Map(allContacts.map((c) => [c.id, c]));

  const handleSend = () => {
    getAudioContext();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onSendText(chat.id, trimmed, replyTarget ?? undefined);
    setDraft('');
    setReplyTarget(null);
    setEmojiOpen(false);
    inputRef.current?.focus();
  };

  const stopMicStream = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
  };

  const startVoiceRecording = async () => {
    getAudioContext();
    setIsRecording(true);
    setRecordSec(0);
    setRecordBars([0.35, 0.55, 0.72, 0.45]);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (ev) => {
          if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
        };
        recorder.start();
      }
    } catch {
      // Permission denied or no mic: continue with synthesized voice waveform fallback
      mediaRecorderRef.current = null;
    }
  };

  const cancelVoiceRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    stopMicStream();
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordSec(0);
  };

  const handleFinishVoiceRecord = () => {
    const finalSec = Math.max(2, recordSec);
    const wave = recordBars.length >= 20 ? recordBars.slice(-28) : [
      ...recordBars,
      ...Array.from({ length: 28 - recordBars.length }, () => Number((0.25 + Math.random() * 0.65).toFixed(2))),
    ];

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.onstop = () => {
        stopMicStream();
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = blob.size > 0 ? URL.createObjectURL(blob) : undefined;
        onSendVoice(chat.id, finalSec, wave, url);
        mediaRecorderRef.current = null;
        audioChunksRef.current = [];
      };
      recorder.stop();
    } else {
      stopMicStream();
      onSendVoice(chat.id, finalSec, wave);
    }

    setIsRecording(false);
    setRecordSec(0);
  };

  const handleReplyToMessage = (msg: Message) => {
    const senderName =
      msg.senderId === 'me'
        ? 'Siz'
        : msg.senderName || contact.name;
    const previewText =
      msg.kind === 'voice'
        ? 'Sesli mesaj'
        : msg.kind === 'photo'
        ? msg.photoCaption || 'Fotoğraf'
        : msg.kind === 'document'
        ? msg.fileName || 'Belge'
        : msg.kind === 'location'
        ? msg.locationTitle || 'Konum'
        : msg.text || '';

    setReplyTarget({
      messageId: msg.id,
      senderName,
      previewText,
      isOwn: msg.senderId === 'me',
    });
    setActiveActionMsgId(null);
    inputRef.current?.focus();
  };

  const displayedMessages = inChatQuery.trim()
    ? chat.messages.filter((m) =>
        (m.text || m.photoCaption || m.fileName || m.locationTitle || '')
          .toLocaleLowerCase('tr-TR')
          .includes(inChatQuery.toLocaleLowerCase('tr-TR'))
      )
    : chat.messages;

  return (
    <div className="relative flex flex-col h-full bg-[#EFEAE2] dark:bg-[#0B141A]">
      {/* Conversation Top Header */}
      <header className="bg-[#008069] dark:bg-[#1F2C34] text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:shadow-none dark:border-b dark:border-[rgba(134,150,160,0.15)] z-20 shrink-0">
        <div className="flex items-center justify-between h-14 px-2 sm:px-3 gap-1">
          <div className="flex items-center gap-1 min-w-0 flex-1">
            <button
              type="button"
              onClick={onBackMobile}
              aria-label="Sohbetlere dön"
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onOpenContactInfo}
              className="flex items-center gap-2.5 min-w-0 flex-1 text-left py-1 px-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Avatar contact={contact} size={40} showOnlinePip={true} />
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold leading-tight text-white dark:text-[#E9EDEF] truncate">
                  {contact.name}
                </p>
                <p className="text-[12px] leading-tight truncate mt-0.5 text-white/85 dark:text-[#8696A0]">
                  {chat.isTyping ? (
                    <span className="text-[#92f5d9] dark:text-[#25D366] font-medium">
                      {chat.typingLabel || 'yazıyor...'}
                    </span>
                  ) : (
                    contact.onlineStatus
                  )}
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onStartCall(contact.id, 'video')}
              aria-label="Görüntülü ara"
              title="Görüntülü ara"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onStartCall(contact.id, 'voice')}
              aria-label="Sesli ara"
              title="Sesli ara"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Phone className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setInChatSearchOpen((v) => !v);
                setInChatQuery('');
              }}
              aria-label="Sohbette ara"
              title="Sohbette ara"
              className="hidden sm:flex min-w-[44px] min-h-[44px] items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onOpenContactInfo}
              aria-label="Kişi bilgisi"
              title="Kişi bilgisi"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>

        {inChatSearchOpen && (
          <div className="flex items-center gap-2 px-3 pb-2.5">
            <input
              type="text"
              autoFocus
              value={inChatQuery}
              onChange={(e) => setInChatQuery(e.target.value)}
              placeholder="Bu sohbette ara..."
              className="flex-1 bg-white/15 dark:bg-[#2A3942] text-white placeholder:text-white/70 rounded-full px-4 py-1.5 text-[14px] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setInChatSearchOpen(false);
                setInChatQuery('');
              }}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Sohbet aramasını kapat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Scrollable Conversation Stream Canvas */}
      <div
        className="flex-1 overflow-y-auto msg-scroll chat-wallpaper-light px-2.5 sm:px-6 lg:px-12 py-3"
        onClick={() => {
          setActiveActionMsgId(null);
          setEmojiOpen(false);
          setAttachOpen(false);
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col">
          {displayedMessages.map((msg, idx) => {
            const prevMsg = idx > 0 ? displayedMessages[idx - 1] : null;
            const showDateHeader = !prevMsg || prevMsg.dateGroup !== msg.dateGroup;
            const isSameSenderAsPrev =
              prevMsg && prevMsg.senderId === msg.senderId && !showDateHeader;
            const isOutgoing = msg.senderId === 'me';
            const senderObj = isOutgoing
              ? myProfile
              : contactMap.get(msg.senderId) || contact;

            return (
              <React.Fragment key={msg.id}>
                {showDateHeader && (
                  <div className="flex justify-center my-3">
                    <span className="px-3 py-1 rounded-lg bg-white/95 dark:bg-[#182229] text-[#54656F] dark:text-[#8696A0] text-[11.5px] font-medium tracking-wide shadow-[0_1px_1px_rgba(11,20,26,0.08)]">
                      {msg.dateGroup}
                    </span>
                  </div>
                )}

                <div
                  className={`group relative flex flex-col ${
                    isOutgoing ? 'items-end' : 'items-start'
                  } ${isSameSenderAsPrev ? 'mt-[2px]' : 'mt-[8px]'}`}
                >
                  <div className="relative flex items-end gap-1.5 max-w-[82%] md:max-w-[65%]">
                    {/* Message Bubble */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveActionMsgId((prev) => (prev === msg.id ? null : msg.id));
                      }}
                      className={`relative px-2.5 py-1.5 rounded-[8px] shadow-[0_1px_1px_rgba(11,20,26,0.08)] cursor-pointer transition-colors ${
                        isOutgoing
                          ? `bg-[#D9FDD3] dark:bg-[#005C4B] text-[#111B21] dark:text-[#E9EDEF] ${
                              !isSameSenderAsPrev ? 'rounded-tr-none' : ''
                            }`
                          : `bg-white dark:bg-[#202C33] text-[#111B21] dark:text-[#E9EDEF] ${
                              !isSameSenderAsPrev ? 'rounded-tl-none' : ''
                            }`
                      }`}
                    >
                      {/* Group Sender Name */}
                      {contact.isGroup && !isOutgoing && !isSameSenderAsPrev && msg.senderName && (
                        <p className="text-[12.5px] font-semibold text-[#008069] dark:text-[#53BDEB] mb-0.5 leading-tight">
                          {msg.senderName}
                        </p>
                      )}

                      {/* Quoted Reply Block */}
                      {msg.replyTo && (
                        <div className="mb-1.5 px-2.5 py-1.5 rounded-md bg-black/[0.05] dark:bg-black/25 flex flex-col gap-0.5">
                          <span className="text-[12px] font-semibold text-[#008069] dark:text-[#25D366]">
                            {msg.replyTo.senderName}
                          </span>
                          <span className="text-[12.5px] text-[#54656F] dark:text-[#aebac1] line-clamp-2">
                            {msg.replyTo.previewText}
                          </span>
                        </div>
                      )}

                      {/* Message Content by Kind */}
                      {msg.kind === 'text' && (
                        <p className="text-[14.5px] leading-[20px] whitespace-pre-wrap break-words pr-1">
                          {msg.text}
                          {/* Inline spacer so timestamp sits cleanly at bottom-right */}
                          <span className="inline-block w-16 h-3 align-bottom" aria-hidden="true" />
                        </p>
                      )}

                      {msg.kind === 'voice' && (
                        <div className="pb-2">
                          <VoiceMessagePlayer
                            messageId={msg.id}
                            durationSec={msg.voiceDurationSec ?? 12}
                            waveform={msg.waveform ?? [0.4, 0.7, 0.5, 0.8]}
                            audioUrl={msg.audioUrl}
                            isOutgoing={isOutgoing}
                            senderContact={senderObj}
                          />
                        </div>
                      )}

                      {msg.kind === 'photo' && msg.sceneId && (
                        <div className="w-[240px] sm:w-[276px]">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightboxScene({ sceneId: msg.sceneId!, caption: msg.photoCaption });
                            }}
                            className="block w-full rounded-[6px] overflow-hidden cursor-pointer focus:outline-none"
                          >
                            <SceneArtwork sceneId={msg.sceneId} className="w-full h-44" />
                          </button>
                          {msg.photoCaption && (
                            <p className="text-[14.5px] leading-[20px] mt-1.5 pb-1 whitespace-pre-wrap">
                              {msg.photoCaption}
                              <span className="inline-block w-16 h-3 align-bottom" aria-hidden="true" />
                            </p>
                          )}
                          {!msg.photoCaption && <div className="h-3" />}
                        </div>
                      )}

                      {msg.kind === 'document' && (
                        <div className="flex items-center gap-3 p-2 rounded-md bg-black/[0.04] dark:bg-black/20 min-w-[230px] mb-2">
                          <div className="w-10 h-10 rounded-lg bg-[#ba1a1a]/15 text-[#ba1a1a] dark:text-[#f87171] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[13.5px] font-medium truncate">
                              {msg.fileName}
                            </p>
                            <p className="text-[11.5px] text-[#8696A0] tabular-nums">
                              {msg.filePages} · {msg.fileSize}
                            </p>
                          </div>
                        </div>
                      )}

                      {msg.kind === 'location' && (
                        <div className="w-[240px] sm:w-[260px] mb-2">
                          <div className="h-28 rounded-md bg-[#e0f0fb] dark:bg-[#121B22] relative overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/10">
                            <svg viewBox="0 0 240 110" className="w-full h-full opacity-70" aria-hidden="true">
                              <path d="M0 30h240M0 75h240M60 0v110M165 0v110" stroke="#8696A0" strokeWidth="2" strokeOpacity="0.35" />
                              <path d="M0 95 L240 15" stroke="#008069" strokeWidth="3" strokeOpacity="0.4" />
                            </svg>
                            <div className="absolute w-9 h-9 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-md">
                              <MapPin className="w-5 h-5" />
                            </div>
                          </div>
                          <p className="text-[14px] font-semibold mt-1.5 leading-snug">
                            {msg.locationTitle}
                          </p>
                          <p className="text-[12px] text-[#667781] dark:text-[#8696A0] leading-snug">
                            {msg.locationAddress}
                          </p>
                        </div>
                      )}

                      {/* Floating Timestamp + Star + Delivery Receipt */}
                      <div className="absolute bottom-1.5 right-2.5 flex items-center gap-1 select-none">
                        {msg.starred && (
                          <Star className="w-3 h-3 text-[#8696A0] fill-current" aria-label="Yıldızlı" />
                        )}
                        <span className="text-[11px] leading-[13px] text-[#667781] dark:text-[#8696A0] tabular-nums">
                          {msg.timestamp}
                        </span>
                        {isOutgoing && <ReceiptIcon status={msg.status} />}
                      </div>
                    </div>
                  </div>

                  {/* Emoji Reactions Strip */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div
                      className={`flex items-center gap-1 -mt-1.5 z-10 px-1.5 py-0.5 rounded-full bg-white dark:bg-[#233138] shadow-sm border border-black/5 dark:border-white/10 text-[12px] ${
                        isOutgoing ? 'mr-2' : 'ml-2'
                      }`}
                    >
                      {msg.reactions.map((r) => (
                        <button
                          key={r.emoji}
                          type="button"
                          onClick={() => onReactMessage(chat.id, msg.id, r.emoji)}
                          className="flex items-center gap-0.5 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <span>{r.emoji}</span>
                          {r.count > 1 && (
                            <span className="text-[11px] font-medium text-[#667781] dark:text-[#8696A0] tabular-nums">
                              {r.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Contextual Message Action Bar (on tap/click) */}
                  {activeActionMsgId === msg.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`mt-1.5 flex items-center gap-1 p-1 rounded-full bg-white dark:bg-[#233138] shadow-[0_4px_16px_rgba(11,20,26,0.2)] border border-black/5 dark:border-white/10 z-20 ${
                        isOutgoing ? 'self-end' : 'self-start'
                      }`}
                    >
                      {['👍', '❤️', '😂', '😮', '🙏'].map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => {
                            onReactMessage(chat.id, msg.id, em);
                            setActiveActionMsgId(null);
                          }}
                          className="w-8 h-8 rounded-full hover:bg-[#f0f2f5] dark:hover:bg-white/10 flex items-center justify-center text-[16px] cursor-pointer"
                        >
                          {em}
                        </button>
                      ))}
                      <span className="w-px h-5 bg-[#e9edef] dark:bg-white/10 mx-0.5" />
                      <button
                        type="button"
                        onClick={() => handleReplyToMessage(msg)}
                        title="Yanıtla"
                        className="w-8 h-8 rounded-full hover:bg-[#f0f2f5] dark:hover:bg-white/10 flex items-center justify-center text-[#54656F] dark:text-[#aebac1] cursor-pointer"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onToggleStarMessage(chat.id, msg.id);
                          setActiveActionMsgId(null);
                        }}
                        title={msg.starred ? 'Yıldızı kaldır' : 'Yıldızla'}
                        className="w-8 h-8 rounded-full hover:bg-[#f0f2f5] dark:hover:bg-white/10 flex items-center justify-center text-[#54656F] dark:text-[#aebac1] cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${msg.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                      {msg.text && (
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(msg.text || '').catch(() => {});
                            onShowToast('Mesaj kopyalandı');
                            setActiveActionMsgId(null);
                          }}
                          title="Kopyala"
                          className="w-8 h-8 rounded-full hover:bg-[#f0f2f5] dark:hover:bg-white/10 flex items-center justify-center text-[#54656F] dark:text-[#aebac1] cursor-pointer"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteMessage(chat.id, msg.id);
                          setActiveActionMsgId(null);
                        }}
                        title="Sil"
                        className="w-8 h-8 rounded-full hover:bg-[#ffdad6] dark:hover:bg-red-950/50 flex items-center justify-center text-[#ba1a1a] dark:text-[#f87171] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* Live Typing Indicator Bubble */}
          {chat.isTyping && (
            <div className="mt-2 flex items-start">
              <div className="px-3.5 py-2.5 rounded-[8px] rounded-tl-none bg-white dark:bg-[#202C33] shadow-[0_1px_1px_rgba(11,20,26,0.08)] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#8696A0] animate-bounce" />
              </div>
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>
      </div>

      {/* Popovers above Input Bar (Emoji, Attachment, Camera Scene Picker) */}
      {emojiOpen && (
        <div className="mx-3 mb-2 p-2.5 rounded-2xl bg-white dark:bg-[#233138] shadow-[0_4px_16px_rgba(11,20,26,0.2)] border border-black/5 dark:border-white/10 flex flex-wrap gap-1.5 max-w-sm">
          {QUICK_EMOJIS.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => setDraft((prev) => prev + em)}
              className="w-10 h-10 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-white/10 text-[20px] flex items-center justify-center cursor-pointer"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {attachOpen && (
        <div className="mx-3 mb-2 p-3 rounded-2xl bg-white dark:bg-[#233138] shadow-[0_4px_16px_rgba(11,20,26,0.2)] border border-black/5 dark:border-white/10 grid grid-cols-3 gap-2 max-w-xs">
          <button
            type="button"
            onClick={() => {
              setAttachOpen(false);
              setScenePickerOpen(true);
            }}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-white/5 cursor-pointer"
          >
            <span className="w-11 h-11 rounded-full bg-[#007aa0] text-white flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </span>
            <span className="text-[12px] font-medium text-[#111B21] dark:text-[#E9EDEF]">Fotoğraf</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSendDocument(chat.id, 'Proje_Sunumu_2026.pdf', '1.8 MB');
              setAttachOpen(false);
            }}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-white/5 cursor-pointer"
          >
            <span className="w-11 h-11 rounded-full bg-[#5b21b6] text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </span>
            <span className="text-[12px] font-medium text-[#111B21] dark:text-[#E9EDEF]">Belge</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSendLocation(chat.id, 'Moda Sahil Parkı', 'Caferağa, Kadıköy/İstanbul');
              setAttachOpen(false);
            }}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl hover:bg-[#f0f2f5] dark:hover:bg-white/5 cursor-pointer"
          >
            <span className="w-11 h-11 rounded-full bg-[#006d2f] text-white flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </span>
            <span className="text-[12px] font-medium text-[#111B21] dark:text-[#E9EDEF]">Konum</span>
          </button>
        </div>
      )}

      {/* Quoted Reply Banner */}
      {replyTarget && (
        <div className="mx-3 mb-1 px-3 py-2 rounded-xl bg-white dark:bg-[#202C33] shadow-sm flex items-center justify-between gap-2 border border-black/5 dark:border-white/10">
          <div className="min-w-0 flex-1 pl-2 border-l-2 border-[#008069] dark:border-[#25D366]">
            <p className="text-[12px] font-semibold text-[#008069] dark:text-[#25D366]">
              {replyTarget.senderName}
            </p>
            <p className="text-[13px] text-[#667781] dark:text-[#8696A0] truncate">
              {replyTarget.previewText}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReplyTarget(null)}
            aria-label="Yanıtı iptal et"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#8696A0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Bottom Sheet Bar / Voice Record Tray */}
      <div className="px-2 sm:px-3 py-2 flex items-end gap-1.5 shrink-0 z-10">
        {isRecording ? (
          /* Live Voice Recording Tray */
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#202C33] rounded-[24px] px-3 h-12 shadow-[0_1px_1px_rgba(11,20,26,0.08)]">
            <button
              type="button"
              onClick={cancelVoiceRecording}
              aria-label="Ses kaydını iptal et"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#ba1a1a] hover:bg-[#ffdad6]/50 cursor-pointer"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse" />
              <span className="text-[14px] font-semibold text-[#111B21] dark:text-[#E9EDEF] tabular-nums">
                {Math.floor(recordSec / 60)}:{(recordSec % 60).toString().padStart(2, '0')}
              </span>
            </div>

            <div className="flex-1 flex items-center gap-[2px] h-7 overflow-hidden px-2">
              {recordBars.map((amp, i) => (
                <span
                  key={i}
                  className="w-[2.5px] rounded-full bg-[#008069] dark:bg-[#25D366] shrink-0 transition-all duration-150"
                  style={{ height: `${Math.max(4, Math.round(amp * 22))}px` }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Pill-Shaped Text Input Container */
          <div className="flex-1 flex items-end gap-1 bg-white dark:bg-[#202C33] rounded-[24px] px-1.5 py-0.5 min-h-[48px] shadow-[0_1px_1px_rgba(11,20,26,0.08)]">
            <button
              type="button"
              onClick={() => {
                setEmojiOpen((v) => !v);
                setAttachOpen(false);
              }}
              aria-label="Emoji seç"
              className="min-w-[42px] min-h-[44px] flex items-center justify-center rounded-full text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-[#E9EDEF] cursor-pointer shrink-0"
            >
              <Smile className="w-6 h-6" />
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Bir mesaj yazın"
              className="flex-1 bg-transparent py-2.5 px-1 text-[15px] leading-[22px] text-[#111B21] dark:text-[#E9EDEF] placeholder:text-[#8696A0] resize-none max-h-28 focus:outline-none"
            />

            <button
              type="button"
              onClick={() => {
                setAttachOpen((v) => !v);
                setEmojiOpen(false);
              }}
              aria-label="Dosya ekle"
              className="min-w-[42px] min-h-[44px] flex items-center justify-center rounded-full text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-[#E9EDEF] cursor-pointer shrink-0"
            >
              <Paperclip className="w-5 h-5 -rotate-45" />
            </button>

            {!draft.trim() && (
              <button
                type="button"
                onClick={() => setScenePickerOpen(true)}
                aria-label="Kamera ile fotoğraf gönder"
                className="min-w-[42px] min-h-[44px] flex items-center justify-center rounded-full text-[#54656F] dark:text-[#8696A0] hover:text-[#111B21] dark:hover:text-[#E9EDEF] cursor-pointer shrink-0"
              >
                <Camera className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Detached 48px Circular Action Button (Mic <-> Send) */}
        {isRecording ? (
          <button
            type="button"
            onClick={handleFinishVoiceRecord}
            aria-label="Sesli mesajı gönder"
            className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer"
          >
            <Check className="w-6 h-6" strokeWidth={2.5} />
          </button>
        ) : draft.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            aria-label="Mesajı gönder"
            className="w-12 h-12 rounded-full bg-[#008069] dark:bg-[#25D366] hover:bg-[#006552] dark:hover:bg-[#20bd5a] text-white shadow-md flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={startVoiceRecording}
            aria-label="Sesli mesaj kaydet"
            title="Sesli mesaj kaydet"
            className="w-12 h-12 rounded-full bg-[#008069] dark:bg-[#25D366] hover:bg-[#006552] dark:hover:bg-[#20bd5a] text-white shadow-md flex items-center justify-center shrink-0 active:scale-95 transition-transform cursor-pointer"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Camera / Scene Photo Composer Modal */}
      {scenePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e9edef] dark:border-white/10">
              <h3 className="text-[16px] font-semibold">Fotoğraf Gönder</h3>
              <button
                type="button"
                onClick={() => setScenePickerOpen(false)}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="rounded-xl overflow-hidden">
                <SceneArtwork sceneId={selectedScene} className="w-full h-48" />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {QUICK_SCENES.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScene(sc.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      selectedScene === sc.id
                        ? 'bg-[#008069] text-white'
                        : 'bg-[#f0f2f5] dark:bg-[#2A3942] text-[#54656F] dark:text-[#aebac1]'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>

              <input
                type="text"
                value={sceneCaption}
                onChange={(e) => setSceneCaption(e.target.value)}
                placeholder="Açıklama ekleyin..."
                className="w-full px-4 py-2.5 rounded-full bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setScenePickerOpen(false)}
                  className="px-4 py-2 rounded-full text-[14px] font-medium text-[#667781] dark:text-[#8696A0] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSendPhoto(chat.id, selectedScene, sceneCaption.trim());
                    setSceneCaption('');
                    setScenePickerOpen(false);
                  }}
                  className="px-5 py-2 rounded-full bg-[#25D366] text-white text-[14px] font-semibold hover:bg-[#20bd5a] cursor-pointer"
                >
                  Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {lightboxScene && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxScene(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxScene(null)}
            aria-label="Fotoğrafı kapat"
            className="absolute top-4 right-4 min-w-[44px] min-h-[44px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-2xl w-full rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <SceneArtwork sceneId={lightboxScene.sceneId} className="w-full h-72 sm:h-96" />
            <div className="bg-[#111B21] text-white px-5 py-3.5">
              <p className="text-[15px] font-medium">
                {lightboxScene.caption || SCENE_META[lightboxScene.sceneId].title}
              </p>
              <p className="text-[12.5px] text-[#8696A0] mt-0.5">
                {SCENE_META[lightboxScene.sceneId].subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
