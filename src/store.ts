import { useState, useEffect } from 'react';
import { Customer, Product, Quote, Company } from './types';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function useAppStore() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>('customers', []);
  const [products, setProducts] = useLocalStorage<Product[]>('products', []);
  const [quotes, setQuotes] = useLocalStorage<Quote[]>('quotes', []);
  const [company, setCompany] = useLocalStorage<Company>('company', {
    name: '',
    email: '',
    phone: '',
    address: '',
    document: '',
    logo: '',
  });

  return {
    customers,
    setCustomers,
    products,
    setProducts,
    quotes,
    setQuotes,
    company,
    setCompany,
  };
}
