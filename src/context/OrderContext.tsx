import React, { createContext, ReactNode } from 'react';
import { useStateWithStorage } from '../hooks/useStateWithStorage';

type OrderContextType = {
  subTotal: number;
  totalQuantity: number;
  setOrderDetails: (order: { subTotal: number, totalQuantity: number }) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subTotal, setSubTotal] = useStateWithStorage<number>('subTotal', 0);
  const [totalQuantity, setTotalQuantity] = useStateWithStorage<number>('totalQuantity', 0);
  
  const setOrderDetails = (order: { subTotal: number, totalQuantity: number }) => {
    setSubTotal(order.subTotal);
    setTotalQuantity(order.totalQuantity);
  };

  return (
    <OrderContext.Provider value={{ subTotal, totalQuantity, setOrderDetails }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = React.useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
