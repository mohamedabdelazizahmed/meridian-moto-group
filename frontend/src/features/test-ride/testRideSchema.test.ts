import { describe, it, expect } from 'vitest';
import { testRideSchema } from './testRideSchema';

describe('testRideSchema', () => {
  it('accepts valid input with future date', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateStr = futureDate.toISOString().split('T')[0];

    const result = testRideSchema.safeParse({
      name: 'Sheikh Hamdan',
      phone: '+971500000000',
      email: 'vip@meridianmoto.ae',
      preferred_date: dateStr,
      motorcycle: 'apex-rs-900',
      website: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects a date in the past', () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    const dateStr = pastDate.toISOString().split('T')[0];

    const result = testRideSchema.safeParse({
      name: 'Sheikh Hamdan',
      phone: '+971500000000',
      email: 'vip@meridianmoto.ae',
      preferred_date: dateStr,
      motorcycle: 'apex-rs-900',
      website: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('preferred_date'))).toBe(true);
    }
  });

  it('rejects an invalid email', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateStr = futureDate.toISOString().split('T')[0];

    const result = testRideSchema.safeParse({
      name: 'Sheikh Hamdan',
      phone: '+971500000000',
      email: 'not-an-email',
      preferred_date: dateStr,
      motorcycle: 'apex-rs-900',
      website: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(i => i.path.includes('email'))).toBe(true);
    }
  });
});
