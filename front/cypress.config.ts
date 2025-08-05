import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://161.97.116.21',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
    },
  },
});