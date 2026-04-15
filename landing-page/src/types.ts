export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
}

export interface Address {
  id?: string;
  customerId: string;
  street: string;
  city: string;
  zip: string;
  country: string;
}

export interface Order {
  id?: string;
  customerId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt?: string;
}

export interface Invoice {
  id?: string;
  orderId: string;
  customerId: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

export interface Project {
  id?: string;
  name: string;
  customerId: string;
  status: 'active' | 'completed' | 'on-hold';
  budget?: number;
}

export type ResourceType = 'customers' | 'addresses' | 'orders' | 'invoices' | 'projects';
