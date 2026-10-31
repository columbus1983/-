import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePriceBreakdown, calculateCartTotals, formatDT } from './pricing';
import { Product } from '../types';

test('calculatePriceBreakdown properly calculates Tunisian citizen savings and farmer gains', () => {
  // Direct price: 2.500 DT, Market estimated with middleman: 5.000 DT
  const breakdown = calculatePriceBreakdown(2.500, 5.000);

  assert.equal(breakdown.directPrice, 2.500);
  assert.equal(breakdown.supermarketPrice, 5.000);
  assert.equal(breakdown.citizenSavingsAmount, 2.500);
  assert.equal(breakdown.citizenSavingsPercent, 50);
  assert.equal(breakdown.supermarketFarmerShare, 1.100);
  assert.equal(breakdown.farmerDirectShare, 2.375);
  assert.ok(breakdown.farmerGainPercent > 100);
});

test('calculateCartTotals calculates aggregate savings in DT', () => {
  const dummyProduct1: Product = {
    id: 'p1',
    producerId: 'prod1',
    farmName: 'سانية عمّ سالم',
    name: 'طماطم حقلية شمسية',
    category: 'legumes',
    priceDirect: 1.500,
    priceSupermarketEstimated: 3.500,
    unit: 'للكيلوغرام',
    stock: 50,
    initialStock: 50,
    harvestDate: 'صباح اليوم مع الفجر',
    qualityLabels: ['طبيعي 100%'],
    image: '',
    galleryImages: [],
    description: '',
    farmDistanceKm: 3.5,
    governorate: 'نابل',
    rating: 4.9,
    reviewsCount: 12,
    likesCount: 20,
    isAvailableToday: true,
  };

  const cart = [
    { product: dummyProduct1, quantity: 2 }, // Direct: 3.000 DT, Market: 7.000 DT
  ];

  const totals = calculateCartTotals(cart, 10); // 10% coupon
  assert.equal(totals.subtotalDirect, 3.000);
  assert.equal(totals.subtotalSupermarket, 7.000);
  assert.equal(totals.discountAmount, 0.300);
  assert.equal(totals.totalDirect, 2.700);
  assert.equal(totals.totalCitizenSavings, 4.300);
});

test('formatDT formats Tunisian dinars with 3 millimes decimals', () => {
  const formatted = formatDT(2.5);
  assert.equal(formatted, '2.500 د.ت');
});
