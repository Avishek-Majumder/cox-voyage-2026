import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatTripMoney } from '../utils/currency';

export type CurrencyMode = 'BDT' | 'USD';

interface CurrencyContextType {
  currency: 'BDT' | 'USD';
  setCurrency: (currency: 'BDT' | 'USD') => void;
  formatTripMoney: (amountBDT: number, options?: { forceCurrency?: 'BDT' | 'USD' }) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<'BDT' | 'USD'>(() => {
    try {
      const saved = localStorage.getItem('cox-voyage-currency');
      return saved === 'USD' ? 'USD' : 'BDT';
    } catch {
      return 'BDT';
    }
  });

  const setCurrency = (mode: 'BDT' | 'USD') => {
    setCurrencyState(mode);
    try {
      localStorage.setItem('cox-voyage-currency', mode);
      // Optional: Dispatch storage event to notify other instances or force sync
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save currency preference', e);
    }
  };

  // Re-run anytime currency changes to ensure child components have direct updates
  const formatTripMoneyWrapped = (amountBDT: number, options?: { forceCurrency?: 'BDT' | 'USD' }) => {
    return formatTripMoney(amountBDT, {
      forceCurrency: options?.forceCurrency || currency,
    });
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatTripMoney: formatTripMoneyWrapped }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
