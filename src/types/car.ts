export type CarStatus = 'available' | 'reserved' | 'sold';

export interface Car {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  engine: string;
  acceleration: string;
  status: CarStatus;
  description: string;
  imageUrl?: string;
}
