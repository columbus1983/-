export type ProductCategory = 
  | 'tous'
  | 'legumes'
  | 'fruits'
  | 'huiles'
  | 'fromages'
  | 'pain'
  | 'anti-gaspi'
  | 'dattes'
  | 'epicerie';

export interface QualityLabel {
  id: string;
  name: string;
  icon?: string;
}

export interface Product {
  id: string;
  producerId: string;
  farmName: string;
  name: string;
  category: ProductCategory;
  priceDirect: number; // in DT (Tunisian Dinar)
  priceSupermarketEstimated: number; // in DT (traditional market / supermarché / قشارة)
  unit: string; // e.g. "للكيلوغرام", "قفة 5 كغ", "قارورة 1 لتر", "صندوق 4 كغ"
  stock: number;
  initialStock: number;
  isFlashDeal?: boolean;
  dealReason?: string;
  harvestDate: string;
  qualityLabels: string[];
  image: string;
  galleryImages: string[]; // Multiple high quality pictures
  description: string;
  farmDistanceKm: number;
  governorate: string; // e.g. نابل، بنزرت، باجة، القيروان، سيدي بوزيد، زغوان
  rating: number;
  reviewsCount: number;
  likesCount: number;
  isAvailableToday: boolean;
  groupBuyActive?: boolean;
  groupBuyJoined?: number;
  groupBuyTarget?: number;
}

export interface Producer {
  id: string;
  name: string;
  role: string;
  farmName: string; // اسم السانية أو الضيعة
  photo: string;
  avatar: string;
  story: string;
  location: string;
  governorate: string;
  distanceKm: number;
  coordinates: {
    xPercent: number;
    yPercent: number;
  };
  address: string;
  specialties: string[];
  phone: string;
  voiceNote: string;
  openSlots: string[];
  sinceYear: number;
  trustScore: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Reservation {
  id: string;
  reservationNumber: string;
  createdAt: string;
  items: CartItem[];
  totalDirect: number;
  totalSavings: number;
  producerBonus: number;
  pickupSlot: string;
  pickupLocation: string;
  pickupFarmName: string;
  status: 'confirmée' | 'prête' | 'récupérée';
  paymentMode: 'sur_place_retrait' | 'en_ligne';
  pinCode: string;
  notes?: string;
}

export interface SpinReward {
  id: string;
  title: string;
  subtitle: string;
  type: 'discount' | 'gift' | 'recipe' | 'free_sample';
  value: number;
  color: string;
  code: string;
}

/* Chat & Messaging between intervenants (مواطن، فلاّح، منسق الحومة) */
export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: 'citoyen' | 'producteur' | 'coordinateur';
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  photoUrl?: string;
  audioDurationSeconds?: number;
  dealMention?: {
    productId: string;
    productName: string;
    price: number;
  };
}

export interface ChatThread {
  id: string;
  type: 'direct' | 'group';
  title: string;
  subtitle: string;
  avatar: string;
  producerId?: string;
  governorate?: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  isOnline: boolean;
}

export interface AppNotification {
  id: string;
  type: 'favorite_producer_harvest' | 'flash_deal' | 'group_buy';
  producerId: string;
  producerName: string;
  farmName: string;
  producerAvatar: string;
  productId: string;
  productName: string;
  productImage: string;
  priceDirect: number;
  unit: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  governorate: string;
}

export interface ProducerSubscription {
  producerId: string;
  isSubscribed: boolean;
  alertFrequency: 'all_harvests' | 'flash_deals_only';
  notifySound: boolean;
  notifySMS: boolean;
  subscribedAt: string;
  preferredCategories?: ProductCategory[];
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  governorate: string;
  avatar: string;
  memberSince: string;
  totalSavedDT: number;
  directOrdersCount: number;
  antiGacharaBadge: string;
  deliveryAddress: string;
}

