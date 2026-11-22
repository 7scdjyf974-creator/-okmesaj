import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Camera,
  FileText,
  Link2,
  MapPin,
  MessageSquarePlus,
  Mic,
  Moon,
  MoreVertical,
  Pencil,
  Phone,
  PhoneCall,
  Pin,
  Plus,
  Search,
  Settings,
  Star,
  Sun,
  UserPlus,
  Users,
  Video,
  VolumeX,
  X,
} from 'lucide-react';
import {
  ActiveTab,
  CallMediaType,
  CallRecord,
  ChatFilter,
  ChatThread,
  Contact,
  ContactStatus,
  StatusSegment,
} from '../types/messaging';
import { Avatar } from './Avatar';
import { ReceiptIcon } from './ReceiptIcon';

interface ChatListPaneProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  chats: ChatThread[];
  contacts: Contact[];
  myProfile: Contact;
  myStatuses: StatusSegment[];
  statuses: ContactStatus[];
  calls: CallRecord[];
  activeChatId: string | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onSelectChat: (chatId: string) => void;
  onOpenNewChat: () => void;
  onOpenAddContact: () => void;
  onOpenNewGroup: () => void;
  onOpenStarred: () => void;
  onOpenSettings: () => void;
  onOpenStatusViewer: (contactId: string) => void;
  onOpenStatusComposer: (mode: 'text' | 'scene') => void;
  onStartCall: (contactId: string, mediaType: CallMediaType) => void;
  onShowToast: (msg: string) => void;
}

function formatVoiceLabel(sec?: number): string {
  const s = sec ?? 0;
  return `Sesli mesaj (${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')})`;
}

export const ChatListPane: React.FC<ChatListPaneProps> = ({
  activeTab,
  onTabChange,
  chats,
  contacts,
  myProfile,
  myStatuses,
  statuses,
  calls,
  activeChatId,
  isDark,
  onToggleTheme,
  onSelectChat,
  onOpenNewChat,
  onOpenAddContact,
  onOpenNewGroup,
  onOpenStarred,
  onOpenSettings,
  onOpenStatusViewer,
  onOpenStatusComposer,
  onStartCall,
  onShowToast,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatFilter, setChatFilter] = useState<ChatFilter>('all');
  const [menuOpen, setMenuOpen] = useState(false);

  const contactMap = new Map(contacts.map((c) => [c.id, c]));

  const totalUnreadChats = chats.filter((c) => c.unreadCount > 0).length;
  const hasUnviewedStatus = statuses.some((s) => s.segments.some((seg) => !seg.viewed));

  // Sort chats: pinned first, then keep natural recent order
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return 0;
  });

  const filteredChats = sortedChats.filter((chat) => {
    const contact = contactMap.get(chat.contactId);
    if (!contact) return false;
    if (chatFilter === 'unread' && chat.unreadCount === 0) return false;
    if (chatFilter === 'groups' && !contact.isGroup) return false;
    if (chatFilter === 'pinned' && !chat.isPinned) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLocaleLowerCase('tr-TR');
      const nameMatch = contact.name.toLocaleLowerCase('tr-TR').includes(q);
      const msgMatch = chat.messages.some((m) =>
        (m.text || m.photoCaption || m.fileName || '').toLocaleLowerCase('tr-TR').includes(q)
      );
      return nameMatch || msgMatch;
    }
    return true;
  });

  const unviewedStatuses = statuses.filter((s) => s.segments.some((seg) => !seg.viewed));
  const viewedStatuses = statuses.filter((s) => s.segments.every((seg) => seg.viewed));

  const filteredCalls = calls.filter((call) => {
    if (!searchQuery.trim()) return true;
    const contact = contactMap.get(call.contactId);
    return contact?.name.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'));
  });

  return (
    <div className="relative flex flex-col h-full bg-white dark:bg-[#121B22] select-none">
      {/* Top App Bar */}
      <header className="bg-[#008069] dark:bg-[#1F2C34] text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:shadow-none dark:border-b dark:border-[rgba(134,150,160,0.15)] z-20 shrink-0">
        {!searchOpen ? (
          <div className="flex items-center justify-between h-14 px-4">
            <h1 className="text-[20px] font-semibold tracking-tight text-white dark:text-[#E9EDEF] whitespace-nowrap shrink-0">
              İleti
            </h1>

            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={onOpenAddContact}
                aria-label="Kişi ekle"
                title="Yeni kişi ekle"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
              >
                <UserPlus className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onOpenStatusComposer('scene')}
                aria-label="Hızlı durum fotoğrafı"
                title="Durum ekle"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
              >
                <Camera className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Ara"
                title="Ara"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={isDark ? 'Açık temaya geç' : 'Karanlık temaya geç'}
                title={isDark ? 'Açık tema' : 'Karanlık tema'}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Diğer seçenekler"
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/15 transition-colors cursor-pointer"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>

                {menuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 w-52 rounded-xl bg-white dark:bg-[#233138] text-[#111B21] dark:text-[#E9EDEF] shadow-[0_4px_16px_rgba(11,20,26,0.22)] py-1.5 z-40 border border-black/5 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenAddContact();
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14.5px] flex items-center gap-3 hover:bg-[#F0F2F5] dark:hover:bg-white/5 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4 text-[#8696A0]" />
                        <span>Yeni kişi ekle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenNewGroup();
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14.5px] flex items-center gap-3 hover:bg-[#F0F2F5] dark:hover:bg-white/5 cursor-pointer"
                      >
                        <Users className="w-4 h-4 text-[#8696A0]" />
                        <span>Yeni grup</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenStarred();
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14.5px] flex items-center gap-3 hover:bg-[#F0F2F5] dark:hover:bg-white/5 cursor-pointer"
                      >
                        <Star className="w-4 h-4 text-[#8696A0]" />
                        <span>Yıldızlı mesajlar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenSettings();
                        }}
                        className="w-full px-4 py-2.5 text-left text-[14.5px] flex items-center gap-3 hover:bg-[#F0F2F5] dark:hover:bg-white/5 cursor-pointer"
                      >
                        <Settings className="w-4 h-4 text-[#8696A0]" />
                        <span>Ayarlar</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 h-14 px-2">
            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }}
              aria-label="Aramayı kapat"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sohbet, kişi veya mesaj ara..."
              className="flex-1 bg-white/15 dark:bg-[#2A3942] text-white placeholder:text-white/70 dark:placeholder:text-[#8696A0] rounded-full px-4 py-2 text-[14.5px] focus:outline-none"
            />
          </div>
        )}

        {/* Primary 3-Tab Navigation Bar */}
        <nav
          aria-label="Ana sekmeler"
          className="grid grid-cols-3 text-center"
        >
          <button
            type="button"
            onClick={() => onTabChange('chats')}
            className={`relative min-h-[44px] flex items-center justify-center gap-1.5 text-[12px] font-semibold tracking-[0.4px] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'chats'
                ? 'text-white dark:text-[#25D366]'
                : 'text-white/75 dark:text-[#8696A0] hover:text-white'
            }`}
          >
            <span>Sohbetler</span>
            {totalUnreadChats > 0 && (
              <span
                className={`min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-bold tabular-nums flex items-center justify-center ${
                  activeTab === 'chats'
                    ? 'bg-white text-[#008069] dark:bg-[#25D366] dark:text-[#0B141A]'
                    : 'bg-white/75 text-[#008069] dark:bg-[#8696A0] dark:text-[#121B22]'
                }`}
              >
                {totalUnreadChats}
              </span>
            )}
            {activeTab === 'chats' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white dark:bg-[#25D366] rounded-t-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('status')}
            className={`relative min-h-[44px] flex items-center justify-center gap-1.5 text-[12px] font-semibold tracking-[0.4px] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'text-white dark:text-[#25D366]'
                : 'text-white/75 dark:text-[#8696A0] hover:text-white'
            }`}
          >
            <span>Durum</span>
            {hasUnviewedStatus && (
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  activeTab === 'status'
                    ? 'bg-white dark:bg-[#25D366]'
                    : 'bg-white/80 dark:bg-[#25D366]'
                }`}
                aria-label="Yeni durum"
              />
            )}
            {activeTab === 'status' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white dark:bg-[#25D366] rounded-t-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange('calls')}
            className={`relative min-h-[44px] flex items-center justify-center gap-1.5 text-[12px] font-semibold tracking-[0.4px] uppercase whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              activeTab === 'calls'
                ? 'text-white dark:text-[#25D366]'
                : 'text-white/75 dark:text-[#8696A0] hover:text-white'
            }`}
          >
            <span>Aramalar</span>
            {activeTab === 'calls' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white dark:bg-[#25D366] rounded-t-full" />
            )}
          </button>
        </nav>
      </header>

      {/* Main Scrollable List Area */}
      <div className="flex-1 overflow-y-auto msg-scroll pb-24">
        {activeTab === 'chats' && (
          <div>
            {/* Filter Controls */}
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-[#e9edef] dark:border-white/5 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'all', label: 'Tümü' },
                  { id: 'unread', label: 'Okunmamış' },
                  { id: 'groups', label: 'Gruplar' },
                  { id: 'pinned', label: 'Sabitlenenler' },
                ] as { id: ChatFilter; label: string }[]
              ).map((f) => {
                const isActive = chatFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setChatFilter(f.id)}
                    className={`px-3 py-1.5 rounded-full text-[12.5px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#D9FDD3] text-[#006552] dark:bg-[#005C4B] dark:text-[#92f5d9]'
                        : 'bg-[#f0f2f5] text-[#54656F] hover:bg-[#e4e8ec] dark:bg-[#202C33] dark:text-[#8696A0] dark:hover:bg-[#2A3942]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            {filteredChats.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[15px] font-medium text-[#111B21] dark:text-[#E9EDEF]">
                  Eşleşen sohbet bulunamadı
                </p>
                <p className="text-[13px] text-[#8696A0] mt-1">
                  Filtreyi temizleyebilir veya yeni bir sohbet başlatabilirsiniz.
                </p>
                {chatFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setChatFilter('all')}
                    className="mt-4 px-4 py-2 rounded-full bg-[#008069] text-white text-[13px] font-medium cursor-pointer"
                  >
                    Tümünü Göster
                  </button>
                )}
              </div>
            ) : (
              <div>
                {filteredChats.map((chat) => {
                  const contact = contactMap.get(chat.contactId);
                  if (!contact) return null;
                  const lastMsg = chat.messages[chat.messages.length - 1];
                  const isSelected = activeChatId === chat.id;
                  const hasUnread = chat.unreadCount > 0;

                  return (
                    <button
                      key={chat.id}
                      type="button"
                      onClick={() => onSelectChat(chat.id)}
                      className={`w-full h-[72px] px-4 flex items-center gap-3 text-left transition-colors cursor-pointer border-b border-[#f0f2f5] dark:border-white/[0.04] ${
                        isSelected
                          ? 'bg-[#e8f6ff] dark:bg-[#2A3942]'
                          : 'hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]/70'
                      }`}
                    >
                      <Avatar
                        contact={contact}
                        size={50}
                        showOnlinePip={true}
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[16px] font-semibold text-[#111B21] dark:text-[#E9EDEF] truncate">
                            {contact.name}
                          </span>
                          <span
                            className={`text-[11px] tabular-nums whitespace-nowrap shrink-0 ${
                              hasUnread
                                ? 'text-[#25D366] font-semibold'
                                : 'text-[#8696A0]'
                            }`}
                          >
                            {lastMsg?.timestamp ?? ''}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1 min-w-0 text-[13px] text-[#667781] dark:text-[#8696A0]">
                            {chat.isTyping ? (
                              <span className="text-[#25D366] font-medium truncate">
                                {chat.typingLabel || 'yazıyor...'}
                              </span>
                            ) : lastMsg ? (
                              <>
                                {lastMsg.senderId === 'me' && (
                                  <ReceiptIcon status={lastMsg.status} />
                                )}
                                {contact.isGroup && lastMsg.senderName && lastMsg.senderId !== 'me' && (
                                  <span className="font-medium text-[#3e4945] dark:text-[#aebac1] shrink-0">
                                    {lastMsg.senderName.split(' ')[0]}:
                                  </span>
                                )}
                                {lastMsg.kind === 'voice' && (
                                  <Mic className="w-3.5 h-3.5 text-[#53BDEB] shrink-0" />
                                )}
                                {lastMsg.kind === 'photo' && (
                                  <Camera className="w-3.5 h-3.5 text-[#8696A0] shrink-0" />
                                )}
                                {lastMsg.kind === 'document' && (
                                  <FileText className="w-3.5 h-3.5 text-[#8696A0] shrink-0" />
                                )}
                                {lastMsg.kind === 'location' && (
                                  <MapPin className="w-3.5 h-3.5 text-[#8696A0] shrink-0" />
                                )}
                                <span className="truncate">
                                  {lastMsg.kind === 'voice'
                                    ? formatVoiceLabel(lastMsg.voiceDurationSec)
                                    : lastMsg.kind === 'photo'
                                    ? lastMsg.photoCaption || 'Fotoğraf'
                                    : lastMsg.kind === 'document'
                                    ? lastMsg.fileName || 'Belge'
                                    : lastMsg.kind === 'location'
                                    ? lastMsg.locationTitle || 'Konum'
                                    : lastMsg.text}
                                </span>
                              </>
                            ) : (
                              <span className="italic">Henüz mesaj yok</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {chat.isMuted && (
                              <VolumeX className="w-3.5 h-3.5 text-[#8696A0]" aria-label="Sessize alındı" />
                            )}
                            {chat.isPinned && (
                              <Pin className="w-3.5 h-3.5 text-[#8696A0] rotate-45" aria-label="Sabitlendi" />
                            )}
                            {hasUnread && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#25D366] text-white text-[12px] font-bold leading-none tabular-nums flex items-center justify-center">
                                {chat.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'status' && (
          <div>
            {/* My Status Row */}
            <button
              type="button"
              onClick={() =>
                myStatuses.length > 0
                  ? onOpenStatusViewer('me')
                  : onOpenStatusComposer('scene')
              }
              className="w-full h-[76px] px-4 flex items-center gap-3 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]/70 transition-colors cursor-pointer"
            >
              <div className="relative">
                <Avatar
                  contact={myProfile}
                  size={50}
                  statusSegments={myStatuses.length > 0 ? myStatuses : undefined}
                />
                {myStatuses.length === 0 && (
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#25D366] text-white ring-2 ring-white dark:ring-[#121B22] flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" strokeWidth={2.8} />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold text-[#111B21] dark:text-[#E9EDEF]">
                  Durumum
                </p>
                <p className="text-[13px] text-[#8696A0] truncate">
                  {myStatuses.length > 0
                    ? `${myStatuses.length} güncelleme · ${myStatuses[myStatuses.length - 1].timeAgo}`
                    : 'Durum güncellemesi eklemek için dokunun'}
                </p>
              </div>
            </button>

            {unviewedStatuses.length > 0 && (
              <div>
                <div className="px-4 py-2 text-[12px] font-semibold text-[#008069] dark:text-[#8696A0] tracking-wide">
                  Son güncellemeler
                </div>
                {unviewedStatuses.map((st) => {
                  const contact = contactMap.get(st.contactId);
                  if (!contact) return null;
                  const latest = st.segments[st.segments.length - 1];
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onOpenStatusViewer(st.contactId)}
                      className="w-full h-[72px] px-4 flex items-center gap-3 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]/70 transition-colors cursor-pointer"
                    >
                      <Avatar
                        contact={contact}
                        size={48}
                        statusSegments={st.segments}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-[#111B21] dark:text-[#E9EDEF] truncate">
                          {contact.name}
                        </p>
                        <p className="text-[13px] text-[#8696A0] truncate">
                          {latest.timeAgo}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {viewedStatuses.length > 0 && (
              <div>
                <div className="px-4 py-2 text-[12px] font-semibold text-[#667781] dark:text-[#8696A0] tracking-wide">
                  Görülen güncellemeler
                </div>
                {viewedStatuses.map((st) => {
                  const contact = contactMap.get(st.contactId);
                  if (!contact) return null;
                  const latest = st.segments[st.segments.length - 1];
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => onOpenStatusViewer(st.contactId)}
                      className="w-full h-[72px] px-4 flex items-center gap-3 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]/70 transition-colors cursor-pointer"
                    >
                      <Avatar
                        contact={contact}
                        size={48}
                        statusSegments={st.segments}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-[#111B21] dark:text-[#E9EDEF] truncate">
                          {contact.name}
                        </p>
                        <p className="text-[13px] text-[#8696A0] truncate">
                          {latest.timeAgo}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calls' && (
          <div>
            {/* Create Call Link */}
            <button
              type="button"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText('https://ileti.app/arama/tr-8429').catch(() => {});
                }
                onShowToast('Arama bağlantısı panoya kopyalandı');
              }}
              className="w-full h-[72px] px-4 flex items-center gap-3 text-left hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]/70 transition-colors cursor-pointer border-b border-[#f0f2f5] dark:border-white/[0.04]"
            >
              <div className="w-[50px] h-[50px] rounded-full bg-[#008069] dark:bg-[#00A884] text-white flex items-center justify-center shrink-0">
                <Link2 className="w-5 h-5 -rotate-45" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-semibold text-[#111B21] dark:text-[#E9EDEF]">
                  Arama bağlantısı oluştur
                </p>
                <p className="text-[13px] text-[#8696A0] truncate">
                  İleti aramanız için bir bağlantı paylaşın
                </p>
              </div>
            </button>

            <div className="px-4 py-2 text-[12px] font-semibold text-[#667781] dark:text-[#8696A0] tracking-wide">
              En son
            </div>

            {filteredCalls.map((call) => {
              const contact = contactMap.get(call.contactId);
              if (!contact) return null;
              const isMissed = call.direction === 'missed';

              return (
                <div
                  key={call.id}
                  className="h-[72px] px-4 flex items-center gap-3 hover:bg-[#f5f6f6] dark:hover:bg-[#202C33]/70 transition-colors"
                >
                  <Avatar contact={contact} size={50} />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-[16px] font-semibold truncate ${
                        isMissed
                          ? 'text-[#ba1a1a] dark:text-[#f87171]'
                          : 'text-[#111B21] dark:text-[#E9EDEF]'
                      }`}
                    >
                      {contact.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-[13px] text-[#8696A0] tabular-nums">
                      {call.direction === 'outgoing' ? (
                        <ArrowUpRight className="w-4 h-4 text-[#25D366] shrink-0" />
                      ) : (
                        <ArrowDownLeft
                          className={`w-4 h-4 shrink-0 ${
                            isMissed ? 'text-[#ba1a1a] dark:text-[#f87171]' : 'text-[#25D366]'
                          }`}
                        />
                      )}
                      <span className="truncate">
                        {call.timestamp}
                        {call.durationLabel ? ` · ${call.durationLabel}` : isMissed ? ' · Cevapsız' : ''}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartCall(contact.id, call.mediaType)}
                    aria-label={`${contact.name} kişisini ${call.mediaType === 'video' ? 'görüntülü' : 'sesli'} ara`}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-[#008069] dark:text-[#25D366] hover:bg-[#008069]/10 dark:hover:bg-[#25D366]/10 transition-colors cursor-pointer"
                  >
                    {call.mediaType === 'video' ? (
                      <Video className="w-5 h-5" />
                    ) : (
                      <Phone className="w-5 h-5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Buttons (FAB) */}
      <div className="absolute bottom-5 right-5 flex flex-col items-center gap-3 z-20">
        {activeTab === 'status' && (
          <button
            type="button"
            onClick={() => onOpenStatusComposer('text')}
            aria-label="Metin durumu yaz"
            title="Metin durumu"
            className="w-11 h-11 rounded-full bg-[#e0f0fb] dark:bg-[#2A3942] text-[#0e1d25] dark:text-[#E9EDEF] shadow-[0_3px_8px_rgba(0,0,0,0.2)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            <Pencil className="w-5 h-5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (activeTab === 'chats') onOpenNewChat();
            else if (activeTab === 'status') onOpenStatusComposer('scene');
            else onOpenNewChat();
          }}
          aria-label={
            activeTab === 'chats'
              ? 'Yeni sohbet'
              : activeTab === 'status'
              ? 'Fotoğraf durumu ekle'
              : 'Yeni arama'
          }
          className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_4px_10px_rgba(0,0,0,0.28)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          {activeTab === 'chats' && <MessageSquarePlus className="w-6 h-6" />}
          {activeTab === 'status' && <Camera className="w-6 h-6" />}
          {activeTab === 'calls' && <PhoneCall className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
