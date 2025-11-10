import { vi, describe, expect, it } from "vitest";
import { render, screen, fireEvent } from '@testing-library/react';
import type {Token} from "../../hooks/useGetTokens/api.ts";
import CurrencyInput, {type Props} from "./index.tsx";

const mockToken: Token = {
  currency: 'BTC',
  price: 30000,
  date: new Date("2023-08-29T07:10:40.000Z"),
  iconUrl: '/btc.svg',
};

describe('CurrencyInput', () => {

  function renderComponent(props?: Partial<Props>) {
    render( <CurrencyInput
        label="Amount to send"
        amount=""
        onAmountChange={() => {}}
        selectedToken={null}
        onTokenClick={() => {}}
        {...props}
      />)
  }
  it('renders label and placeholder', () => {
    renderComponent()

    expect(screen.getByText('Amount to send')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0.0')).toBeInTheDocument();
  });

  it('displays the amount', () => {
    renderComponent({amount: "123.45"})

    expect(screen.getByTestId('amount-input')).toHaveValue('123.45');
  });

  it('calls onAmountChange with valid numeric input', () => {
    const handleChange = vi.fn();
    renderComponent({onAmountChange: handleChange})

    const input = screen.getByTestId('amount-input');
    fireEvent.change(input, { target: { value: '50.5' } });
    expect(handleChange).toHaveBeenCalledWith('50.5');
  });

  it('does not call onAmountChange with invalid (non-numeric) input', () => {
    const handleChange = vi.fn();
    renderComponent({onAmountChange: handleChange})

    const input = screen.getByTestId('amount-input');
    fireEvent.change(input, { target: { value: 'abc' } });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('displays selected token info', () => {
    renderComponent({selectedToken: mockToken})

    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByAltText('BTC')).toBeInTheDocument();
  });

  it('calls onTokenClick when token button is clicked', () => {
    const handleClick = vi.fn();
    renderComponent({onTokenClick: handleClick})

    fireEvent.click(screen.getByTestId('token-button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
