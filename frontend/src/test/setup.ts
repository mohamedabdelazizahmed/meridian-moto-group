import '@testing-library/jest-dom/vitest';
import { beforeEach, afterEach } from 'vitest';

const originalError = console.error;
beforeEach(() => {
  console.error = (...args: unknown[]) => {
    const message = args.map(arg => String(arg)).join(' ');
    if (message.includes('unique "key"') || message.includes('hydrat')) {
      originalError(...args);
      throw new Error(`Console error failed test due to key or hydration warning: ${message}`);
    }
    originalError(...args);
  };
});

afterEach(() => {
  console.error = originalError;
});
