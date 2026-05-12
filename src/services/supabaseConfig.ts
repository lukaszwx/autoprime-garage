type SupabaseHeaders = {
  apikey: string;
  Authorization: string;
  'Content-Type': string;
};

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ||
  'https://wyksfsarrjgmvhouloap.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  'sb_publishable_JsvB9aiu1YZ1AG8QbsLPnw_ytLjbcV_';

function validarSupabaseConfig() {
  const erros: string[] = [];

  if (!SUPABASE_URL) {
    erros.push('SUPABASE_URL não definida');
  }

  if (!SUPABASE_ANON_KEY) {
    erros.push('SUPABASE_ANON_KEY não definida');
  }

  try {
    new URL(SUPABASE_URL);
  } catch {
    erros.push('SUPABASE_URL inválida');
  }

  if (
    SUPABASE_ANON_KEY &&
    !SUPABASE_ANON_KEY.startsWith('sb_publishable_')
  ) {
    erros.push('SUPABASE_ANON_KEY inválida');
  }

  return {
    valido: erros.length === 0,
    erros,
  };
}

const validacao = validarSupabaseConfig();

export const isSupabaseConfigured = validacao.valido;

if (!validacao.valido) {
  console.warn('SUPABASE CONFIG ERROR');
  console.warn(validacao.erros);
} else {
  console.log('SUPABASE CONFIG OK');
}

export function getSupabaseHeaders(): SupabaseHeaders {
  if (!isSupabaseConfigured) {
    throw new Error(
      `Supabase não configurado corretamente: ${validacao.erros.join(', ')}`
    );
  }

  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function testarConexaoSupabase() {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: validacao.erros.join(', '),
    };
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/`,
      {
        method: 'GET',
        headers: getSupabaseHeaders(),
      }
    );

    return {
      success: response.ok,
      status: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Erro desconhecido',
    };
  }
}

export {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
};