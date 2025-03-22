export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  created_at: string;
}

export type ProductCreate = Pick<
  IProduct,
  'name' | 'description' | 'price' | 'stock' | 'category' | 'image'
>;

export type ProductUpdate = Pick<
  IProduct,
  'name' | 'description' | 'price' | 'stock' | 'category' | 'image'
>;
