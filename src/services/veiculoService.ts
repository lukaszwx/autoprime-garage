import { veiculosIniciais } from '../data/veiculos';
import { StatusVeiculo, Veiculo } from '../types/veiculo';
import {
  SUPABASE_URL,
  getSupabaseHeaders,
  isSupabaseConfigured,
} from './supabaseConfig';

interface RegistroCarroSupabase {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: number;
  engine: string;
  acceleration: string;
  status: StatusVeiculo;
  image: string | null;
  description: string;
  created_at: string | null;
}

let cacheVeiculos: Veiculo[] = [...veiculosIniciais];

function normalizarVeiculo(registro: RegistroCarroSupabase): Veiculo {
  return {
    id: registro.id,
    nome: registro.name ?? '',
    marca: registro.brand ?? '',
    ano: Number(registro.year ?? 0),
    preco: Number(registro.price ?? 0),
    motor: registro.engine ?? '',
    aceleracao: registro.acceleration ?? '',
    status: registro.status ?? 'available',
    imagem: registro.image ?? undefined,
    descricao: registro.description ?? '',
    createdAt: registro.created_at ?? undefined,
  };
}

function criarPayloadSupabase(veiculo: Partial<Veiculo>) {
  const payload: Partial<RegistroCarroSupabase> = {};

  if (veiculo.nome !== undefined) payload.name = veiculo.nome;
  if (veiculo.marca !== undefined) payload.brand = veiculo.marca;
  if (veiculo.ano !== undefined) payload.year = Number(veiculo.ano);
  if (veiculo.preco !== undefined) payload.price = Number(veiculo.preco);
  if (veiculo.motor !== undefined) payload.engine = veiculo.motor;
  if (veiculo.aceleracao !== undefined) payload.acceleration = veiculo.aceleracao;
  if (veiculo.status !== undefined) payload.status = veiculo.status;
  if (veiculo.imagem !== undefined) payload.image = veiculo.imagem || null;
  if (veiculo.descricao !== undefined) payload.description = veiculo.descricao;

  return payload;
}

async function lerJsonSeguro<T>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function atualizarCache(veiculo: Veiculo) {
  const existe = cacheVeiculos.some((item) => item.id === veiculo.id);

  cacheVeiculos = existe
    ? cacheVeiculos.map((item) => (item.id === veiculo.id ? veiculo : item))
    : [...cacheVeiculos, veiculo];
}

function removerDoCache(id: string) {
  cacheVeiculos = cacheVeiculos.filter((veiculo) => veiculo.id !== id);
}

async function buscarVeiculosNoSupabase(): Promise<Veiculo[] | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/cars?select=*&order=brand.asc,name.asc`,
      {
        method: 'GET',
        headers: getSupabaseHeaders(),
      }
    );

    const result = await lerJsonSeguro<RegistroCarroSupabase[]>(response);

    console.log('SUPABASE LIST STATUS:', response.status);
    console.log('SUPABASE LIST RESULT:', result);

    if (!response.ok || !Array.isArray(result)) {
      return null;
    }

    return result.map(normalizarVeiculo);
  } catch (error) {
    console.log('SUPABASE LIST ERROR:', error);
    return null;
  }
}

export const veiculoService = {
  async listarVeiculos(): Promise<Veiculo[]> {
    const veiculosRemotos = await buscarVeiculosNoSupabase();

    if (veiculosRemotos === null) {
      return [...cacheVeiculos];
    }

    if (veiculosRemotos.length === 0) {
      cacheVeiculos = [...veiculosIniciais];
      return [...cacheVeiculos];
    }

    cacheVeiculos = veiculosRemotos;
    return [...cacheVeiculos];
  },

  async obterVeiculoPorId(id: string): Promise<Veiculo | undefined> {
    if (isSupabaseConfigured) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/cars?id=eq.${encodeURIComponent(id)}&select=*&limit=1`,
          {
            method: 'GET',
            headers: getSupabaseHeaders(),
          }
        );

        const result = await lerJsonSeguro<RegistroCarroSupabase[]>(response);

        console.log('SUPABASE GET STATUS:', response.status);
        console.log('SUPABASE GET RESULT:', result);

        if (response.ok && Array.isArray(result) && result[0]) {
          const veiculo = normalizarVeiculo(result[0]);
          atualizarCache(veiculo);
          return veiculo;
        }
      } catch (error) {
        console.log('SUPABASE GET ERROR:', error);
      }
    }

    return cacheVeiculos.find((veiculo) => veiculo.id === id);
  },

  async adicionarVeiculo(veiculo: Omit<Veiculo, 'id'>): Promise<Veiculo> {
    const payload = criarPayloadSupabase(veiculo);

    if (isSupabaseConfigured) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cars`, {
          method: 'POST',
          headers: {
            ...getSupabaseHeaders(),
            Prefer: 'return=representation',
          },
          body: JSON.stringify(payload),
        });

        const result = await lerJsonSeguro<RegistroCarroSupabase[]>(response);

        console.log('SUPABASE INSERT STATUS:', response.status);
        console.log('SUPABASE INSERT RESULT:', result);

        if (response.ok && Array.isArray(result) && result[0]) {
          const criado = normalizarVeiculo(result[0]);
          atualizarCache(criado);
          return criado;
        }
      } catch (error) {
        console.log('SUPABASE INSERT ERROR:', error);
      }
    }

    const fallback: Veiculo = {
      ...veiculo,
      id: Date.now().toString(),
    };

    atualizarCache(fallback);
    return fallback;
  },

  async atualizarVeiculo(
    id: string,
    atualizacoes: Partial<Veiculo>
  ): Promise<Veiculo | null> {
    const atual =
      cacheVeiculos.find((veiculo) => veiculo.id === id) ??
      (await veiculoService.obterVeiculoPorId(id));

    if (!atual) return null;

    const payload = criarPayloadSupabase(atualizacoes);

    if (Object.keys(payload).length === 0) {
      return atual;
    }

    if (isSupabaseConfigured) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/cars?id=eq.${encodeURIComponent(id)}`,
          {
            method: 'PATCH',
            headers: {
              ...getSupabaseHeaders(),
              Prefer: 'return=representation',
            },
            body: JSON.stringify(payload),
          }
        );

        const result = await lerJsonSeguro<RegistroCarroSupabase[]>(response);

        console.log('SUPABASE UPDATE STATUS:', response.status);
        console.log('SUPABASE UPDATE RESULT:', result);

        if (!response.ok) return null;

        if (Array.isArray(result) && result[0]) {
          const atualizado = normalizarVeiculo(result[0]);
          atualizarCache(atualizado);
          return atualizado;
        }

        const confirmado = await veiculoService.obterVeiculoPorId(id);
        return confirmado ?? null;
      } catch (error) {
        console.log('SUPABASE UPDATE ERROR:', error);
        return null;
      }
    }

    const atualizadoLocal: Veiculo = {
      ...atual,
      ...atualizacoes,
      id,
    };

    atualizarCache(atualizadoLocal);
    return atualizadoLocal;
  },

  async excluirVeiculo(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/cars?id=eq.${encodeURIComponent(id)}`,
          {
            method: 'DELETE',
            headers: {
              ...getSupabaseHeaders(),
              Prefer: 'return=representation',
            },
          }
        );

        const result = await lerJsonSeguro<RegistroCarroSupabase[]>(response);

        console.log('SUPABASE DELETE STATUS:', response.status);
        console.log('SUPABASE DELETE RESULT:', result);

        if (!response.ok) return false;

        if (Array.isArray(result) && result.length === 0) {
          console.log('Nenhum veículo foi encontrado para exclusão.');
          return false;
        }

        removerDoCache(id);
        return true;
      } catch (error) {
        console.log('SUPABASE DELETE ERROR:', error);
        return false;
      }
    }

    const existia = cacheVeiculos.some((veiculo) => veiculo.id === id);

    if (!existia) return false;

    removerDoCache(id);
    return true;
  },

  async atualizarStatusVeiculo(
    id: string,
    status: StatusVeiculo
  ): Promise<Veiculo | null> {
    return veiculoService.atualizarVeiculo(id, { status });
  },
};