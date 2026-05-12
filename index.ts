import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

const APP_NAME = 'AUTOPRIME';

function logBootstrap(message: string, payload?: unknown) {
  if (__DEV__) {
    console.log(`[${APP_NAME}] ${message}`, payload ?? '');
  }
}

function bootstrap() {
  try {
    logBootstrap('Starting application');

    registerRootComponent(App);

    logBootstrap('Application ready');
  } catch (error) {
    console.error(`[${APP_NAME}] Bootstrap error`, error);
  }
}

bootstrap();