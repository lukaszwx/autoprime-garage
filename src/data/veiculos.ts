import { Veiculo } from '../types/veiculo';

export const veiculosIniciais: Veiculo[] = [
  {
    id: '1',
    nome: 'Chiron Super Sport',
    marca: 'Bugatti',
    ano: 2023,
    preco: 28900000,
    motor: 'W16 8.0L Quad-Turbo',
    aceleracao: '2.4s 0-100km/h',
    status: 'available',
    descricao:
      'Uma das máquinas mais exclusivas já produzidas pela Bugatti. O Chiron Super Sport combina velocidade extrema, acabamento artesanal e engenharia de hipercarro em um pacote absolutamente brutal.',
    imagem:
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
  },

  {
    id: '2',
    nome: '911 GT3 RS',
    marca: 'Porsche',
    ano: 2024,
    preco: 1650000,
    motor: 'Flat-6 4.0L Aspirado',
    aceleracao: '3.2s 0-100km/h',
    status: 'reserved',
    descricao:
      'Projetado para pista e refinado para estrada. O GT3 RS entrega aerodinâmica ativa, precisão cirúrgica e uma das experiências mais puras da Porsche moderna.',
    imagem:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
  },

  {
    id: '3',
    nome: 'F8 Tributo',
    marca: 'Ferrari',
    ano: 2022,
    preco: 2100000,
    motor: 'V8 3.9L Twin-Turbo',
    aceleracao: '2.9s 0-100km/h',
    status: 'available',
    descricao:
      'Com 720cv e assinatura sonora marcante, o F8 Tributo representa a evolução definitiva do V8 biturbo da Ferrari. Performance absurda com elegância italiana.',
    imagem:
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80',
  },

  {
    id: '4',
    nome: 'DB12',
    marca: 'Aston Martin',
    ano: 2024,
    preco: 1980000,
    motor: 'V8 4.0L Twin-Turbo',
    aceleracao: '3.6s 0-100km/h',
    status: 'available',
    descricao:
      'Luxo britânico elevado ao extremo. O Aston Martin DB12 entrega acabamento artesanal, presença sofisticada e potência refinada para viagens de alto desempenho.',
    imagem:
      'https://images.unsplash.com/photo-1617531653332-bd46c16f4d68?w=1200&q=80',
  },

  {
    id: '5',
    nome: 'Camaro ZL1',
    marca: 'Chevrolet',
    ano: 2023,
    preco: 890000,
    motor: 'V8 6.2L Supercharged',
    aceleracao: '3.5s 0-100km/h',
    status: 'sold',
    descricao:
      'O lado mais agressivo da Chevrolet. O Camaro ZL1 combina visual intimidador, ronco visceral e potência americana em um muscle car construído para entregar emoção pura.',
    imagem:
      'https://images.unsplash.com/photo-1562911791-c7a97b729ec5?w=1200&q=80',
  },

  {
    id: '6',
    nome: 'Huracán Tecnica',
    marca: 'Lamborghini',
    ano: 2024,
    preco: 2450000,
    motor: 'V10 5.2L Aspirado',
    aceleracao: '3.2s 0-100km/h',
    status: 'available',
    descricao:
      'A combinação perfeita entre brutalidade e precisão. O Huracán Tecnica entrega comportamento afiado em curvas e um dos motores aspirados mais emocionantes da atualidade.',
    imagem:
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&q=80',
  },

  {
    id: '7',
    nome: 'McLaren 765LT',
    marca: 'McLaren',
    ano: 2023,
    preco: 3200000,
    motor: 'V8 4.0L Twin-Turbo',
    aceleracao: '2.8s 0-100km/h',
    status: 'available',
    descricao:
      'Construído para máxima performance. O 765LT é leve, brutal e extremamente responsivo, trazendo a essência de pista da McLaren para as ruas.',
    imagem:
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
  },
];