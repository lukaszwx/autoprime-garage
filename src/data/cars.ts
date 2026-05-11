import { Car } from '../types/car';

export const initialCars: Car[] = [
  {
    id: '1',
    name: 'Aventador LP780-4',
    brand: 'Lamborghini',
    year: 2023,
    price: 2890000,
    engine: 'V12 6.5L',
    acceleration: '2.9s 0-100km/h',
    status: 'available',
    description:
      'O último V12 atmosférico da Lamborghini. Uma máquina que combina brutalidade sonora com precisão cirúrgica. Acabamento interior em carbono e couro Alcantara.',
    imageUrl:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
  },
  {
    id: '2',
    name: '911 GT3 RS',
    brand: 'Porsche',
    year: 2024,
    price: 1650000,
    engine: 'Flat-6 4.0L',
    acceleration: '3.2s 0-100km/h',
    status: 'reserved',
    description:
      'Aerodinâmica ativa, suspensão dupla embreagem e o flat-six mais refinado da história da Porsche. Uma experiência de pilotagem que transcende categoria.',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
  },
  {
    id: '3',
    name: 'F8 Tributo',
    brand: 'Ferrari',
    year: 2022,
    price: 2100000,
    engine: 'V8 3.9L Twin-Turbo',
    acceleration: '2.9s 0-100km/h',
    status: 'available',
    description:
      'Homenagem ao melhor motor V8 da história da Ferrari. Potência de 720cv entregues com a suavidade que apenas Maranello é capaz de produzir.',
    imageUrl:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
  },
  {
    id: '4',
    name: 'DB12',
    brand: 'Aston Martin',
    year: 2024,
    price: 1980000,
    engine: 'V8 4.0L Twin-Turbo',
    acceleration: '3.6s 0-100km/h',
    status: 'available',
    description:
      'O super tourer definitivo. Interior artesanal em couro Bridge of Weir, 680cv de potência e um refinamento que apenas poucas marcas no mundo alcançam.',
    imageUrl:
      'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=800&q=80',
  },
  {
    id: '5',
    name: 'Urus Performante',
    brand: 'Lamborghini',
    year: 2023,
    price: 1750000,
    engine: 'V8 4.0L Twin-Turbo',
    acceleration: '3.3s 0-100km/h',
    status: 'sold',
    description:
      'O SUV mais veloz do mundo em produção. Versão Performante com 666cv, 47kg mais leve que o Urus padrão e modos de condução para asfalto, terra e neve.',
    imageUrl:
      'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=800&q=80',
  },
];
