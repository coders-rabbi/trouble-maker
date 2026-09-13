export interface IProduct {
  _id?: string;
  name: string;
  category?: string;
  price: number;
  sizes?: string[];
  images?: string[];
  stock?: number;
  description?: string;
}