export interface ICartItem {
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface ICart {
  items: ICartItem[];
  total_price: number;
}
