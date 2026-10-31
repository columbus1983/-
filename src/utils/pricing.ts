import { CartItem } from '../types';

export interface PriceBreakdown {
  directPrice: number;
  supermarketPrice: number;
  citizenSavingsAmount: number;
  citizenSavingsPercent: number;
  farmerDirectShare: number;
  supermarketFarmerShare: number;
  farmerGainPercent: number;
  intermediaryCostSupermarket: number;
}

/**
 * Calculates citizen savings and farmer earnings in Tunisia:
 * By eliminating "القشارة" (el gachara) and wholesale market speculators,
 * the Tunisian citizen pays much less and the fellah receives honest pay for his sweat.
 */
export function calculatePriceBreakdown(
  directPrice: number,
  supermarketEstimatedPrice: number
): PriceBreakdown {
  const safeDirect = Math.max(0.1, directPrice);
  const safeSupermarket = Math.max(safeDirect, supermarketEstimatedPrice);

  // In the traditional Tunisian intermediary circuit ("القشارة"),
  // the farmer often receives only 20% to 25% of the end retail price.
  const supermarketFarmerShare = Number((safeSupermarket * 0.22).toFixed(3));
  const intermediaryCostSupermarket = Number((safeSupermarket - supermarketFarmerShare).toFixed(3));

  // In Fellahna direct circuit, 95% goes directly to the fellah:
  const farmerDirectShare = Number((safeDirect * 0.95).toFixed(3));

  // Citizen savings:
  const citizenSavingsAmount = Number((safeSupermarket - safeDirect).toFixed(3));
  const citizenSavingsPercent = Math.round(
    ((safeSupermarket - safeDirect) / safeSupermarket) * 100
  );

  // Farmer income boost:
  const farmerGainPercent = Math.round(
    ((farmerDirectShare - supermarketFarmerShare) / supermarketFarmerShare) * 100
  );

  return {
    directPrice: safeDirect,
    supermarketPrice: safeSupermarket,
    citizenSavingsAmount,
    citizenSavingsPercent: Math.max(0, citizenSavingsPercent),
    farmerDirectShare,
    supermarketFarmerShare,
    farmerGainPercent: Math.max(0, farmerGainPercent),
    intermediaryCostSupermarket,
  };
}

/**
 * Formats amount into Tunisian Dinars (د.ت / DT) with 3 decimals (Millimes)
 * Example: 2.5 -> "2.500 د.ت"
 */
export function formatDT(amount: number): string {
  const fixed = amount.toFixed(3);
  return `${fixed} د.ت`;
}

export interface CartTotals {
  subtotalDirect: number;
  subtotalSupermarket: number;
  discountAmount: number;
  totalDirect: number;
  totalCitizenSavings: number;
  savingsPercentage: number;
  farmerRevenue: number;
}

export function calculateCartTotals(
  items: CartItem[],
  discountPromoPercent: number = 0
): CartTotals {
  const subtotalDirect = items.reduce(
    (sum, item) => sum + item.product.priceDirect * item.quantity,
    0
  );

  const subtotalSupermarket = items.reduce(
    (sum, item) => sum + item.product.priceSupermarketEstimated * item.quantity,
    0
  );

  const safeDiscountPercent = Math.max(0, Math.min(100, discountPromoPercent));
  const discountAmount = (subtotalDirect * safeDiscountPercent) / 100;
  const totalDirect = Math.max(0, subtotalDirect - discountAmount);

  const totalCitizenSavings = Math.max(0, subtotalSupermarket - totalDirect);
  const savingsPercentage =
    subtotalSupermarket > 0
      ? Math.round((totalCitizenSavings / subtotalSupermarket) * 100)
      : 0;

  // 95% straight to Tunisian farmer
  const farmerRevenue = totalDirect * 0.95;

  return {
    subtotalDirect: Number(subtotalDirect.toFixed(3)),
    subtotalSupermarket: Number(subtotalSupermarket.toFixed(3)),
    discountAmount: Number(discountAmount.toFixed(3)),
    totalDirect: Number(totalDirect.toFixed(3)),
    totalCitizenSavings: Number(totalCitizenSavings.toFixed(3)),
    savingsPercentage,
    farmerRevenue: Number(farmerRevenue.toFixed(3)),
  };
}
