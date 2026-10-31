import { ChatMessage, ChatThread } from '../types';

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'thread-group-1',
    type: 'group',
    title: 'مجلس سواني الوطن القبلي وتونس 🇹🇳',
    subtitle: 'مجلس الحومة: فلاحين ومواطنين يتشاركون الصابة والطلبات المباشرة',
    avatar: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=250&q=80',
    unreadCount: 2,
    lastMessage: 'عم سالم: هبطنا كرانب وطماطم حقلية فريشك للجميع!',
    lastMessageTime: 'منذ 10 دقائق',
    isOnline: true,
  },
  {
    id: 'thread-prod-1',
    type: 'direct',
    title: 'عمّ سالم العكاري',
    subtitle: 'سانية وادي الرمل · نابل',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    producerId: 'prod-1',
    governorate: 'نابل',
    unreadCount: 1,
    lastMessage: 'أهلاً يا خويا، قفة الخضار محجوزة ومحضرة باسمك في السانية.',
    lastMessageTime: 'منذ 25 دقيقة',
    isOnline: true,
  },
  {
    id: 'thread-prod-2',
    type: 'direct',
    title: 'خالتي فاطمة السعيدي',
    subtitle: 'ضيعة وادي الزيتون · سيدي بوزيد',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
    producerId: 'prod-2',
    governorate: 'سيدي بوزيد',
    unreadCount: 0,
    lastMessage: 'الزيت عصرة أولى باردة، هبطنا البيدونات للمعصرة اليوم.',
    lastMessageTime: 'أمس 18:20',
    isOnline: false,
  },
  {
    id: 'thread-prod-3',
    type: 'direct',
    title: 'الحبيب البجاوي',
    subtitle: 'مزرعة ربوع باجة الخضراء · باجة',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
    producerId: 'prod-3',
    governorate: 'باجة',
    unreadCount: 0,
    lastMessage: 'جبن باجة العربي الطازج متوفر غدوة الصباح في نقطة التسليم.',
    lastMessageTime: 'أمس 14:10',
    isOnline: true,
  }
];

export const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'thread-group-1': [
    {
      id: 'm-g-1',
      threadId: 'thread-group-1',
      senderId: 'prod-1',
      senderName: 'عم سالم العكاري (فلاّح نابل)',
      senderRole: 'producteur',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      text: 'صباح الخير والبركة على جيرانا الكل! اليوم جنينا صابة باهية من البرتقال المالطي والطماطم، الصناديق موجودة بسوم الفلاّح.',
      timestamp: '07:30',
      isMe: false,
      photoUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'm-g-2',
      threadId: 'thread-group-1',
      senderId: 'user-mourad',
      senderName: 'مراد بن صالح (مواطن)',
      senderRole: 'citoyen',
      senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      text: 'يعطيك الصحة عم سالم، قفة الجمعة الفارطة كانت ممتازة ونظيفة ياسر. هل ما زال فما بطاطا وقرع؟',
      timestamp: '08:15',
      isMe: false,
    },
    {
      id: 'm-g-3',
      threadId: 'thread-group-1',
      senderId: 'coord-sami',
      senderName: 'سامي (منسق نقطة التوزيع)',
      senderRole: 'coordinateur',
      senderAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
      text: 'تذكير للجميع: تسليم الطلبات المجمعة اليوم يبدأ مع الـ 16:30 بساحة البلدية، الدفع نقداً بدون أي وساطة.',
      timestamp: '09:00',
      isMe: false,
    },
  ],
  'thread-prod-1': [
    {
      id: 'm-p1-1',
      threadId: 'thread-prod-1',
      senderId: 'prod-1',
      senderName: 'عمّ سالم العكاري',
      senderRole: 'producteur',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      text: 'عسلامة ومرحباً بيك في سانيتنا! إذا عندك أي سؤال على الخضار والغلال أو حبيت نوصي عليك في حاجة مخصوصة، راني في الخدمة.',
      timestamp: 'أمس 16:00',
      isMe: false,
    },
    {
      id: 'm-p1-2',
      threadId: 'thread-prod-1',
      senderId: 'prod-1',
      senderName: 'عمّ سالم العكاري',
      senderRole: 'producteur',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      text: 'أهلاً يا خويا، قفة الخضار محجوزة ومحضرة باسمك في السانية.',
      timestamp: '11:20',
      isMe: false,
    }
  ],
  'thread-prod-2': [
    {
      id: 'm-p2-1',
      threadId: 'thread-prod-2',
      senderId: 'prod-2',
      senderName: 'خالتي فاطمة السعيدي',
      senderRole: 'producteur',
      senderAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=250&q=80',
      text: 'مرحبا بيك في ضيعة وادي الزيتون، الزيت عصرة أولى باردة، هبطنا البيدونات للمعصرة اليوم.',
      timestamp: 'أمس 18:20',
      isMe: false,
    }
  ],
  'thread-prod-3': [
    {
      id: 'm-p3-1',
      threadId: 'thread-prod-3',
      senderId: 'prod-3',
      senderName: 'الحبيب البجاوي',
      senderRole: 'producteur',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=250&q=80',
      text: 'جبن باجة العربي الطازج متوفر غدوة الصباح في نقطة التسليم.',
      timestamp: 'أمس 14:10',
      isMe: false,
    }
  ]
};

/**
 * Generates automated friendly reply from Tunisian farmers
 */
export function generateFarmerAutoReply(farmerName: string, userText: string): string {
  const lower = userText.toLowerCase();

  if (lower.includes('زيت') || lower.includes('huile')) {
    return `مرحبا بيك يا خويا، زيت الزيتونة عصرة أولى على البارد بدون أي غش، وحموضته خفيفة ياسر (أقل من 0.4%). حجزتك مسجلة وتقدر تستلم في أي وقت!`;
  }

  if (lower.includes('طماطم') || lower.includes('خضار') || lower.includes('قفة')) {
    return `يعيشك يا باهي! الخضار مقطوعة باليد من صابة الفجر، طرية وفاوحة. القفة نوزنوها قدامك ونزيدوك فيها البركة!`;
  }

  if (lower.includes('وقت') || lower.includes('ساعة') || lower.includes('وين') || lower.includes('عنوان')) {
    return `نحن متواجدين في السانية كل يوم من 16:30 إلى 19:30، ونقطة تسليم ساحة البلدية تفتح السبت صباحاً. مرحباً بيك في كل وقت!`;
  }

  if (lower.includes('سوم') || lower.includes('prix') || lower.includes('دينار')) {
    return `الأسعار محددة مباشرة من الفلاّح بدون أي مليم زيادة للقشارة أو السماسرة، ربح حلال وسوم يشجع المواطن!`;
  }

  return `يعطيك الصحة وسررت بتواصلك معنا! سجلت استفسارك وسأجيبك بكل فرح وسرور. الصابة اليوم ما شاء الله مباركة ونرحب بيك في ضيعتنا.`;
}

/**
 * Formats time for chat
 */
export function formatChatTimestamp(): string {
  const now = new Date();
  return now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
