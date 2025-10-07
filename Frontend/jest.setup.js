require('@testing-library/jest-dom');

// Polyfills for jsdom environment
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Ensure test env
process.env.NODE_ENV = 'test';

// Mock ESM-only keycloak-js to avoid transform issues in Jest
jest.mock('keycloak-js', () => {
  return function Keycloak() {
    return {
      init: jest.fn().mockResolvedValue(false),
      updateToken: jest.fn().mockResolvedValue(false),
      login: jest.fn(),
      logout: jest.fn(),
      token: undefined,
    };
  };
});
