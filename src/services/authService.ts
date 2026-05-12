import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_STORAGE_KEY = '@autoprime/users';
const SESSION_STORAGE_KEY = '@autoprime/session';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

type AuthResult = {
  user?: PublicUser;
  error?: string;
};

function sanitizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ');
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password: string) {
  return password.length >= 6;
}

function toPublicUser(user: AppUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function hashPassword(password: string): Promise<string> {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function readUsers(): Promise<AppUser[]> {
  try {
    const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);

    if (!storedUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(storedUsers);

    if (!Array.isArray(parsedUsers)) {
      return [];
    }

    return parsedUsers.filter((user): user is AppUser => {
      return (
        typeof user.id === 'string' &&
        typeof user.name === 'string' &&
        typeof user.email === 'string' &&
        typeof user.passwordHash === 'string' &&
        typeof user.createdAt === 'string'
      );
    });
  } catch (error) {
    console.log('READ USERS ERROR:', error);
    return [];
  }
}

async function writeUsers(users: AppUser[]): Promise<boolean> {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.log('WRITE USERS ERROR:', error);
    return false;
  }
}

async function saveSession(user: PublicUser): Promise<void> {
  await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
}

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    const name = sanitizeName(data.name);
    const email = normalizeEmail(data.email);
    const password = data.password.trim();

    if (name.length < 2) {
      return { error: 'Informe um nome válido.' };
    }

    if (!isValidEmail(email)) {
      return { error: 'Informe um e-mail válido.' };
    }

    if (!isStrongPassword(password)) {
      return { error: 'A senha precisa ter pelo menos 6 caracteres.' };
    }

    const users = await readUsers();

    const alreadyExists = users.some((user) => user.email === email);

    if (alreadyExists) {
      return { error: 'Este e-mail já está cadastrado.' };
    }

    const passwordHash = await hashPassword(password);

    const user: AppUser = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    const saved = await writeUsers([...users, user]);

    if (!saved) {
      return { error: 'Não foi possível salvar o usuário.' };
    }

    const publicUser = toPublicUser(user);

    await saveSession(publicUser);

    return { user: publicUser };
  },

  async login(emailInput: string, passwordInput: string): Promise<AuthResult> {
    const email = normalizeEmail(emailInput);
    const password = passwordInput.trim();

    if (!isValidEmail(email)) {
      return { error: 'Informe um e-mail válido.' };
    }

    if (!password) {
      return { error: 'Informe sua senha.' };
    }

    const users = await readUsers();
    const passwordHash = await hashPassword(password);

    const user = users.find(
      (item) => item.email === email && item.passwordHash === passwordHash
    );

    if (!user) {
      return { error: 'E-mail ou senha inválidos.' };
    }

    const publicUser = toPublicUser(user);

    await saveSession(publicUser);

    return { user: publicUser };
  },

  async getSession(): Promise<PublicUser | null> {
    try {
      const session = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

      if (!session) {
        return null;
      }

      const parsedSession = JSON.parse(session) as PublicUser;

      if (
        !parsedSession.id ||
        !parsedSession.email ||
        !parsedSession.name
      ) {
        return null;
      }

      return parsedSession;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  },
};