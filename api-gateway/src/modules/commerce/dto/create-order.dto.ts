export interface OrderItemDto {
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface CreateOrderDto {
  customer_id: string;
  items: OrderItemDto[];
  total_amount: number;
}

export interface UpdateOrderDto {
  items?: OrderItemDto[];
  total_amount?: number;
}
