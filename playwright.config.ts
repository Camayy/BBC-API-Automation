import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://web-cdn.api.bbci.co.uk',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer TOKEN' 
    }
  }
});