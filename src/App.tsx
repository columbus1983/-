import React, { useState } from 'react';
import { INITIAL_PRODUCTS, INITIAL_PRODUCERS } from './data/mockData';
import { Product, Producer, CartItem, SpinReward, ChatMessage, ChatThread, AppNotification, UserProfile, ProducerSubscription } from './types';
import { INITIAL_CHAT_THREADS, INITIAL_CHAT_MESSAGES } from './utils/chatUtils';
import { INITIAL_NOTIFICATIONS, createHarvestNotification, markNotificationAsRead, markAllNotificationsAsRead, countUnreadNotifications } from './utils/notificationUtils';
import { DEFAULT_USER_PROFILE, INITIAL_PRODUCER_SUBSCRIPTIONS, toggleProducerSubscription, updateSubscriptionSettings, countActiveSubscriptions } from './utils/favoriteProducersUtils';
import { playWinCelebration } from './utils/audio';
import { Header } from './components/Header';
import { BottomNav, ActiveTab } from './components/BottomNav';
import { MarketView } from './components/MarketView';
import { InteractiveMap } from './components/InteractiveMap';
import { TerroirWheel } from './components/TerroirWheel';
import { ProducerPortal } from './components/ProducerPortal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { AntiIntermediaryExplainer } from './components/AntiIntermediaryExplainer';
import { ChatSpace } from './components/ChatSpace';
import { NotificationsModal } from './components/NotificationsModal';
import { NotificationToast } from './components/NotificationToast';
import { UserProfileModal } from './components/UserProfileModal';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [producers] = useState<Producer[]>(INITIAL_PRODUCERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('market');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(10);
  const [likedProductIds, setLikedProductIds] = useState<Set<string>>(new Set(['prod-p1', 'prod-p3']));
  // Producers that the user likes/follows (defaults to Ammi Salem & Khalti Fatma)
  const [likedProducerIds, setLikedProducerIds] = useState<Set<string>>(new Set(['prod-1', 'prod-2']));
  const [activePromoDiscount, setActivePromoDiscount] = useState<number>(0);
  const [activePromoCode, setActivePromoCode] = useState<string>('');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);

  // User Profile & Favorite Producers Subscription State
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [producerSubscriptions, setProducerSubscriptions] = useState<Record<string, ProducerSubscription>>(INITIAL_PRODUCER_SUBSCRIPTIONS);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [activeNotificationToast, setActiveNotificationToast] = useState<AppNotification | null>(null);

  // Chat State
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_CHAT_MESSAGES);
  const [activeChatThreadId, setActiveChatThreadId] = useState<string>('thread-group-1');

  const cartItemsMap: Record<string, number> = {};
  cart.forEach((item) => {
    cartItemsMap[item.product.id] = item.quantity;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalUnreadChatCount = chatThreads.reduce((sum, t) => sum + t.unreadCount, 0);
  const unreadNotificationsCount = countUnreadNotifications(notifications);
  const favoriteProducersCount = countActiveSubscriptions(producerSubscriptions);

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return prev.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle producer subscription in profile / favorites
  const handleToggleProducerSubscription = (producerId: string) => {
    setProducerSubscriptions((prev) => {
      const next = toggleProducerSubscription(prev, producerId);
      // Sync with likedProducerIds
      setLikedProducerIds((prevLiked) => {
        const nextLiked = new Set(prevLiked);
        if (next[producerId]?.isSubscribed) {
          nextLiked.add(producerId);
        } else {
          nextLiked.delete(producerId);
        }
        return nextLiked;
      });
      return next;
    });
  };

  // Update specific notification channels & frequencies for a producer
  const handleUpdateSubscriptionSettings = (
    producerId: string,
    updates: Partial<Omit<ProducerSubscription, 'producerId'>>
  ) => {
    setProducerSubscriptions((prev) => updateSubscriptionSettings(prev, producerId, updates));
  };

  const handleToggleLike = (productId: string) => {
    setLikedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });

    // Also add the product's producer to likedProducerIds and ensure subscription is active
    const product = products.find((p) => p.id === productId);
    if (product) {
      setLikedProducerIds((prev) => {
        const next = new Set(prev);
        next.add(product.producerId);
        return next;
      });

      setProducerSubscriptions((prev) => {
        if (!prev[product.producerId] || !prev[product.producerId].isSubscribed) {
          return {
            ...prev,
            [product.producerId]: {
              producerId: product.producerId,
              isSubscribed: true,
              alertFrequency: 'all_harvests',
              notifySound: true,
              notifySMS: false,
              subscribedAt: 'الآن',
            },
          };
        }
        return prev;
      });
    }
  };


  const handleApplyReward = (reward: SpinReward) => {
    if (reward.type === 'discount') {
      setActivePromoDiscount(reward.value);
      setActivePromoCode(reward.code);
    } else {
      setActivePromoCode(reward.code);
    }
  };

  const handleApplyManualCode = (code: string): boolean => {
    const validCodes: Record<string, number> = {
      BARAKA15: 15,
      SBAH20: 20,
      TADAMON10: 10,
      MALTIKDO: 5,
      JBANBAJA: 5,
    };
    if (validCodes[code]) {
      setActivePromoDiscount(validCodes[code]);
      setActivePromoCode(code);
      return true;
    }
    return false;
  };

  // When farmer adds a new product in the portal, trigger notification if liked
  const handleAddNewProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);

    const producer = producers.find((p) => p.id === newProduct.producerId);
    if (producer) {
      const notif = createHarvestNotification(producer, newProduct);
      setNotifications((prev) => [notif, ...prev]);
      setActiveNotificationToast(notif);
      playWinCelebration();
    }
  };

  // Interactive Simulation Handler (requested: Simuler une interface de notifications pour alerter lorsqu'un nouveau produit de saison est ajouté par un producteur liké)
  const handleSimulateNewHarvestAlert = (
    producerId: string,
    harvestName: string,
    price: number,
    unit: string
  ) => {
    const producer = producers.find((p) => p.id === producerId) || producers[0];

    // Ensure producer is in liked list
    setLikedProducerIds((prev) => new Set(prev).add(producer.id));

    const sampleImages = [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
    ];

    const newSimProduct: Product = {
      id: `sim-prod-${Date.now()}`,
      producerId: producer.id,
      farmName: producer.farmName,
      name: harvestName,
      category: 'fruits',
      priceDirect: price,
      priceSupermarketEstimated: price * 1.85,
      unit,
      stock: 30,
      initialStock: 30,
      isFlashDeal: true,
      dealReason: 'صابة جديدة طازجة مقطوعة مع فجر اليوم من السانية!',
      harvestDate: 'اليوم الساعة 06:00 صباحاً',
      qualityLabels: ['طبيعي 100%', 'صابة اليوم', 'من السانية مباشرة'],
      image: sampleImages[0],
      galleryImages: sampleImages,
      description: `صابة موسمية استثنائية من ${producer.farmName} بولاية ${producer.governorate}. تم إشعارك بها لأنك معجب بهذا الفلاّح.`,
      farmDistanceKm: producer.distanceKm,
      governorate: producer.governorate,
      rating: 5.0,
      reviewsCount: 1,
      likesCount: 15,
      isAvailableToday: true,
    };

    setProducts((prev) => [newSimProduct, ...prev]);

    const newNotif = createHarvestNotification(producer, newSimProduct);
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveNotificationToast(newNotif);
    playWinCelebration();
  };

  const handleOpenProductById = (productId: string) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (targetProduct) {
      setSelectedProduct(targetProduct);
    }
  };

  // Chat handlers
  const handleSendMessage = (threadId: string, newMessage: ChatMessage) => {
    setChatMessages((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMessage],
    }));

    setChatThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: `${newMessage.senderName}: ${newMessage.text}`,
            lastMessageTime: 'الآن',
            unreadCount: newMessage.isMe ? thread.unreadCount : thread.unreadCount + 1,
          };
        }
        return thread;
      })
    );
  };

  const handleOpenChatWithProducer = (producerId: string) => {
    const existingThread = chatThreads.find((t) => t.producerId === producerId);
    if (existingThread) {
      setActiveChatThreadId(existingThread.id);
      setActiveTab('chat');
    } else {
      const producer = producers.find((p) => p.id === producerId);
      if (producer) {
        const newThread: ChatThread = {
          id: `thread-${producer.id}`,
          type: 'direct',
          title: producer.name,
          subtitle: `${producer.farmName} · ${producer.governorate}`,
          avatar: producer.avatar,
          producerId: producer.id,
          governorate: producer.governorate,
          unreadCount: 0,
          lastMessage: 'مرحباً بيك في سانيتنا!',
          lastMessageTime: 'الآن',
          isOnline: true,
        };
        setChatThreads((prev) => [newThread, ...prev]);
        setActiveChatThreadId(newThread.id);
        setActiveTab('chat');
      }
    }
  };

  const selectedProducer = selectedProduct
    ? producers.find((p) => p.id === selectedProduct.producerId)
    : undefined;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-900 flex justify-center selection:bg-emerald-700 selection:text-white" dir="rtl">
      {/* Floating Notification Toast when alert triggers */}
      <NotificationToast
        notification={activeNotificationToast}
        onClose={() => setActiveNotificationToast(null)}
        onOpenProduct={handleOpenProductById}
      />

      {/* Outer Shell: Desktop phone mockup or full width */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-md my-0 sm:my-4 sm:rounded-[40px] sm:border-[10px] sm:border-stone-800 sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] sm:overflow-hidden relative bg-stone-50'
            : 'max-w-3xl my-0 sm:my-3 bg-stone-50 sm:rounded-3xl shadow-xl'
        }`}
      >


        {/* Phone Notch & Clock bar */}
        {isPhoneFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 py-2 bg-stone-900 text-stone-300 text-[11px] font-bold border-b border-stone-800">
            <span className="font-mono">09:41</span>
            <div className="w-20 h-4 bg-stone-950 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-stone-800"></div>
            </div>
            <div className="flex items-center gap-1.5 font-mono">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Header with quick filters, mode toggle, and notification bell */}
        <Header
          maxDistance={maxDistance}
          onDistanceChange={setMaxDistance}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          isProducerMode={activeTab === 'producer'}
          onToggleProducerMode={() =>
            setActiveTab((prev) => (prev === 'producer' ? 'market' : 'producer'))
          }
          isPhoneFrame={isPhoneFrame}
          onTogglePhoneFrame={() => setIsPhoneFrame((prev) => !prev)}
          onOpenExplainer={() => setIsExplainerOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          unreadNotificationsCount={unreadNotificationsCount}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          favoriteProducersCount={favoriteProducersCount}
        />

        {/* Main Content Area */}
        <main className="p-3 sm:p-4 pb-24 min-h-[calc(100vh-140px)]">
          {activeTab === 'market' && (
            <MarketView
              products={products}
              cartItemsMap={cartItemsMap}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onOpenDetails={(p) => setSelectedProduct(p)}
              onOpenWheel={() => setActiveTab('wheel')}
              likedProductIds={likedProductIds}
              onToggleLike={handleToggleLike}
              maxDistance={maxDistance}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveMap
              producers={producers}
              products={products}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onAddToCart={handleAddToCart}
              maxDistance={maxDistance}
            />
          )}

          {/* فلاحتي المفضلون (Mes Producteurs Favoris) Tab */}
          {activeTab === 'favorites' && (
            <UserProfileModal
              isOpen={true}
              isInline={true}
              onClose={() => setActiveTab('market')}
              userProfile={userProfile}
              producers={producers}
              subscriptions={producerSubscriptions}
              onToggleSubscription={handleToggleProducerSubscription}
              onUpdateSubscriptionSettings={handleUpdateSubscriptionSettings}
              onOpenChatWithProducer={handleOpenChatWithProducer}
              onSimulateHarvestAlert={handleSimulateNewHarvestAlert}
            />
          )}

          {activeTab === 'chat' && (
            <ChatSpace
              threads={chatThreads}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              activeThreadId={activeChatThreadId}
              onSelectThread={(id) => {
                setActiveChatThreadId(id);
                setChatThreads((prev) =>
                  prev.map((t) => (t.id === id ? { ...t, unreadCount: 0 } : t))
                );
              }}
            />
          )}

          {activeTab === 'wheel' && (
            <TerroirWheel
              onApplyReward={handleApplyReward}
              activePromoCode={activePromoCode}
              onGoToMarket={() => setActiveTab('market')}
            />
          )}

          {activeTab === 'producer' && (
            <ProducerPortal
              producers={producers}
              onAddNewProduct={handleAddNewProduct}
              onExitProducerMode={() => setActiveTab('market')}
            />
          )}
        </main>

        {/* Bottom Mobile Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          unreadChatCount={totalUnreadChatCount}
          favoriteProducersCount={favoriteProducersCount}
        />

        {/* User Profile & Mes Producteurs Favoris Modal */}
        <UserProfileModal
          isOpen={isProfileModalOpen}
          isInline={false}
          onClose={() => setIsProfileModalOpen(false)}
          userProfile={userProfile}
          producers={producers}
          subscriptions={producerSubscriptions}
          onToggleSubscription={handleToggleProducerSubscription}
          onUpdateSubscriptionSettings={handleUpdateSubscriptionSettings}
          onOpenChatWithProducer={handleOpenChatWithProducer}
          onSimulateHarvestAlert={handleSimulateNewHarvestAlert}
        />

        {/* Notifications Modal & Simulator Drawer */}
        <NotificationsModal
          isOpen={isNotificationsModalOpen}
          onClose={() => setIsNotificationsModalOpen(false)}
          notifications={notifications}
          onMarkAsRead={(id) => setNotifications((prev) => markNotificationAsRead(prev, id))}
          onMarkAllAsRead={() => setNotifications((prev) => markAllNotificationsAsRead(prev))}
          onDeleteNotification={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
          onOpenProduct={handleOpenProductById}
          onSimulateNewHarvestAlert={handleSimulateNewHarvestAlert}
          producers={producers}
          likedProducerIds={likedProducerIds}
        />

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            producer={selectedProducer}
            quantityInCart={cartItemsMap[selectedProduct.id] || 0}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onClose={() => setSelectedProduct(null)}
            isLiked={likedProductIds.has(selectedProduct.id)}
            onToggleLike={handleToggleLike}
            onOpenChatWithProducer={handleOpenChatWithProducer}
          />
        )}

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
          activePromoDiscount={activePromoDiscount}
          activePromoCode={activePromoCode}
          onApplyManualCode={handleApplyManualCode}
        />

        {/* Anti-Intermédiaire Explainer */}
        <AntiIntermediaryExplainer
          isOpen={isExplainerOpen}
          onClose={() => setIsExplainerOpen(false)}
        />
      </div>
    </div>
  );
}
