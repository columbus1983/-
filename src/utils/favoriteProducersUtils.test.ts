import test from 'node:test';
import assert from 'node:assert/strict';
import {
  toggleProducerSubscription,
  updateSubscriptionSettings,
  isProducerSubscribed,
  getSubscribedProducers,
  countActiveSubscriptions,
  INITIAL_PRODUCER_SUBSCRIPTIONS,
} from './favoriteProducersUtils';
import { Producer } from '../types';

const mockProducers: Producer[] = [
  {
    id: 'prod-1',
    name: 'عمّ سالم العكاري',
    role: 'فلاّح خضروات',
    farmName: 'سانية وادي الرمل',
    photo: '',
    avatar: '',
    story: '',
    location: 'نابل',
    governorate: 'نابل',
    distanceKm: 3.2,
    coordinates: { xPercent: 42, yPercent: 38 },
    address: 'نابل',
    specialties: ['طماطم'],
    phone: '98 450 120',
    voiceNote: '',
    openSlots: [],
    sinceYear: 1992,
    trustScore: 99,
  },
  {
    id: 'prod-2',
    name: 'خالتي فاطمة السعيدي',
    role: 'منتجة زيت زيتون',
    farmName: 'ضيعة وادي الزيتون',
    photo: '',
    avatar: '',
    story: '',
    location: 'سيدي بوزيد',
    governorate: 'سيدي بوزيد',
    distanceKm: 5.5,
    coordinates: { xPercent: 65, yPercent: 55 },
    address: 'سيدي بوزيد',
    specialties: ['زيت زيتون'],
    phone: '24 880 340',
    voiceNote: '',
    openSlots: [],
    sinceYear: 2005,
    trustScore: 98,
  },
  {
    id: 'prod-3',
    name: 'الحبيب البجاوي',
    role: 'أجبان تقليدية',
    farmName: 'مزرعة ربوع باجة',
    photo: '',
    avatar: '',
    story: '',
    location: 'باجة',
    governorate: 'باجة',
    distanceKm: 6.8,
    coordinates: { xPercent: 28, yPercent: 30 },
    address: 'باجة',
    specialties: ['جبن'],
    phone: '52 110 990',
    voiceNote: '',
    openSlots: [],
    sinceYear: 2012,
    trustScore: 99,
  },
];

test('toggleProducerSubscription toggles isSubscribed state correctly', () => {
  const initial = { ...INITIAL_PRODUCER_SUBSCRIPTIONS };
  assert.equal(isProducerSubscribed(initial, 'prod-1'), true);

  // Toggle off
  const updated1 = toggleProducerSubscription(initial, 'prod-1');
  assert.equal(isProducerSubscribed(updated1, 'prod-1'), false);

  // Toggle back on
  const updated2 = toggleProducerSubscription(updated1, 'prod-1');
  assert.equal(isProducerSubscribed(updated2, 'prod-1'), true);

  // Toggle brand new producer
  const updated3 = toggleProducerSubscription(updated2, 'prod-new');
  assert.equal(isProducerSubscribed(updated3, 'prod-new'), true);
});

test('updateSubscriptionSettings updates specific preferences', () => {
  const initial = { ...INITIAL_PRODUCER_SUBSCRIPTIONS };
  const updated = updateSubscriptionSettings(initial, 'prod-1', {
    alertFrequency: 'flash_deals_only',
    notifySMS: false,
    notifySound: false,
  });

  assert.equal(updated['prod-1'].alertFrequency, 'flash_deals_only');
  assert.equal(updated['prod-1'].notifySMS, false);
  assert.equal(updated['prod-1'].notifySound, false);
  assert.equal(updated['prod-1'].isSubscribed, true);
});

test('getSubscribedProducers and countActiveSubscriptions work properly', () => {
  const initial = { ...INITIAL_PRODUCER_SUBSCRIPTIONS };
  const subscribed = getSubscribedProducers(mockProducers, initial);

  // prod-1 and prod-2 are initial true
  assert.equal(subscribed.length, 2);
  assert.equal(subscribed[0].id, 'prod-1');
  assert.equal(subscribed[1].id, 'prod-2');

  const count = countActiveSubscriptions(initial);
  assert.equal(count, 2);
});
