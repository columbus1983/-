import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHarvestNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  countUnreadNotifications,
  INITIAL_NOTIFICATIONS,
} from './notificationUtils';
import { Producer, Product } from '../types';

test('createHarvestNotification builds a valid notification object', () => {
  const dummyProducer: Producer = {
    id: 'prod-1',
    name: 'عم سالم',
    role: 'فلاح',
    farmName: 'سانية وادي الرمل',
    photo: '',
    avatar: 'avatar.jpg',
    story: '',
    location: 'نابل',
    governorate: 'نابل',
    distanceKm: 3,
    coordinates: { xPercent: 50, yPercent: 50 },
    address: 'نابل',
    specialties: [],
    phone: '98000000',
    voiceNote: '',
    openSlots: [],
    sinceYear: 1990,
    trustScore: 99,
  };

  const dummyProduct: Product = {
    id: 'p-new',
    producerId: 'prod-1',
    farmName: 'سانية وادي الرمل',
    name: 'مشمش بلدي شامي',
    category: 'fruits',
    priceDirect: 2.200,
    priceSupermarketEstimated: 5.000,
    unit: 'للكيلوغرام',
    stock: 30,
    initialStock: 30,
    harvestDate: 'اليوم',
    qualityLabels: ['طبيعي'],
    image: 'mishmish.jpg',
    galleryImages: [],
    description: 'مشمش حلو سكر',
    farmDistanceKm: 3,
    governorate: 'نابل',
    rating: 5,
    reviewsCount: 1,
    likesCount: 1,
    isAvailableToday: true,
  };

  const notif = createHarvestNotification(dummyProducer, dummyProduct);

  assert.equal(notif.producerId, 'prod-1');
  assert.equal(notif.producerName, 'عم سالم');
  assert.equal(notif.productId, 'p-new');
  assert.equal(notif.productName, 'مشمش بلدي شامي');
  assert.equal(notif.isRead, false);
  assert.ok(notif.message.includes('عم سالم'));
  assert.ok(notif.message.includes('مشمش بلدي شامي'));
});

test('markNotificationAsRead and countUnreadNotifications work correctly', () => {
  const unreadCountInitial = countUnreadNotifications(INITIAL_NOTIFICATIONS);
  assert.equal(unreadCountInitial, 2);

  const updated = markNotificationAsRead(INITIAL_NOTIFICATIONS, 'notif-1');
  assert.equal(countUnreadNotifications(updated), 1);

  const allRead = markAllNotificationsAsRead(INITIAL_NOTIFICATIONS);
  assert.equal(countUnreadNotifications(allRead), 0);
});
