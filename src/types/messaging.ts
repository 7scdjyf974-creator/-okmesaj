export type DeliveryStatus = 'sending' | 'sent' | 'delivered' | 'read';

export type MessageKind = 'text' | 'voice' | 'photo' | 'document' | 'location';

export type SceneId =
  | 'bosphorus'
  | 'turkish-coffee'
  | 'cappadocia'
  | 'kadikoy'
  | 'forest';

export interface QuotedReply {
  messageId: string;
  senderName: string;
  previewText: string;
  isOwn: boolean;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  byMe?: boolean;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string; // 'me' or contactId
  senderName?: string;
  kind: MessageKind;
  text?: string;
  timestamp: string; // e.g. '14:22'
  dateGroup: string; // e.g. 'BUGÜN', 'DÜN', '20 KASIM'
  status: DeliveryStatus;
  replyTo?: QuotedReply;
  reactions?: MessageReaction[];
  starred?: boolean;
  // Voice note fields
  voiceDurationSec?: number;
  waveform?: number[]; // 28–36 normalized bars [0.15..1.0]
  audioUrl?: string; // Recorded blob URL when available
  // Photo fields
  sceneId?: SceneId;
  photoCaption?: string;
  // Document fields
  fileName?: string;
  fileSize?: string;
  filePages?: string;
  // Location fields
  locationTitle?: string;
  locationAddress?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  about: string;
  avatarBg: string;
  avatarAccent: string;
  avatarVariant: 'woman-1' | 'man-1' | 'woman-2' | 'man-2' | 'woman-3' | 'man-3' | 'woman-4' | 'group-design' | 'group-family';
  isGroup?: boolean;
  members?: string[];
  onlineStatus: string; // e.g. 'çevrimiçi', 'son görülme bugün 14:10'
  isOnline?: boolean;
}

export interface ChatThread {
  id: string;
  contactId: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isTyping?: boolean;
  typingLabel?: string;
  messages: Message[];
}

export interface StatusSegment {
  id: string;
  type: 'text' | 'scene';
  text?: string;
  bgColor?: string;
  sceneId?: SceneId;
  caption?: string;
  timeAgo: string;
  viewed: boolean;
}

export interface ContactStatus {
  id: string;
  contactId: string;
  segments: StatusSegment[];
}

export type CallDirection = 'incoming' | 'outgoing' | 'missed';
export type CallMediaType = 'voice' | 'video';

export interface CallRecord {
  id: string;
  contactId: string;
  direction: CallDirection;
  mediaType: CallMediaType;
  timestamp: string;
  durationLabel?: string;
}

export type ActiveTab = 'chats' | 'status' | 'calls';
export type ChatFilter = 'all' | 'unread' | 'groups' | 'pinned';
