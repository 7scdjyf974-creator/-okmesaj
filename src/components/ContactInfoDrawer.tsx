import React from 'react';
import {
  Bell,
  BellOff,
  Phone,
  Pin,
  Trash2,
  Users,
  Video,
  X,
} from 'lucide-react';
import { CallMediaType, ChatThread, Contact } from '../types/messaging';
import { Avatar } from './Avatar';
import { SceneArtwork } from './SceneArtwork';

interface ContactInfoDrawerProps {
  open: boolean;
  contact: Contact | null;
  chat: ChatThread | null;
  onClose: () => void;
  onToggleMute: (chatId: string) => void;
  onTogglePin: (chatId: string) => void;
  onClearChat: (chatId: string) => void;
  onStartCall: (contactId: string, mediaType: CallMediaType) => void;
}

export const ContactInfoDrawer: React.FC<ContactInfoDrawerProps> = ({
  open,
  contact,
  chat,
  onClose,
  onToggleMute,
  onTogglePin,
  onClearChat,
  onStartCall,
}) => {
  if (!open || !contact || !chat) return null;

  const sharedPhotos = chat.messages.filter((m) => m.kind === 'photo' && m.sceneId);

  return (
    <aside className="fixed inset-0 z-40 md:static md:inset-auto md:w-[340px] lg:w-[380px] h-full bg-[#f0f2f5] dark:bg-[#0B141A] border-l border-[#e9edef] dark:border-white/10 flex flex-col shrink-0">
      {/* Header */}
      <div className="h-14 px-4 bg-[#008069] dark:bg-[#1F2C34] text-white flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          aria-label="Kişi bilgisini kapat"
          className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-[16px] font-semibold">
          {contact.isGroup ? 'Grup bilgisi' : 'Kişi bilgisi'}
        </h2>
      </div>

      {/* Scrollable Profile Content */}
      <div className="flex-1 overflow-y-auto msg-scroll space-y-2.5 pb-6">
        {/* Identity Card */}
        <div className="bg-white dark:bg-[#121B22] px-6 py-7 flex flex-col items-center text-center shadow-xs">
          <Avatar contact={contact} size={104} showOnlinePip={true} />
          <h3 className="text-[20px] font-semibold text-[#111B21] dark:text-[#E9EDEF] mt-4">
            {contact.name}
          </h3>
          <p className="text-[14px] text-[#8696A0] mt-0.5 tabular-nums">
            {contact.phone}
          </p>

          <div className="flex items-center gap-4 mt-5">
            <button
              type="button"
              onClick={() => onStartCall(contact.id, 'voice')}
              className="flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#202C33] hover:bg-[#e4e8ec] dark:hover:bg-[#2A3942] text-[#008069] dark:text-[#25D366] transition-colors cursor-pointer min-w-[84px]"
            >
              <Phone className="w-5 h-5" />
              <span className="text-[12px] font-medium text-[#111B21] dark:text-[#E9EDEF]">Sesli</span>
            </button>
            <button
              type="button"
              onClick={() => onStartCall(contact.id, 'video')}
              className="flex flex-col items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#202C33] hover:bg-[#e4e8ec] dark:hover:bg-[#2A3942] text-[#008069] dark:text-[#25D366] transition-colors cursor-pointer min-w-[84px]"
            >
              <Video className="w-5 h-5" />
              <span className="text-[12px] font-medium text-[#111B21] dark:text-[#E9EDEF]">Görüntülü</span>
            </button>
          </div>
        </div>

        {/* Hakkında */}
        <div className="bg-white dark:bg-[#121B22] px-5 py-4 shadow-xs">
          <p className="text-[12.5px] font-medium text-[#8696A0]">Hakkında</p>
          <p className="text-[14.5px] text-[#111B21] dark:text-[#E9EDEF] mt-1">
            {contact.about}
          </p>
        </div>

        {/* Group Members */}
        {contact.isGroup && contact.members && (
          <div className="bg-white dark:bg-[#121B22] px-5 py-4 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12.5px] font-medium text-[#8696A0]">
                Katılımcılar ({contact.members.length})
              </p>
              <Users className="w-4 h-4 text-[#8696A0]" />
            </div>
            <div className="divide-y divide-[#f0f2f5] dark:divide-white/5">
              {contact.members.map((member) => (
                <div key={member} className="py-2 text-[14px] text-[#111B21] dark:text-[#E9EDEF]">
                  {member}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared Media */}
        <div className="bg-white dark:bg-[#121B22] px-5 py-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[12.5px] font-medium text-[#8696A0]">
              Medya ve fotoğraflar
            </p>
            <span className="text-[12px] font-semibold text-[#008069] dark:text-[#25D366] tabular-nums">
              {sharedPhotos.length}
            </span>
          </div>
          {sharedPhotos.length === 0 ? (
            <p className="text-[13px] text-[#8696A0]">Henüz paylaşılan medya yok.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {sharedPhotos.map((m) => (
                <div key={m.id} className="aspect-square rounded-lg overflow-hidden">
                  <SceneArtwork sceneId={m.sceneId!} className="w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-[#121B22] shadow-xs divide-y divide-[#f0f2f5] dark:divide-white/5">
          <button
            type="button"
            onClick={() => onToggleMute(chat.id)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f5f6f6] dark:hover:bg-[#202C33] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              {chat.isMuted ? (
                <BellOff className="w-5 h-5 text-[#8696A0]" />
              ) : (
                <Bell className="w-5 h-5 text-[#8696A0]" />
              )}
              <span className="text-[14.5px] text-[#111B21] dark:text-[#E9EDEF]">
                Bildirimleri sessize al
              </span>
            </div>
            <span
              className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                chat.isMuted ? 'bg-[#25D366] justify-end' : 'bg-[#8696A0]/40 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onTogglePin(chat.id)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#f5f6f6] dark:hover:bg-[#202C33] cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <Pin className="w-5 h-5 text-[#8696A0]" />
              <span className="text-[14.5px] text-[#111B21] dark:text-[#E9EDEF]">
                Sohbeti başa sabitle
              </span>
            </div>
            <span
              className={`w-10 h-5 rounded-full transition-colors p-0.5 flex items-center ${
                chat.isPinned ? 'bg-[#25D366] justify-end' : 'bg-[#8696A0]/40 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </span>
          </button>

          <button
            type="button"
            onClick={() => onClearChat(chat.id)}
            className="w-full px-5 py-3.5 flex items-center gap-3.5 text-left text-[#ba1a1a] dark:text-[#f87171] hover:bg-[#ffdad6]/30 dark:hover:bg-red-950/30 cursor-pointer"
          >
            <Trash2 className="w-5 h-5" />
            <span className="text-[14.5px] font-medium">Sohbet geçmişini temizle</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
