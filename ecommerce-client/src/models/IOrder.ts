export interface IOrderItem {
  id?: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface IOrder {
  id: number;
  customer_id: number;
  total_price: number;
  payment_status: 'paid' | 'unpaid';
  payment_id?: string | null;
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  order_items: IOrderItem[];
}

export type OrderCreate = Pick<
  IOrder,
  'customer_id' | 'payment_status' | 'payment_id' | 'order_status'
> & {
  order_items: Pick<
    IOrderItem,
    'product_id' | 'product_name' | 'quantity' | 'unit_price'
  >[];
};

export type OrderUpdate = Pick<
  IOrder,
  'payment_status' | 'payment_id' | 'order_status'
>;
