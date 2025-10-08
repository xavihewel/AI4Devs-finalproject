import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    env: {
      keycloakUrl: 'http://localhost:8080',
      keycloakRealm: 'covoituraje',
      apiUrl: 'http://localhost:8081',
    },
    
    // Retry failed tests
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Timeouts (reducidos para ejecución más rápida)
    defaultCommandTimeout: 6000,
    pageLoadTimeout: 15000,
    requestTimeout: 8000,
    
    // Experimental features
    experimentalOriginDependencies: true,
  },
})
