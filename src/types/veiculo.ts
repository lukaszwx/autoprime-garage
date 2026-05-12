export type StatusVeiculo = 'available' | 'reserved' | 'sold';

export interface Veiculo {
  id: string;
  nome: string;
  marca: string;
  ano: number;
  preco: number;
  motor: string;
  aceleracao: string;
  status: StatusVeiculo;
  descricao: string;
  imagem?: string;
  createdAt?: string;
}
