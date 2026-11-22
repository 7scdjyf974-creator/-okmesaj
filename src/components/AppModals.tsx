import React, { useState } from 'react';
import {
  Check,
  LogOut,
  Moon,
  Phone,
  Star,
  Sun,
  UserPlus,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  CallMediaType,
  ChatThread,
  Contact,
  SceneId,
  StatusSegment,
} from '../types/messaging';
import { QUICK_SCENES } from '../data/mockMessagingData';
import { Avatar } from './Avatar';
import { SceneArtwork } from './SceneArtwork';

/* 1. New Chat / New Call Modal */
interface NewChatModalProps {
  open: boolean;
  contacts: Contact[];
  onClose: () => void;
  onSelectContactChat: (contactId: string) => void;
  onStartCall: (contactId: string, mediaType: CallMediaType) => void;
  onOpenNewGroup: () => void;
  onOpenAddContact: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  open,
  contacts,
  onClose,
  onSelectContactChat,
  onStartCall,
  onOpenNewGroup,
  onOpenAddContact,
}) => {
  const [query, setQuery] = useState('');
  if (!open) return null;

  const people = contacts.filter(
    (c) => !c.isGroup && c.name.toLocaleLowerCase('tr-TR').includes(query.toLocaleLowerCase('tr-TR'))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[85vh] rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl flex flex-col overflow-hidden">
        <div className="h-14 px-4 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-[17px] font-semibold">Kişi seç</h3>
            <p className="text-[12px] text-white/80 tabular-nums">{people.length} kişi</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 border-b border-[#e9edef] dark:border-white/10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="İsim veya numara ara..."
            className="w-full px-4 py-2 rounded-full bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto msg-scroll">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAddContact();
            }}
            className="w-full h-[68px] px-4 flex items-center gap-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202C33] cursor-pointer border-b border-[#f0f2f5] dark:border-white/5"
          >
            <div className="w-11 h-11 rounded-full bg-[#008069] dark:bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-[15.5px] font-semibold">Yeni kişi ekle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenNewGroup();
            }}
            className="w-full h-[68px] px-4 flex items-center gap-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202C33] cursor-pointer border-b border-[#f0f2f5] dark:border-white/5"
          >
            <div className="w-11 h-11 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[15.5px] font-semibold">Yeni grup oluştur</span>
          </button>

          {people.map((person) => (
            <div
              key={person.id}
              className="h-[68px] px-4 flex items-center gap-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]"
            >
              <button
                type="button"
                onClick={() => {
                  onSelectContactChat(person.id);
                  onClose();
                }}
                className="flex-1 min-w-0 flex items-center gap-3 text-left cursor-pointer"
              >
                <Avatar contact={person} size={44} showOnlinePip={true} />
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-semibold truncate">{person.name}</p>
                  <p className="text-[12.5px] text-[#8696A0] truncate">{person.about}</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStartCall(person.id, 'voice');
                  onClose();
                }}
                aria-label={`${person.name} sesli ara`}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#008069] dark:text-[#25D366] hover:bg-[#008069]/10 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onStartCall(person.id, 'video');
                  onClose();
                }}
                aria-label={`${person.name} görüntülü ara`}
                className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-[#008069] dark:text-[#25D366] hover:bg-[#008069]/10 cursor-pointer"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 2. Create New Group Modal */
interface NewGroupModalProps {
  open: boolean;
  contacts: Contact[];
  onClose: () => void;
  onCreateGroup: (groupName: string, memberIds: string[]) => void;
}

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  open,
  contacts,
  onClose,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  if (!open) return null;

  const people = contacts.filter((c) => !c.isGroup);

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedIds.length === 0) return;
    onCreateGroup(groupName.trim(), selectedIds);
    setGroupName('');
    setSelectedIds([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md max-h-[85vh] rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl flex flex-col overflow-hidden"
      >
        <div className="h-14 px-4 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between shrink-0">
          <h3 className="text-[17px] font-semibold">Yeni grup</h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#e9edef] dark:border-white/10 space-y-2">
          <label className="block text-[12px] font-medium text-[#8696A0]">
            Grup konusu
          </label>
          <input
            type="text"
            required
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Örn: Hafta Sonu Planı"
            className="w-full px-4 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
          />
          <p className="text-[12px] text-[#8696A0] tabular-nums">
            Seçilen katılımcılar: {selectedIds.length}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto msg-scroll">
          {people.map((person) => {
            const checked = selectedIds.includes(person.id);
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => toggleMember(person.id)}
                className="w-full h-[64px] px-4 flex items-center gap-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202C33] text-left cursor-pointer"
              >
                <Avatar contact={person} size={42} />
                <span className="flex-1 text-[15px] font-medium truncate">
                  {person.name}
                </span>
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    checked
                      ? 'bg-[#25D366] border-[#25D366] text-white'
                      : 'border-[#8696A0]'
                  }`}
                >
                  {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-[#e9edef] dark:border-white/10 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-[14px] text-[#8696A0] cursor-pointer"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={!groupName.trim() || selectedIds.length === 0}
            className="px-5 py-2 rounded-full bg-[#25D366] disabled:opacity-40 text-white text-[14px] font-semibold cursor-pointer"
          >
            Grubu Oluştur
          </button>
        </div>
      </form>
    </div>
  );
};

/* 3. Status Composer Modal */
interface StatusComposerModalProps {
  open: boolean;
  initialMode: 'text' | 'scene';
  onClose: () => void;
  onPublishStatus: (segment: Omit<StatusSegment, 'id' | 'timeAgo' | 'viewed'>) => void;
}

const STATUS_BG_COLORS = ['#006552', '#00607e', '#6b21a8', '#9f1239', '#b45309'];

export const StatusComposerModal: React.FC<StatusComposerModalProps> = ({
  open,
  initialMode,
  onClose,
  onPublishStatus,
}) => {
  const [mode, setMode] = useState<'text' | 'scene'>(initialMode);
  const [text, setText] = useState('');
  const [bgColor, setBgColor] = useState(STATUS_BG_COLORS[0]);
  const [sceneId, setSceneId] = useState<SceneId>('bosphorus');
  const [caption, setCaption] = useState('');

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode, open]);

  if (!open) return null;

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'text') {
      if (!text.trim()) return;
      onPublishStatus({ type: 'text', text: text.trim(), bgColor });
      setText('');
    } else {
      onPublishStatus({ type: 'scene', sceneId, caption: caption.trim() });
      setCaption('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handlePublish}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e9edef] dark:border-white/10">
          <h3 className="text-[16px] font-semibold">Durum Güncellemesi Paylaş</h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Mode Switch */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942]">
            <button
              type="button"
              onClick={() => setMode('scene')}
              className={`py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${
                mode === 'scene'
                  ? 'bg-white dark:bg-[#1F2C34] text-[#008069] dark:text-[#25D366] shadow-xs'
                  : 'text-[#667781] dark:text-[#8696A0]'
              }`}
            >
              Fotoğraf
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`py-2 rounded-lg text-[13px] font-medium cursor-pointer transition-colors ${
                mode === 'text'
                  ? 'bg-white dark:bg-[#1F2C34] text-[#008069] dark:text-[#25D366] shadow-xs'
                  : 'text-[#667781] dark:text-[#8696A0]'
              }`}
            >
              Metin
            </button>
          </div>

          {mode === 'text' ? (
            <>
              <div
                className="h-52 rounded-2xl p-6 flex items-center justify-center transition-colors"
                style={{ backgroundColor: bgColor }}
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Bir durum yazın..."
                  rows={3}
                  className="w-full bg-transparent text-white placeholder:text-white/65 text-center text-[20px] font-semibold resize-none focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-center gap-2.5">
                {STATUS_BG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setBgColor(c)}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${
                      bgColor === c ? 'ring-2 ring-offset-2 ring-[#25D366] scale-110' : ''
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label="Arka plan rengi"
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="rounded-xl overflow-hidden">
                <SceneArtwork sceneId={sceneId} className="w-full h-44" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {QUICK_SCENES.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSceneId(sc.id)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap shrink-0 cursor-pointer ${
                      sceneId === sc.id
                        ? 'bg-[#008069] text-white'
                        : 'bg-[#f0f2f5] dark:bg-[#2A3942] text-[#667781] dark:text-[#aebac1]'
                    }`}
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Durum açıklaması..."
                className="w-full px-4 py-2.5 rounded-full bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
              />
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[14px] text-[#8696A0] cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={mode === 'text' && !text.trim()}
              className="px-5 py-2 rounded-full bg-[#25D366] disabled:opacity-40 text-white text-[14px] font-semibold cursor-pointer"
            >
              Paylaş
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* 4. Starred Messages Modal */
interface StarredModalProps {
  open: boolean;
  chats: ChatThread[];
  contacts: Contact[];
  onClose: () => void;
  onJumpToChat: (chatId: string) => void;
}

export const StarredMessagesModal: React.FC<StarredModalProps> = ({
  open,
  chats,
  contacts,
  onClose,
  onJumpToChat,
}) => {
  if (!open) return null;
  const contactMap = new Map(contacts.map((c) => [c.id, c]));
  const starred = chats.flatMap((chat) =>
    chat.messages
      .filter((m) => m.starred)
      .map((m) => ({
        chatId: chat.id,
        contact: contactMap.get(chat.contactId),
        message: m,
      }))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-[80vh] rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl flex flex-col overflow-hidden">
        <div className="h-14 px-4 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between shrink-0">
          <h3 className="text-[17px] font-semibold">Yıldızlı mesajlar</h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto msg-scroll p-4 space-y-3">
          {starred.length === 0 ? (
            <div className="py-12 text-center">
              <Star className="w-10 h-10 text-[#8696A0] mx-auto mb-3 opacity-60" />
              <p className="text-[15px] font-medium">Henüz yıldızlı mesaj yok</p>
              <p className="text-[13px] text-[#8696A0] mt-1">
                Önemli mesajlara dokunup yıldız simgesini seçerek burada saklayabilirsiniz.
              </p>
            </div>
          ) : (
            starred.map(({ chatId, contact, message }) => (
              <button
                key={message.id}
                type="button"
                onClick={() => {
                  onJumpToChat(chatId);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-[#f0f2f5] dark:bg-[#202C33] hover:bg-[#e8f6ff] dark:hover:bg-[#2A3942] transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[12px] text-[#008069] dark:text-[#25D366] font-semibold mb-1">
                  <span>{contact?.name}</span>
                  <span className="text-[#8696A0] font-normal tabular-nums">{message.timestamp}</span>
                </div>
                <p className="text-[14px] line-clamp-2">
                  {message.text || message.photoCaption || message.fileName || 'Sesli mesaj'}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* 5. Settings Modal */
interface SettingsModalProps {
  open: boolean;
  myProfile: Contact;
  isDark: boolean;
  onToggleTheme: () => void;
  onUpdateProfile: (name: string, about: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  myProfile,
  isDark,
  onToggleTheme,
  onUpdateProfile,
  onLogout,
  onClose,
}) => {
  const [name, setName] = useState(myProfile.name);
  const [about, setAbout] = useState(myProfile.about);

  if (!open) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onUpdateProfile(name.trim(), about.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSave}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl overflow-hidden"
      >
        <div className="h-14 px-4 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between">
          <h3 className="text-[17px] font-semibold">Ayarlar</h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4">
            <Avatar contact={myProfile} size={64} />
            <div>
              <p className="text-[16px] font-semibold">{myProfile.name}</p>
              <p className="text-[13px] text-[#8696A0] tabular-nums">{myProfile.phone}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#8696A0]">Adınız</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#8696A0]">Hakkında</label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full px-4 py-3 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-[#25D366]" /> : <Sun className="w-5 h-5 text-[#008069]" />}
              <span className="text-[14.5px] font-medium">
                Görünüm: {isDark ? 'Karanlık Mod' : 'Açık Mod'}
              </span>
            </div>
            <span className="text-[12.5px] font-semibold text-[#008069] dark:text-[#25D366]">
              Değiştir
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full px-4 py-3 rounded-xl bg-[#ffdad6]/50 dark:bg-red-950/30 text-[#ba1a1a] dark:text-[#f87171] flex items-center gap-3 cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[14.5px] font-medium">Numarayı değiştir / Çıkış yap</span>
          </button>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[14px] text-[#8696A0] cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#008069] dark:bg-[#25D366] text-white text-[14px] font-semibold cursor-pointer"
            >
              Kaydet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* 6. Add Contact Modal */
interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onAddContact: (data: {
    name: string;
    phone: string;
    about: string;
    avatarVariant: Contact['avatarVariant'];
    avatarBg: string;
    avatarAccent: string;
  }) => void;
}

const AVATAR_PRESETS: {
  variant: Contact['avatarVariant'];
  bg: string;
  accent: string;
  label: string;
}[] = [
  { variant: 'woman-1', bg: '#ffe8d6', accent: '#006552', label: 'Kadın 1' },
  { variant: 'man-1', bg: '#d8fff1', accent: '#006552', label: 'Erkek 1' },
  { variant: 'woman-2', bg: '#fce7f3', accent: '#9d174d', label: 'Kadın 2' },
  { variant: 'man-2', bg: '#e0f0fb', accent: '#00607e', label: 'Erkek 2' },
  { variant: 'woman-3', bg: '#ede9fe', accent: '#5b21b6', label: 'Kadın 3' },
  { variant: 'man-3', bg: '#e2e8f0', accent: '#334155', label: 'Erkek 3' },
];

export const AddContactModal: React.FC<AddContactModalProps> = ({
  open,
  onClose,
  onAddContact,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+90 5');
  const [about, setAbout] = useState('Merhaba! İleti kullanıyorum.');
  const [presetIdx, setPresetIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const selectedPreset = AVATAR_PRESETS[presetIdx];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Lütfen kişi adını girin.');
      return;
    }
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin.');
      return;
    }
    onAddContact({
      name: name.trim(),
      phone: phone.trim(),
      about: about.trim() || 'Merhaba! İleti kullanıyorum.',
      avatarVariant: selectedPreset.variant,
      avatarBg: selectedPreset.bg,
      avatarAccent: selectedPreset.accent,
    });
    setName('');
    setPhone('+90 5');
    setAbout('Merhaba! İleti kullanıyorum.');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1F2C34] text-[#111B21] dark:text-[#E9EDEF] shadow-xl overflow-hidden"
      >
        <div className="h-14 px-4 bg-[#008069] dark:bg-[#202C33] text-white flex items-center justify-between">
          <h3 className="text-[17px] font-semibold">Yeni kişi ekle</h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Avatar Preset Picker */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {AVATAR_PRESETS.map((preset, idx) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setPresetIdx(idx)}
                className={`p-1 rounded-full transition-transform cursor-pointer shrink-0 ${
                  presetIdx === idx
                    ? 'ring-2 ring-[#25D366] scale-105'
                    : 'opacity-70 hover:opacity-100'
                }`}
                aria-label={preset.label}
              >
                <Avatar
                  contact={{
                    name: name || 'Yeni Kişi',
                    avatarBg: preset.bg,
                    avatarAccent: preset.accent,
                    avatarVariant: preset.variant,
                  }}
                  size={44}
                />
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#8696A0]">Ad Soyad</label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="Örn: Canan Aksoy"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#8696A0]">Telefon Numarası</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError(null);
              }}
              placeholder="+90 532 000 00 00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] tabular-nums focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#8696A0]">Hakkında (İsteğe bağlı)</label>
            <input
              type="text"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Durum notu..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f0f2f5] dark:bg-[#2A3942] text-[14.5px] focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-[12.5px] text-[#ba1a1a] dark:text-[#f87171]">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-[14px] text-[#8696A0] cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-[14px] font-semibold cursor-pointer"
            >
              Kişiyi Kaydet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
