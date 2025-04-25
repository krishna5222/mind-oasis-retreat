
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.90c89b1f231c455882adab2da5c72d7f',
  appName: 'mind-oasis-retreat',
  webDir: 'dist',
  server: {
    url: 'https://90c89b1f-231c-4558-82ad-ab2da5c72d7f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      releaseType: 'development'
    }
  }
};

export default config;
