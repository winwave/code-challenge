import { vi, describe, expect, it, beforeEach } from "vitest";
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import type {Token} from "../../hooks/useGetTokens/api.ts";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import SwapForm, {SWAP_ICON} from "./index.tsx";
import useGetTokens from "../../hooks/useGetTokens";

const mockTokens: Token[] = [
  {
    currency: 'ETH',
    price: 2000,
    date: new Date("2023-08-29T07:10:40.000Z"),
    iconUrl: '/eth.svg',
  },
  {
    currency: 'BTC',
    price: 40000,
    date: new Date("2023-08-29T07:10:40.000Z"),
    iconUrl: '/btc.svg',
  },
  {
    currency: 'USD',
    price: 1,
    date: new Date("2023-08-29T07:10:40.000Z"),
    iconUrl: '/usd.svg',
  }
];

vi.mock('../../hooks/useGetTokens');

describe('SwapForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetTokens).mockReturnValue({
      data: mockTokens,
      isLoading: false,
      error: null,
    });
  });
  function renderComponent() {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <SwapForm />
      </QueryClientProvider>
    )
  }

  it('should render form after tokens are loaded', async () => {
    renderComponent()

    expect(await screen.findByText('Amount to send')).toBeInTheDocument();
    expect(screen.getByText('Amount to receive')).toBeInTheDocument();

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByText('BTC')).toBeInTheDocument();
  });

  it('should calculate "toAmount" correctly when "fromAmount" changes', async () => {
    renderComponent();

    const fromInput = (await screen.findAllByTestId('amount-input'))[0];
    const toInput = (await screen.findAllByTestId('amount-input'))[1];

    // ETH (2000) -> BTC (40000)
    // 1 ETH = 0.05 BTC
    fireEvent.change(fromInput, { target: { value: '2' } });

    // 2 ETH = 0.1 BTC
    await waitFor(() => {
      expect(toInput).toHaveValue('0.100000');
    });
  })

  it('should swap tokens when swap button is clicked', async () => {
    renderComponent();
    await screen.findByText('Amount to send');

    const inputs = screen.getAllByTestId('token-button');
    expect(inputs[0]).toHaveTextContent('ETH');
    expect(inputs[1]).toHaveTextContent('BTC');

    fireEvent.click(screen.getByText(SWAP_ICON));

    const swappedInputs = screen.getAllByTestId('token-button');
    expect(swappedInputs[0]).toHaveTextContent('BTC');
    expect(swappedInputs[1]).toHaveTextContent('ETH');
  });

  it('should show loading state and success message on submit', async () => {
    renderComponent();
    await screen.findByText('Amount to send');

    const fromInput = screen.getAllByTestId('amount-input')[0];
    const submitButton = screen.getByRole('button', { name: /confirm swap/i });

    fireEvent.change(fromInput, { target: { value: '1.5' } });
    expect(submitButton).not.toBeDisabled();

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Swapping...');

    await waitFor(() => {
      expect(screen.getByText(/Successfully swapped 1.5 ETH/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(submitButton).not.toHaveTextContent('Swapping...');
  });
});
