import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.davidsantiago.riccoricco',
  appName: 'pizzapp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
