import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ionic.pizzapp',
  appName: 'pizzapp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
