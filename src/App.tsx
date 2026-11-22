import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActiveTab,
  CallMediaType,
  CallRecord,
  ChatThread,
  Contact,
  ContactStatus,
  Message,
  QuotedReply,
  SceneId,
  StatusSegment,
} from './types/messaging';
import {
  formatNowTime,
  generateContextualTurkishReply,
  INITIAL_CALLS,
  INITIAL_CHATS,
  INITIAL_CONTACTS,
  INITIAL_STATUSES,
  MY_PROFILE,
} from './data/mockMessagingData';
import { ChatListPane } from './components/ChatListPane';
import { ConversationPane } from './components/ConversationPane';
import { ContactInfoDrawer } from './components/ContactInfoDrawer';
import { StatusViewerModal } from './components/StatusViewerModal';
import { CallOverlayModal } from './components/CallOverlayModal';
import {
  AddContactModal,
  NewChatModal,
  NewGroupModal,
  SettingsModal,
  StarredMessagesModal,
  StatusComposerModal,
} from './components/AppModals';
import { AuthOnboardingScreen } from './components/AuthOnboardingScreen';
import {
  playMessageReceivedSound,
  playMessageSentSound,
} from './utils/soundEngine';

const AUTH_STORAGE_KEY = 'ileti_verified_phone';

export default function App() {
  const [verifiedPhone, setVerifiedPhone] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [myProfile, setMyProfile] = useState<Contact>(() => ({
    ...MY_PROFILE,
    phone: (() => {
      try {
        return localStorage.getItem(AUTH_STORAGE_KEY) || MY_PROFILE.phone;
      } catch {
        return MY_PROFILE.phone;
      }
    })(),
  }));
  const [chats, setChats] = useState<ChatThread[]>(INITIAL_CHATS);
  const [statuses, setStatuses] = useState<ContactStatus[]>(INITIAL_STATUSES);
  const [myStatuses, setMyStatuses] = useState<StatusSegment[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);

  // Desktop defaults to first chat selected; mobile starts on list screen
  const [activeChatId, setActiveChatId] = useState<string | null>('chat-zeynep');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(false);

  // Modals & Overlays
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newGroupOpen, setNewGroupOpen] = useState(false);
  const [starredOpen, setStarredOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [statusComposer, setStatusComposer] = useState<{ open: boolean; mode: 'text' | 'scene' }>({
    open: false,
    mode: 'scene',
  });
  const [statusViewerContactId, setStatusViewerContactId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{
    contactId: string;
    mediaType: CallMediaType;
  } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    const id = window.setTimeout(() => {
      setToastMsg((curr) => (curr === msg ? null : curr));
    }, 2600);
    timersRef.current.push(id);
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) ?? null;
  const activeContact = activeChat
    ? contacts.find((ct) => ct.id === activeChat.contactId) ?? null
    : null;

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setMobileShowChat(true);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSelectContactChat = (contactId: string) => {
    const existing = chats.find((c) => c.contactId === contactId);
    if (existing) {
      handleSelectChat(existing.id);
      return;
    }
    const newId = `chat-${contactId}-${Date.now()}`;
    const newThread: ChatThread = {
      id: newId,
      contactId,
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [],
    };
    setChats((prev) => [newThread, ...prev]);
    setActiveTab('chats');
    setActiveChatId(newId);
    setMobileShowChat(true);
  };

  const appendOutgoingMessage = (chatId: string, msg: Message, replyCueText: string) => {
    const targetChat = chats.find((c) => c.id === chatId);
    const targetContact = targetChat
      ? contacts.find((ct) => ct.id === targetChat.contactId)
      : null;

    playMessageSentSound();

    // 1. Append outgoing message and bring chat to top
    setChats((prev) => {
      const updated = prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: [...c.messages, msg], unreadCount: 0 }
          : c
      );
      const current = updated.find((c) => c.id === chatId);
      const others = updated.filter((c) => c.id !== chatId);
      return current ? [current, ...others] : updated;
    });

    // 2. Delivery receipt progression: sending -> sent -> delivered -> read
    const t1 = window.setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === msg.id ? { ...m, status: 'sent' } : m
                ),
              }
            : c
        )
      );
    }, 300);

    const t2 = window.setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === msg.id ? { ...m, status: 'delivered' } : m
                ),
              }
            : c
        )
      );
    }, 750);

    const t3 = window.setTimeout(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                isTyping: true,
                typingLabel: targetContact?.isGroup ? 'yazıyor...' : 'yazıyor...',
                messages: c.messages.map((m) =>
                  m.id === msg.id ? { ...m, status: 'read' } : m
                ),
              }
            : c
        )
      );
    }, 1250);

    // 3. Simulated Turkish reply
    const t4 = window.setTimeout(() => {
      if (!targetContact) return;
      const replySenderId = targetContact.isGroup ? 'zeynep' : targetContact.id;
      const replySenderName = targetContact.isGroup ? 'Zeynep Kaya' : targetContact.name;
      const replyMsg: Message = {
        id: `m-rep-${Date.now()}`,
        chatId,
        senderId: replySenderId,
        senderName: targetContact.isGroup ? replySenderName : undefined,
        kind: 'text',
        text: generateContextualTurkishReply(replyCueText, targetContact.name),
        timestamp: formatNowTime(),
        dateGroup: 'BUGÜN',
        status: 'read',
      };

      playMessageReceivedSound();

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                isTyping: false,
                messages: [...c.messages, replyMsg],
              }
            : c
        )
      );
    }, 2600);

    timersRef.current.push(t1, t2, t3, t4);
  };

  const handleSendText = (chatId: string, text: string, replyTo?: QuotedReply) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      chatId,
      senderId: 'me',
      kind: 'text',
      text,
      timestamp: formatNowTime(),
      dateGroup: 'BUGÜN',
      status: 'sending',
      replyTo,
    };
    appendOutgoingMessage(chatId, newMsg, text);
  };

  const handleSendVoice = (
    chatId: string,
    durationSec: number,
    waveform: number[],
    audioUrl?: string
  ) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      chatId,
      senderId: 'me',
      kind: 'voice',
      voiceDurationSec: durationSec,
      waveform,
      audioUrl,
      timestamp: formatNowTime(),
      dateGroup: 'BUGÜN',
      status: 'sending',
    };
    appendOutgoingMessage(chatId, newMsg, 'sesli mesaj');
  };

  const handleSendPhoto = (chatId: string, sceneId: SceneId, caption: string) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      chatId,
      senderId: 'me',
      kind: 'photo',
      sceneId,
      photoCaption: caption || undefined,
      timestamp: formatNowTime(),
      dateGroup: 'BUGÜN',
      status: 'sending',
    };
    appendOutgoingMessage(chatId, newMsg, caption || 'harika fotoğraf');
  };

  const handleSendDocument = (chatId: string, fileName: string, fileSize: string) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      chatId,
      senderId: 'me',
      kind: 'document',
      fileName,
      fileSize,
      filePages: '12 sayfa',
      timestamp: formatNowTime(),
      dateGroup: 'BUGÜN',
      status: 'sending',
    };
    appendOutgoingMessage(chatId, newMsg, 'belge');
  };

  const handleSendLocation = (chatId: string, title: string, address: string) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      chatId,
      senderId: 'me',
      kind: 'location',
      locationTitle: title,
      locationAddress: address,
      timestamp: formatNowTime(),
      dateGroup: 'BUGÜN',
      status: 'sending',
    };
    appendOutgoingMessage(chatId, newMsg, 'konum');
  };

  const handleReactMessage = (chatId: string, messageId: string, emoji: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c;
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId) return m;
            const existing = m.reactions ?? [];
            const found = existing.find((r) => r.emoji === emoji);
            let nextReactions = existing;
            if (found) {
              if (found.byMe) {
                nextReactions =
                  found.count <= 1
                    ? existing.filter((r) => r.emoji !== emoji)
                    : existing.map((r) =>
                        r.emoji === emoji
                          ? { ...r, count: r.count - 1, byMe: false }
                          : r
                      );
              } else {
                nextReactions = existing.map((r) =>
                  r.emoji === emoji
                    ? { ...r, count: r.count + 1, byMe: true }
                    : r
                );
              }
            } else {
              nextReactions = [...existing, { emoji, count: 1, byMe: true }];
            }
            return { ...m, reactions: nextReactions };
          }),
        };
      })
    );
  };

  const handleToggleStarMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: c.messages.map((m) =>
                m.id === messageId ? { ...m, starred: !m.starred } : m
              ),
            }
          : c
      )
    );
  };

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) }
          : c
      )
    );
    showToast('Mesaj silindi');
  };

  const handleToggleMute = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isMuted: !c.isMuted } : c))
    );
  };

  const handleTogglePin = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleClearChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: [] } : c))
    );
    setContactInfoOpen(false);
    showToast('Sohbet geçmişi temizlendi');
  };

  const handleCreateGroup = (groupName: string, memberIds: string[]) => {
    const memberNames = memberIds
      .map((id) => contacts.find((c) => c.id === id)?.name)
      .filter((n): n is string => Boolean(n));

    const newGroupId = `group-${Date.now()}`;
    const newGroup: Contact = {
      id: newGroupId,
      name: groupName,
      phone: `Grup · ${memberNames.length + 1} katılımcı`,
      about: 'Yeni oluşturulan sohbet grubu',
      avatarBg: '#d8fff1',
      avatarAccent: '#006552',
      avatarVariant: 'group-design',
      isGroup: true,
      members: [...memberNames, 'Siz'],
      onlineStatus: [...memberNames.slice(0, 3), 'Siz'].join(', '),
    };

    const newChatId = `chat-${newGroupId}`;
    const newThread: ChatThread = {
      id: newChatId,
      contactId: newGroupId,
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [
        {
          id: `m-grp-${Date.now()}`,
          chatId: newChatId,
          senderId: 'me',
          kind: 'text',
          text: `"${groupName}" grubunu oluşturdunuz.`,
          timestamp: formatNowTime(),
          dateGroup: 'BUGÜN',
          status: 'read',
        },
      ],
    };

    setContacts((prev) => [newGroup, ...prev]);
    setChats((prev) => [newThread, ...prev]);
    setActiveTab('chats');
    setActiveChatId(newChatId);
    setMobileShowChat(true);
    showToast('Grup oluşturuldu');
  };

  const handleAddContact = (data: {
    name: string;
    phone: string;
    about: string;
    avatarVariant: Contact['avatarVariant'];
    avatarBg: string;
    avatarAccent: string;
  }) => {
    const newId = `contact-${Date.now()}`;
    const newContact: Contact = {
      id: newId,
      name: data.name,
      phone: data.phone,
      about: data.about,
      avatarBg: data.avatarBg,
      avatarAccent: data.avatarAccent,
      avatarVariant: data.avatarVariant,
      isOnline: true,
      onlineStatus: 'çevrimiçi',
    };
    const newChatId = `chat-${newId}`;
    const newThread: ChatThread = {
      id: newChatId,
      contactId: newId,
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      messages: [],
    };
    setContacts((prev) => [newContact, ...prev]);
    setChats((prev) => [newThread, ...prev]);
    setActiveTab('chats');
    setActiveChatId(newChatId);
    setMobileShowChat(true);
    showToast(`${data.name} kişilere eklendi`);
  };

  const handlePublishStatus = (segment: Omit<StatusSegment, 'id' | 'timeAgo' | 'viewed'>) => {
    const newSeg: StatusSegment = {
      ...segment,
      id: `my-seg-${Date.now()}`,
      timeAgo: 'Az önce',
      viewed: false,
    };
    setMyStatuses((prev) => [...prev, newSeg]);
    setActiveTab('status');
    showToast('Durum güncellemeniz paylaşıldı');
  };

  const handleMarkStatusViewed = useCallback((contactId: string, segmentId: string) => {
    if (contactId === 'me') {
      setMyStatuses((prev) =>
        prev.map((s) => (s.id === segmentId ? { ...s, viewed: true } : s))
      );
      return;
    }
    setStatuses((prev) =>
      prev.map((st) =>
        st.contactId === contactId
          ? {
              ...st,
              segments: st.segments.map((seg) =>
                seg.id === segmentId ? { ...seg, viewed: true } : seg
              ),
            }
          : st
      )
    );
  }, []);

  const handleReplyToStatus = (contactId: string, statusPreview: string, replyText: string) => {
    let chat = chats.find((c) => c.contactId === contactId);
    let targetChatId = chat?.id;
    if (!chat) {
      targetChatId = `chat-${contactId}-${Date.now()}`;
      const newThread: ChatThread = {
        id: targetChatId,
        contactId,
        unreadCount: 0,
        isPinned: false,
        isMuted: false,
        messages: [],
      };
      setChats((prev) => [newThread, ...prev]);
    }
    if (!targetChatId) return;

    const contactName = contacts.find((c) => c.id === contactId)?.name || '';
    handleSendText(targetChatId, replyText, {
      messageId: 'status',
      senderName: `${contactName} · Durum`,
      previewText: statusPreview,
      isOwn: false,
    });
    setActiveTab('chats');
    setActiveChatId(targetChatId);
    setMobileShowChat(true);
    showToast('Duruma yanıt gönderildi');
  };

  const handleEndCall = (durationSec: number) => {
    if (!activeCall) return;
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    const durationLabel =
      durationSec > 0
        ? mins > 0
          ? `${mins} dk ${secs} sn`
          : `${secs} sn`
        : undefined;

    const newRecord: CallRecord = {
      id: `call-${Date.now()}`,
      contactId: activeCall.contactId,
      direction: 'outgoing',
      mediaType: activeCall.mediaType,
      timestamp: `Bugün, ${formatNowTime()}`,
      durationLabel,
    };

    setCalls((prev) => [newRecord, ...prev]);
    setActiveCall(null);
  };

  // Determine active status viewer target
  const statusViewerIsOwn = statusViewerContactId === 'me';
  const statusViewerContact = statusViewerIsOwn
    ? myProfile
    : contacts.find((c) => c.id === statusViewerContactId) ?? null;
  const statusViewerSegments = statusViewerIsOwn
    ? myStatuses
    : statuses.find((s) => s.contactId === statusViewerContactId)?.segments ?? [];

  const callContact = activeCall
    ? contacts.find((c) => c.id === activeCall.contactId) ?? null
    : null;

  if (!verifiedPhone) {
    return (
      <AuthOnboardingScreen
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onVerified={(formattedPhone) => {
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, formattedPhone);
          } catch {
            // Ignore storage errors
          }
          setVerifiedPhone(formattedPhone);
          setMyProfile((p) => ({ ...p, phone: formattedPhone }));
          showToast('Telefon numaranız doğrulandı');
        }}
      />
    );
  }

  return (
    <div className="w-full h-full flex overflow-hidden bg-[#f4faff] dark:bg-[#0B141A]">
      {/* Left Pane: Chat List / Status / Calls (Full screen on mobile when chat closed, fixed sidebar on md+) */}
      <div
        className={`${
          mobileShowChat ? 'hidden md:block' : 'block'
        } w-full md:w-[360px] lg:w-[410px] h-full shrink-0 border-r border-[#e9edef] dark:border-[rgba(134,150,160,0.15)]`}
      >
        <ChatListPane
          activeTab={activeTab}
          onTabChange={setActiveTab}
          chats={chats}
          contacts={contacts}
          myProfile={myProfile}
          myStatuses={myStatuses}
          statuses={statuses}
          calls={calls}
          activeChatId={activeChatId}
          isDark={isDark}
          onToggleTheme={() => setIsDark((d) => !d)}
          onSelectChat={handleSelectChat}
          onOpenNewChat={() => setNewChatOpen(true)}
          onOpenAddContact={() => setAddContactOpen(true)}
          onOpenNewGroup={() => setNewGroupOpen(true)}
          onOpenStarred={() => setStarredOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenStatusViewer={(cid) => setStatusViewerContactId(cid)}
          onOpenStatusComposer={(mode) => setStatusComposer({ open: true, mode })}
          onStartCall={(contactId, mediaType) =>
            setActiveCall({ contactId, mediaType })
          }
          onShowToast={showToast}
        />
      </div>

      {/* Right Pane: Conversation Stream Canvas */}
      <div
        className={`${
          mobileShowChat ? 'flex' : 'hidden md:flex'
        } flex-1 min-w-0 h-full`}
      >
        <div className="flex-1 min-w-0 h-full">
          <ConversationPane
            chat={activeChat}
            contact={activeContact}
            allContacts={contacts}
            myProfile={myProfile}
            onBackMobile={() => {
              setMobileShowChat(false);
              setContactInfoOpen(false);
            }}
            onSendText={handleSendText}
            onSendVoice={handleSendVoice}
            onSendPhoto={handleSendPhoto}
            onSendDocument={handleSendDocument}
            onSendLocation={handleSendLocation}
            onReactMessage={handleReactMessage}
            onToggleStarMessage={handleToggleStarMessage}
            onDeleteMessage={handleDeleteMessage}
            onStartCall={(contactId, mediaType) =>
              setActiveCall({ contactId, mediaType })
            }
            onOpenContactInfo={() => setContactInfoOpen((o) => !o)}
            onShowToast={showToast}
          />
        </div>

        {/* Contact Info Slide-Over / Side Panel */}
        <ContactInfoDrawer
          open={contactInfoOpen}
          contact={activeContact}
          chat={activeChat}
          onClose={() => setContactInfoOpen(false)}
          onToggleMute={handleToggleMute}
          onTogglePin={handleTogglePin}
          onClearChat={handleClearChat}
          onStartCall={(contactId, mediaType) =>
            setActiveCall({ contactId, mediaType })
          }
        />
      </div>

      {/* Interactive Story / Status Viewer */}
      {statusViewerContactId && (
        <StatusViewerModal
          contact={statusViewerContact}
          segments={statusViewerSegments}
          isOwn={statusViewerIsOwn}
          onClose={() => setStatusViewerContactId(null)}
          onMarkViewed={handleMarkStatusViewed}
          onReplyToStatus={handleReplyToStatus}
        />
      )}

      {/* Active Voice / Video Call Screen */}
      {activeCall && (
        <CallOverlayModal
          contact={callContact}
          mediaType={activeCall.mediaType}
          onEndCall={handleEndCall}
        />
      )}

      {/* Modals */}
      <NewChatModal
        open={newChatOpen}
        contacts={contacts}
        onClose={() => setNewChatOpen(false)}
        onSelectContactChat={handleSelectContactChat}
        onStartCall={(contactId, mediaType) =>
          setActiveCall({ contactId, mediaType })
        }
        onOpenNewGroup={() => setNewGroupOpen(true)}
        onOpenAddContact={() => setAddContactOpen(true)}
      />

      <AddContactModal
        open={addContactOpen}
        onClose={() => setAddContactOpen(false)}
        onAddContact={handleAddContact}
      />

      <NewGroupModal
        open={newGroupOpen}
        contacts={contacts}
        onClose={() => setNewGroupOpen(false)}
        onCreateGroup={handleCreateGroup}
      />

      <StatusComposerModal
        open={statusComposer.open}
        initialMode={statusComposer.mode}
        onClose={() => setStatusComposer((prev) => ({ ...prev, open: false }))}
        onPublishStatus={handlePublishStatus}
      />

      <StarredMessagesModal
        open={starredOpen}
        chats={chats}
        contacts={contacts}
        onClose={() => setStarredOpen(false)}
        onJumpToChat={handleSelectChat}
      />

      <SettingsModal
        open={settingsOpen}
        myProfile={myProfile}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onUpdateProfile={(name, about) => {
          setMyProfile((p) => ({ ...p, name, about }));
          showToast('Profil güncellendi');
        }}
        onLogout={() => {
          try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
          } catch {
            // Ignore
          }
          setVerifiedPhone(null);
        }}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Clean Transient Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#23323b] text-white text-[13.5px] font-medium shadow-lg whitespace-nowrap"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
