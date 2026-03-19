export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  document?: string;
  sendDate?: string;
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  document: string;
  logo: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface QuoteItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Quote {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  shipping?: number;
  total: number;
  status: 'Rascunho' | 'Enviado' | 'Aprovado' | 'Rejeitado';
  notes: string;
}
