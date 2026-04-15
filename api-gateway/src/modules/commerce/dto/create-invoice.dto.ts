export interface CreateInvoiceDto {
  customer_id: string;
  amount: number;
  currency?: string;
}

export interface UpdateInvoiceDto {
  amount?: number;
  currency?: string;
}
