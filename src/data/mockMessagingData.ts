import {
  CallRecord,
  ChatThread,
  Contact,
  ContactStatus,
  SceneId,
} from '../types/messaging';

export const MY_PROFILE: Contact = {
  id: 'me',
  name: 'Emre Aydın',
  phone: '+90 532 418 72 90',
  about: 'İstanbul · Ürün Tasarımı & Kahve',
  avatarBg: '#d8fff1',
  avatarAccent: '#006552',
  avatarVariant: 'man-1',
  isOnline: true,
  onlineStatus: 'çevrimiçi',
};

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'zeynep',
    name: 'Zeynep Kaya',
    phone: '+90 533 812 45 19',
    about: 'Kadıköy · Mimarlık & Fotoğraf',
    avatarBg: '#ffe8d6',
    avatarAccent: '#006552',
    avatarVariant: 'woman-1',
    isOnline: true,
    onlineStatus: 'çevrimiçi',
  },
  {
    id: 'tasarim-ekibi',
    name: 'Tasarım Ekibi 🎨',
    phone: 'Grup · 6 katılımcı',
    about: 'Mobil arayüz ve kullanıcı deneyimi ekibi',
    avatarBg: '#d8fff1',
    avatarAccent: '#006552',
    avatarVariant: 'group-design',
    isGroup: true,
    members: ['Zeynep Kaya', 'Kerem Demir', 'Defne Şahin', 'Mert Özkan', 'Selin Arslan', 'Siz'],
    onlineStatus: 'Zeynep, Kerem, Defne, Mert, Selin, Siz',
  },
  {
    id: 'kerem',
    name: 'Kerem Demir',
    phone: '+90 542 691 33 04',
    about: 'Yazılım Geliştirici · Bisiklet',
    avatarBg: '#e0f0fb',
    avatarAccent: '#00607e',
    avatarVariant: 'man-2',
    isOnline: false,
    onlineStatus: 'son görülme bugün 14:18',
  },
  {
    id: 'elif',
    name: 'Elif Yılmaz',
    phone: '+90 535 204 88 12',
    about: 'Toplantıda olabilirim, sesli mesaj bırakın.',
    avatarBg: '#fce7f3',
    avatarAccent: '#9d174d',
    avatarVariant: 'woman-2',
    isOnline: true,
    onlineStatus: 'çevrimiçi',
  },
  {
    id: 'aile-grubu',
    name: 'Aile Grubu ❤️',
    phone: 'Grup · 5 katılımcı',
    about: 'Pazar kahvaltıları ve aile haberleri',
    avatarBg: '#fef3c7',
    avatarAccent: '#b45309',
    avatarVariant: 'group-family',
    isGroup: true,
    members: ['Anne', 'Baba', 'Selin Arslan', 'Ahmet Çelik', 'Siz'],
    onlineStatus: 'Anne, Baba, Selin, Ahmet, Siz',
  },
  {
    id: 'ahmet',
    name: 'Ahmet Çelik',
    phone: '+90 505 743 19 66',
    about: 'Kapadokya gezisi planlanıyor 🎈',
    avatarBg: '#e2e8f0',
    avatarAccent: '#334155',
    avatarVariant: 'man-3',
    isOnline: false,
    onlineStatus: 'son görülme bugün 11:52',
  },
  {
    id: 'defne',
    name: 'Defne Şahin',
    phone: '+90 530 911 27 40',
    about: 'Kahve molasında ☕',
    avatarBg: '#ede9fe',
    avatarAccent: '#5b21b6',
    avatarVariant: 'woman-3',
    isOnline: false,
    onlineStatus: 'son görülme dün 23:14',
  },
  {
    id: 'selin',
    name: 'Selin Arslan',
    phone: '+90 538 355 61 08',
    about: 'Belgrad Ormanı koşu kulübü',
    avatarBg: '#dcfce7',
    avatarAccent: '#166534',
    avatarVariant: 'woman-4',
    isOnline: true,
    onlineStatus: 'çevrimiçi',
  },
];

export const INITIAL_CHATS: ChatThread[] = [
  {
    id: 'chat-zeynep',
    contactId: 'zeynep',
    unreadCount: 2,
    isPinned: true,
    isMuted: false,
    messages: [
      {
        id: 'm-z-1',
        chatId: 'chat-zeynep',
        senderId: 'zeynep',
        kind: 'text',
        text: 'Selam Emre! Bugün Moda sahildeki yeni açılan kafeye uğrayacak mısın?',
        timestamp: '13:40',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
      {
        id: 'm-z-2',
        chatId: 'chat-zeynep',
        senderId: 'me',
        kind: 'text',
        text: 'Selam Zeynep, saat 16:00 gibi orada olmayı planlıyorum. Sunum taslaklarını da yanımda getiriyorum.',
        timestamp: '13:44',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
      {
        id: 'm-z-3',
        chatId: 'chat-zeynep',
        senderId: 'me',
        kind: 'photo',
        sceneId: 'turkish-coffee',
        photoCaption: 'Şimdilik masam bu şekilde, birazdan çıkacağım ☕',
        timestamp: '13:45',
        dateGroup: 'BUGÜN',
        status: 'read',
        reactions: [{ emoji: '☕', count: 1 }],
      },
      {
        id: 'm-z-4',
        chatId: 'chat-zeynep',
        senderId: 'zeynep',
        kind: 'voice',
        voiceDurationSec: 24,
        waveform: [
          0.25, 0.4, 0.72, 0.9, 0.65, 0.45, 0.85, 0.95, 0.6, 0.35, 0.55, 0.88,
          0.74, 0.42, 0.3, 0.68, 0.92, 0.8, 0.5, 0.38, 0.7, 0.86, 0.64, 0.44,
          0.52, 0.78, 0.6, 0.35, 0.25, 0.48,
        ],
        timestamp: '14:19',
        dateGroup: 'BUGÜN',
        status: 'delivered',
      },
      {
        id: 'm-z-5',
        chatId: 'chat-zeynep',
        senderId: 'zeynep',
        kind: 'text',
        text: 'Karaköy vapuruyla geçerken harika bir gün batımı yakaladım, akşamüstü detayları konuşuruz!',
        timestamp: '14:22',
        dateGroup: 'BUGÜN',
        status: 'delivered',
        replyTo: {
          messageId: 'm-z-2',
          senderName: 'Siz',
          previewText: 'Sunum taslaklarını da yanımda getiriyorum.',
          isOwn: true,
        },
      },
    ],
  },
  {
    id: 'chat-tasarim',
    contactId: 'tasarim-ekibi',
    unreadCount: 4,
    isPinned: true,
    isMuted: false,
    messages: [
      {
        id: 'm-t-1',
        chatId: 'chat-tasarim',
        senderId: 'kerem',
        senderName: 'Kerem Demir',
        kind: 'text',
        text: 'Arkadaşlar yeni mesajlaşma arayüzünün son güncellemesini test ortamına aldım.',
        timestamp: '10:15',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
      {
        id: 'm-t-2',
        chatId: 'chat-tasarim',
        senderId: 'defne',
        senderName: 'Defne Şahin',
        kind: 'document',
        fileName: 'Arayuz_Tipografi_Kilavuzu_v3.pdf',
        fileSize: '2.4 MB',
        filePages: '18 sayfa',
        timestamp: '10:28',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
      {
        id: 'm-t-3',
        chatId: 'chat-tasarim',
        senderId: 'me',
        kind: 'text',
        text: 'Ellerinize sağlık! Özellikle Türkçe karakterlerdeki satır yüksekliği çok temiz duruyor.',
        timestamp: '10:34',
        dateGroup: 'BUGÜN',
        status: 'read',
        reactions: [
          { emoji: '👍', count: 3, byMe: false },
          { emoji: '🎉', count: 1 },
        ],
      },
      {
        id: 'm-t-4',
        chatId: 'chat-tasarim',
        senderId: 'zeynep',
        senderName: 'Zeynep Kaya',
        kind: 'text',
        text: 'Sesli mesaj dalga formundaki mavi ilerleme rengi de karanlık modda harika görünüyor.',
        timestamp: '14:05',
        dateGroup: 'BUGÜN',
        status: 'delivered',
      },
      {
        id: 'm-t-5',
        chatId: 'chat-tasarim',
        senderId: 'kerem',
        senderName: 'Kerem Demir',
        kind: 'text',
        text: 'Saat 15:30’da kısa bir değerlendirme toplantısı yapalım mı?',
        timestamp: '14:12',
        dateGroup: 'BUGÜN',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'chat-kerem',
    contactId: 'kerem',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    messages: [
      {
        id: 'm-k-1',
        chatId: 'chat-kerem',
        senderId: 'me',
        kind: 'voice',
        voiceDurationSec: 16,
        waveform: [
          0.3, 0.55, 0.8, 0.62, 0.4, 0.7, 0.9, 0.75, 0.5, 0.35, 0.65, 0.85,
          0.7, 0.45, 0.6, 0.82, 0.55, 0.4, 0.72, 0.88, 0.65, 0.48, 0.32, 0.58,
          0.74, 0.45, 0.3, 0.25,
        ],
        timestamp: 'Dün 19:40',
        dateGroup: 'DÜN',
        status: 'read',
      },
      {
        id: 'm-k-2',
        chatId: 'chat-kerem',
        senderId: 'kerem',
        kind: 'text',
        text: 'Tamamdır Emre, yarın sabah ilk iş performans ölçümlerini paylaşıyorum.',
        timestamp: '11:20',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
      {
        id: 'm-k-3',
        chatId: 'chat-kerem',
        senderId: 'me',
        kind: 'text',
        text: 'Harika, ben de renk paleti kontrollerini tamamladım.',
        timestamp: '11:24',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-elif',
    contactId: 'elif',
    unreadCount: 1,
    isPinned: false,
    isMuted: false,
    messages: [
      {
        id: 'm-e-1',
        chatId: 'chat-elif',
        senderId: 'elif',
        kind: 'location',
        locationTitle: 'Zorlu PSM · Ana Giriş',
        locationAddress: 'Levazım, Koru Sk. No:2, Beşiktaş/İstanbul',
        timestamp: '12:50',
        dateGroup: 'BUGÜN',
        status: 'delivered',
      },
      {
        id: 'm-e-2',
        chatId: 'chat-elif',
        senderId: 'elif',
        kind: 'text',
        text: 'Etkinlik biletlerini dijital olarak gönderdim, girişte QR kodu göstermen yeterli.',
        timestamp: '12:51',
        dateGroup: 'BUGÜN',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'chat-aile',
    contactId: 'aile-grubu',
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    messages: [
      {
        id: 'm-a-1',
        chatId: 'chat-aile',
        senderId: 'selin',
        senderName: 'Selin Arslan',
        kind: 'photo',
        sceneId: 'bosphorus',
        photoCaption: 'Boğaz havası bugün şahane, Pazar kahvaltısını burada mı yapsak?',
        timestamp: 'Dün 17:15',
        dateGroup: 'DÜN',
        status: 'read',
      },
      {
        id: 'm-a-2',
        chatId: 'chat-aile',
        senderId: 'me',
        kind: 'text',
        text: 'Kesinlikle harika fikir, saat 10:30 herkes için uygun mu?',
        timestamp: 'Dün 17:42',
        dateGroup: 'DÜN',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-ahmet',
    contactId: 'ahmet',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    messages: [
      {
        id: 'm-ah-1',
        chatId: 'chat-ahmet',
        senderId: 'ahmet',
        kind: 'photo',
        sceneId: 'cappadocia',
        photoCaption: 'Sabah 06:00’da Göreme’den kareler 🎈',
        timestamp: '20 Kasım',
        dateGroup: '20 KASIM',
        status: 'read',
      },
      {
        id: 'm-ah-2',
        chatId: 'chat-ahmet',
        senderId: 'me',
        kind: 'text',
        text: 'İnanılmaz görünüyor Ahmet! İyi tatiller dilerim.',
        timestamp: '20 Kasım',
        dateGroup: '20 KASIM',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-defne',
    contactId: 'defne',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    messages: [
      {
        id: 'm-d-1',
        chatId: 'chat-defne',
        senderId: 'defne',
        kind: 'text',
        text: 'Bahariye’de tramvay geçerken fotoğrafını çektim, birazdan paylaşacağım.',
        timestamp: 'Dün',
        dateGroup: 'DÜN',
        status: 'read',
      },
    ],
  },
  {
    id: 'chat-selin',
    contactId: 'selin',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    messages: [
      {
        id: 'm-s-1',
        chatId: 'chat-selin',
        senderId: 'selin',
        kind: 'photo',
        sceneId: 'forest',
        photoCaption: 'Sabah 7 km koşu tamamlandı 🌲',
        timestamp: '09:15',
        dateGroup: 'BUGÜN',
        status: 'read',
      },
      {
        id: 'm-s-2',
        chatId: 'chat-selin',
        senderId: 'me',
        kind: 'text',
        text: 'Tebrikler Selin! Hafta sonu ben de katılıyorum.',
        timestamp: '09:22',
        dateGroup: 'BUGÜN',
        status: 'sent',
      },
    ],
  },
];

export const INITIAL_STATUSES: ContactStatus[] = [
  {
    id: 'st-zeynep',
    contactId: 'zeynep',
    segments: [
      {
        id: 'seg-z-1',
        type: 'scene',
        sceneId: 'bosphorus',
        caption: 'Karaköy – Kadıköy vapurunda akşamüstü ışığı ✨',
        timeAgo: '18 dakika önce',
        viewed: false,
      },
      {
        id: 'seg-z-2',
        type: 'text',
        text: 'Yeni mimari proje maketini bugün teslim ettik! 🎉',
        bgColor: '#006552',
        timeAgo: '3 saat önce',
        viewed: false,
      },
    ],
  },
  {
    id: 'st-selin',
    contactId: 'selin',
    segments: [
      {
        id: 'seg-s-1',
        type: 'scene',
        sceneId: 'forest',
        caption: 'Belgrad Ormanı sabah 07:30 · Temiz hava 🌲',
        timeAgo: '5 saat önce',
        viewed: false,
      },
    ],
  },
  {
    id: 'st-ahmet',
    contactId: 'ahmet',
    segments: [
      {
        id: 'seg-a-1',
        type: 'scene',
        sceneId: 'cappadocia',
        caption: 'Göreme’de gün doğumu 🎈',
        timeAgo: 'Dün 06:40',
        viewed: true,
      },
      {
        id: 'seg-a-2',
        type: 'text',
        text: 'Kapadokya kahvaltısı bir başka güzelmiş.',
        bgColor: '#00607e',
        timeAgo: 'Dün 09:15',
        viewed: true,
      },
    ],
  },
  {
    id: 'st-defne',
    contactId: 'defne',
    segments: [
      {
        id: 'seg-d-1',
        type: 'scene',
        sceneId: 'kadikoy',
        caption: 'Bahariye Caddesi’nde nostaljik tramvay',
        timeAgo: 'Dün 16:20',
        viewed: true,
      },
    ],
  },
];

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call-1',
    contactId: 'zeynep',
    direction: 'incoming',
    mediaType: 'voice',
    timestamp: 'Bugün, 13:12',
    durationLabel: '4 dk 18 sn',
  },
  {
    id: 'call-2',
    contactId: 'elif',
    direction: 'missed',
    mediaType: 'video',
    timestamp: 'Bugün, 11:05',
  },
  {
    id: 'call-3',
    contactId: 'kerem',
    direction: 'outgoing',
    mediaType: 'voice',
    timestamp: 'Dün, 19:20',
    durationLabel: '12 dk 04 sn',
  },
  {
    id: 'call-4',
    contactId: 'ahmet',
    direction: 'outgoing',
    mediaType: 'video',
    timestamp: '20 Kasım, 21:40',
    durationLabel: '8 dk 52 sn',
  },
  {
    id: 'call-5',
    contactId: 'selin',
    direction: 'missed',
    mediaType: 'voice',
    timestamp: '19 Kasım, 08:30',
  },
];

export const QUICK_SCENES: { id: SceneId; label: string }[] = [
  { id: 'bosphorus', label: 'Boğaz Gün Batımı' },
  { id: 'turkish-coffee', label: 'Kahve Molası' },
  { id: 'cappadocia', label: 'Kapadokya Şafağı' },
  { id: 'kadikoy', label: 'Kadıköy Tramvayı' },
  { id: 'forest', label: 'Orman Yürüyüşü' },
];

export function generateContextualTurkishReply(userText: string, contactName: string): string {
  const lower = userText.toLocaleLowerCase('tr-TR');
  if (lower.includes('merhaba') || lower.includes('selam') || lower.includes('günaydın')) {
    return `Selam! Nasılsın? Her şey yolunda mı?`;
  }
  if (lower.includes('kahve') || lower.includes('buluş') || lower.includes('saat')) {
    return `Harika olur, ben de uygunum. Konumu birazdan netleştirelim ☕`;
  }
  if (lower.includes('teşekkür') || lower.includes('sağ ol') || lower.includes('elinize sağlık')) {
    return `Rica ederim, ne demek! Başka bir şeye ihtiyacın olursa yazman yeterli.`;
  }
  if (lower.includes('tamam') || lower.includes('harika') || lower.includes('süper')) {
    return `Süper, anlaştık o zaman 👍`;
  }
  if (lower.includes('sesli')) {
    return `Sesli mesajını dinledim, çok net anlaşıldı. Birazdan dönüş yapıyorum!`;
  }
  const firstName = contactName.split(' ')[0];
  const pool = [
    `Anladım, hemen kontrol edip sana haber veriyorum.`,
    `Tamamdır, notumu aldım! Birazdan detayları paylaşacağım.`,
    `Çok güzel görünüyor, ellerine sağlık 👏`,
    `Olur, ${firstName} olarak benim için de gayet uygun.`,
  ];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatNowTime(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}
