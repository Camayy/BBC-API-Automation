import { defineConfig } from '@playwright/test';

export default defineConfig({
    reporter: [
        ['list'],  // Default console output
        ['html', { outputFolder: 'test-results/html-report' }],
        ['junit', { outputFile: 'test-results/results.xml' }]  
      ],
  use: {
    baseURL: 'https://web-cdn.api.bbci.co.uk',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer TOKEN' 
    },
    trace: 'on', 
    screenshot: 'only-on-failure' 
  }
});