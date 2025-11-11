import { vi, describe, expect, it } from "vitest";
import { render, screen, fireEvent } from '@testing-library/react';
import type {Token} from "../../hooks/useGetTokens/api.ts";
import TokenSelector , {type Props} from "./index.tsx";

const mockTokens: Token[] = [
  {
    currency: 'BTC',
    price: 30000,
    date: new Date("2023-08-29T07:10:40.000Z"),
    iconUrl: '/btc.svg',
  },
  {
    currency: 'ETH',
    price: 2000,
    date: new Date("2023-08-29T07:10:40.000Z"),
    iconUrl: '/eth.svg',
  }
];

describe('TokenSelector', () => {

  function renderComponent(props?: Partial<Props>) {
    render(
      <TokenSelector
      isOpen={false}
      tokens={mockTokens}
      onClose={() => {}}
      onSelect={() => {}}
        {...props}
      />
    )
  }
  it('should not render when isOpen is false', () => {
    renderComponent()

    expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderComponent({isOpen: true})

    expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
    expect(screen.getByText('Select a token')).toBeInTheDocument();
  });

  it('should filter tokens based on search query', () => {
    renderComponent({isOpen: true, tokens: mockTokens});

    expect(screen.getByTestId('token-item-BTC')).toBeInTheDocument();
    expect(screen.getByTestId('token-item-ETH')).toBeInTheDocument();

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'BTC' } });

    expect(screen.getByTestId('token-item-BTC')).toBeInTheDocument();
    expect(screen.queryByTestId('token-item-ETH')).not.toBeInTheDocument();
  });

  it('should call onSelect and onClose when a token is clicked', () => {
    const handleSelect = vi.fn();
    const handleClose = vi.fn();
    renderComponent({isOpen: true, tokens: mockTokens, onClose: handleClose, onSelect: handleSelect});

    fireEvent.click(screen.getByTestId('token-item-ETH'));

    expect(handleSelect).toHaveBeenCalledWith(mockTokens[1]);
    expect(handleClose).toHaveBeenCalledOnce();
  });

  it('should call onClose when backdrop is clicked', () => {
    const handleClose = vi.fn();
    renderComponent({isOpen: true, tokens: mockTokens, onClose: handleClose});

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(handleClose).toHaveBeenCalledOnce();
  });
});
