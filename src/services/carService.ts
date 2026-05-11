import { initialCars } from '../data/cars';
import { Car, CarStatus } from '../types/car';
import {
  SUPABASE_URL,
  getSupabaseHeaders,
  isSupabaseConfigured,
} from './supabaseConfig';

let carsCache: Car[] = [...initialCars];

function normalizeCar(id: string, data: Partial<Car>): Car {
  return {
    id,
    name: data.name ?? '',
    brand: data.brand ?? '',
    year: Number(data.year ?? 0),
    price: Number(data.price ?? 0),
    engine: data.engine ?? '',
    acceleration: data.acceleration ?? '',
    status: (data.status as CarStatus | undefined) ?? 'available',
    description: data.description ?? '',
    imageUrl: data.imageUrl ?? undefined,
  };
}

function getFallbackCars() {
  carsCache = [...initialCars];
  return [...carsCache];
}

async function fetchCarsFromSupabase(): Promise<Car[] | null> {
  if (!isSupabaseConfigured) {
    return null;
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/cars?select=*&order=brand.asc,name.asc`,
      {
        method: 'GET',
        headers: getSupabaseHeaders(),
      }
    );

    if (!response.ok) {
      return null;
    }

    const rows = (await response.json()) as Partial<Car>[];

    if (rows.length === 0) {
      return [];
    }

    return rows.map((item) => normalizeCar(String(item.id ?? ''), item));
  } catch {
    return null;
  }
}

export const carService = {
  async listCars(): Promise<Car[]> {
    const remoteCars = await fetchCarsFromSupabase();

    if (remoteCars === null) {
      return [...carsCache];
    }

    if (remoteCars.length === 0) {
      return getFallbackCars();
    }

    carsCache = remoteCars;
    return [...carsCache];
  },

  async getById(id: string): Promise<Car | undefined> {
    if (isSupabaseConfigured) {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/cars?id=eq.${encodeURIComponent(
            id
          )}&select=*`,
          {
            method: 'GET',
            headers: getSupabaseHeaders(),
          }
        );

        if (response.ok) {
          const rows = (await response.json()) as Partial<Car>[];
          const row = rows[0];

          if (row) {
            const car = normalizeCar(String(row.id ?? id), row);
            const index = carsCache.findIndex((item) => item.id === id);

            if (index >= 0) {
              carsCache[index] = car;
            } else {
              carsCache.push(car);
            }

            return car;
          }
        }
      } catch {
        // Fallback below.
      }
    }

    return carsCache.find((car) => car.id === id);
  },

  async addCar(car: Omit<Car, 'id'>): Promise<Car> {
    try {
      if (isSupabaseConfigured) {
        const newCarId = Date.now().toString();
        const response = await fetch(`${SUPABASE_URL}/rest/v1/cars`, {
          method: 'POST',
          headers: {
            ...getSupabaseHeaders(),
            Prefer: 'return=representation',
          },
          body: JSON.stringify({
            ...car,
            id: newCarId,
          }),
        });

        if (response.ok) {
          const rows = (await response.json()) as Partial<Car>[];
          const created = rows[0];
          const newCar = normalizeCar(String(created?.id ?? newCarId), {
            ...car,
            ...created,
          });
          carsCache.push(newCar);
          return newCar;
        }
      }
    } catch {
      // Fallback below.
    }

    const newCar: Car = { ...car, id: Date.now().toString() };
    carsCache.push(newCar);
    return newCar;
  },

  async updateCar(id: string, updates: Partial<Car>): Promise<Car | null> {
    const current = carsCache.find((car) => car.id === id);

    if (!current) {
      const loaded = await carService.getById(id);
      if (!loaded) {
        return null;
      }
    }

    const latest = carsCache.find((car) => car.id === id);
    if (!latest) {
      return null;
    }

    const updatedCar: Car = { ...latest, ...updates, id };

    try {
      if (isSupabaseConfigured) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/cars?id=eq.${encodeURIComponent(id)}`,
          {
            method: 'PATCH',
            headers: {
              ...getSupabaseHeaders(),
              Prefer: 'return=minimal',
            },
            body: JSON.stringify(updates),
          }
        );
      }
    } catch {
      // Keep local cache updated even if Firestore fails.
    }

    carsCache = carsCache.map((car) => (car.id === id ? updatedCar : car));
    return updatedCar;
  },

  async deleteCar(id: string): Promise<boolean> {
    try {
      if (isSupabaseConfigured) {
        await fetch(
          `${SUPABASE_URL}/rest/v1/cars?id=eq.${encodeURIComponent(id)}`,
          {
            method: 'DELETE',
            headers: {
              ...getSupabaseHeaders(),
              Prefer: 'return=minimal',
            },
          }
        );
      }
    } catch {
      // Keep local deletion as fallback.
    }

    const before = carsCache.length;
    carsCache = carsCache.filter((car) => car.id !== id);
    return carsCache.length < before;
  },

  async updateStatus(id: string, status: CarStatus): Promise<Car | null> {
    return carService.updateCar(id, { status });
  },
};
