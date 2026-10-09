import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestRideForm from './TestRideForm';
import Providers from '@/components/Providers';

const mockMotorcycles = [
  { name: 'Apex RS 900', slug: 'apex-rs-900', price_from: 148000, brand: { name: 'Apex', slug: 'apex' } },
];

describe('TestRideForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('ensures the honeypot is hidden and not focusable', () => {
    render(
      <Providers>
        <TestRideForm motorcycles={mockMotorcycles} />
      </Providers>
    );

    const honeypot = screen.getByLabelText(/website/i, { selector: 'input' });
    expect(honeypot).toHaveAttribute('tabIndex', '-1');
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot.closest('div')).toHaveClass('hidden');
  });

  it('displays field errors from a mocked HTTP 422 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          message: 'The given data was invalid.',
          errors: { email: ['The email has already been taken.'] },
        }),
      })
    );

    const user = userEvent.setup();
    render(
      <Providers>
        <TestRideForm motorcycles={mockMotorcycles} />
      </Providers>
    );

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const dateStr = futureDate.toISOString().split('T')[0];

    await user.type(screen.getByLabelText(/full name/i), 'Sheikh Hamdan');
    await user.type(screen.getByLabelText(/phone number/i), '+971500000000');
    await user.type(screen.getByLabelText(/email address/i), 'taken@meridianmoto.ae');
    await user.type(screen.getByLabelText(/preferred date/i), dateStr);

    await user.click(screen.getByRole('button', { name: /submit test ride request/i }));

    await waitFor(() => {
      expect(screen.getByText(/the email has already been taken/i)).toBeInTheDocument();
    });
  });

  it('displays success message after mocked HTTP 201 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({ message: 'Created successfully' }),
      })
    );

    const user = userEvent.setup();
    render(
      <Providers>
        <TestRideForm motorcycles={mockMotorcycles} />
      </Providers>
    );

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const dateStr = futureDate.toISOString().split('T')[0];

    await user.type(screen.getByLabelText(/full name/i), 'Sheikh Hamdan');
    await user.type(screen.getByLabelText(/phone number/i), '+971500000000');
    await user.type(screen.getByLabelText(/email address/i), 'vip@meridianmoto.ae');
    await user.type(screen.getByLabelText(/preferred date/i), dateStr);

    await user.click(screen.getByRole('button', { name: /submit test ride request/i }));

    await waitFor(() => {
      expect(screen.getByText(/successfully submitted/i)).toBeInTheDocument();
    });
  });
});
