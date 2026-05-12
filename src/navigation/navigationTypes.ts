export type RootStackParamList = {
  // Auth
  Login: undefined;
  Register: undefined;

  // Main
  Home: undefined;
  Settings: undefined;

  // Vehicles
  CarDetails: {
    carId: string;
  };

  AddCar: undefined;

  EditCar: {
    carId: string;
  };

  // Future-proof
  Favorites: undefined;

  Profile: {
    userId?: string;
  };

  Search: {
    query?: string;
  };

  VehicleGallery: {
    carId: string;
    initialIndex?: number;
  };
};