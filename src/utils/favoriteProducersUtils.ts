import { Producer, ProducerSubscription, UserProfile } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'user-tunis-01',
  name: 'أنيس بن سالم',
  phone: '21 980 443',
  email: 'anis.bensalem@gmail.tn',
  city: 'أريانة / تونس العاصمة',
  governorate: 'أريانة',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  memberSince: 'سبتمبر 2023',
  totalSavedDT: 142.500,
  directOrdersCount: 18,
  antiGacharaBadge: 'مستهلك وفيّ حليف الفلاحة 🥇',
  deliveryAddress: 'نهج الهادي نويرة، النصر 2، أريانة',
};

export const INITIAL_PRODUCER_SUBSCRIPTIONS: Record<string, ProducerSubscription> = {
  'prod-1': {
    producerId: 'prod-1',
    isSubscribed: true,
    alertFrequency: 'all_harvests',
    notifySound: true,
    notifySMS: true,
    subscribedAt: 'أكتوبر 2023',
    preferredCategories: ['legumes', 'fruits'],
  },
  'prod-2': {
    producerId: 'prod-2',
    isSubscribed: true,
    alertFrequency: 'all_harvests',
    notifySound: true,
    notifySMS: false,
    subscribedAt: 'نوفمبر 2023',
    preferredCategories: ['huiles', 'epicerie'],
  },
  'prod-3': {
    producerId: 'prod-3',
    isSubscribed: false,
    alertFrequency: 'flash_deals_only',
    notifySound: true,
    notifySMS: false,
    subscribedAt: 'جانفي 2024',
    preferredCategories: ['fromages'],
  },
  'prod-4': {
    producerId: 'prod-4',
    isSubscribed: false,
    alertFrequency: 'all_harvests',
    notifySound: false,
    notifySMS: false,
    subscribedAt: 'مارس 2024',
    preferredCategories: ['dattes'],
  },
};

/**
 * Toggles a producer's subscription state and creates one if missing
 */
export function toggleProducerSubscription(
  subscriptions: Record<string, ProducerSubscription>,
  producerId: string
): Record<string, ProducerSubscription> {
  const current = subscriptions[producerId];
  const nextIsSubscribed = current ? !current.isSubscribed : true;

  return {
    ...subscriptions,
    [producerId]: {
      producerId,
      isSubscribed: nextIsSubscribed,
      alertFrequency: current?.alertFrequency || 'all_harvests',
      notifySound: current?.notifySound ?? true,
      notifySMS: current?.notifySMS ?? false,
      subscribedAt: current?.subscribedAt || 'الآن',
      preferredCategories: current?.preferredCategories || ['fruits', 'legumes'],
    },
  };
}

/**
 * Updates detailed subscription preferences for a producer
 */
export function updateSubscriptionSettings(
  subscriptions: Record<string, ProducerSubscription>,
  producerId: string,
  updates: Partial<Omit<ProducerSubscription, 'producerId'>>
): Record<string, ProducerSubscription> {
  const current = subscriptions[producerId] || {
    producerId,
    isSubscribed: true,
    alertFrequency: 'all_harvests',
    notifySound: true,
    notifySMS: false,
    subscribedAt: 'الآن',
  };

  return {
    ...subscriptions,
    [producerId]: {
      ...current,
      ...updates,
    },
  };
}

/**
 * Checks if user is subscribed to notifications for a producer
 */
export function isProducerSubscribed(
  subscriptions: Record<string, ProducerSubscription>,
  producerId: string
): boolean {
  return Boolean(subscriptions[producerId]?.isSubscribed);
}

/**
 * Returns all producers that the user is actively subscribed to
 */
export function getSubscribedProducers(
  producers: Producer[],
  subscriptions: Record<string, ProducerSubscription>
): Producer[] {
  return producers.filter((p) => subscriptions[p.id]?.isSubscribed);
}

/**
 * Returns count of active subscriptions
 */
export function countActiveSubscriptions(
  subscriptions: Record<string, ProducerSubscription>
): number {
  return Object.values(subscriptions).filter((s) => s.isSubscribed).length;
}
