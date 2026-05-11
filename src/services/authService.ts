import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_STORAGE_KEY = '@autoprime/users';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

async function readUsers(): Promise<AppUser[]> {
  try {
    const storedUsers = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (!storedUsers) {
      return [];
    }

    const parsedUsers = JSON.parse(storedUsers) as AppUser[];
    return Array.isArray(parsedUsers) ? parsedUsers : [];
  } catch {
    return [];
  }
}

async function writeUsers(users: AppUser[]) {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch {
    // Ignore persistence failures to keep the UI responsive.
  }
}

export const authService = {
  async register(data: Omit<AppUser, 'id'>): Promise<{ user?: AppUser; error?: string }> {
    const users = await readUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    const alreadyExists = users.some((user) => user.email.toLowerCase() === normalizedEmail);
    if (alreadyExists) {
      return { error: 'Este e-mail já está cadastrado.' };
    }

    const user: AppUser = {
      id: Date.now().toString(),
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
    };

    users.push(user);
    await writeUsers(users);

    return { user };
  },

  async login(email: string, password: string): Promise<{ user?: AppUser; error?: string }> {
    const users = await readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      return { error: 'E-mail ou senha inválidos.' };
    }

    return { user };
  },
};
