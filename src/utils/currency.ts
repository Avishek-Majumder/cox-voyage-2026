// All source amounts are stored in BDT. USD is display-only. Update BDT_PER_USD when needed.
export const BDT_PER_USD = 122;

export function convertBDTToUSD(amountBDT: number): number {
  return amountBDT / BDT_PER_USD;
}

/**
 * Formats a BDT amount based on the selected currency preference.
 * If currency is 'BDT', it formats it using Bangladeshi locale with no decimal places.
 * If currency is 'USD', it converts the amount and formats it with 2 decimal places.
 */
export function formatTripMoney(
  amountBDT: number,
  options?: { forceCurrency?: 'BDT' | 'USD' }
): string {
  if (process.env.NODE_ENV === 'development') {
    if (amountBDT === undefined || amountBDT === null || isNaN(amountBDT)) {
      console.warn('[Currency Debug] formatTripMoney was given an invalid BDT amount:', amountBDT);
    }
  }

  let activeCurrency: 'BDT' | 'USD' = 'BDT';
  if (options?.forceCurrency) {
    activeCurrency = options.forceCurrency;
  } else {
    try {
      const saved = localStorage.getItem('cox-voyage-currency');
      activeCurrency = saved === 'USD' ? 'USD' : 'BDT';
    } catch {
      activeCurrency = 'BDT';
    }
  }

  if (activeCurrency === 'BDT') {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amountBDT));
  } else {
    const usdAmount = convertBDTToUSD(amountBDT);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usdAmount);
  }
}

// Deprecated fallback for compatibility with existing files
export const formatCurrency = (amountBDT: number, currency: 'BDT' | 'USD'): string => {
  return formatTripMoney(amountBDT, { forceCurrency: currency });
};
