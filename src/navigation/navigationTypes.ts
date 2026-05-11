import { Car } from '../types/car';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CarDetails: { carId: string };
  AddCar: undefined;
  Settings: undefined;
};
