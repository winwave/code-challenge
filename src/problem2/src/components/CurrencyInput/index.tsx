import React from 'react';
import type {Token} from "../../hooks/useGetTokens/api.ts";

export interface Props {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken: Token | null;
  onTokenClick: () => void;
  disabled?: boolean;
}

export default function CurrencyInput(props: Props) {
  const {
    label,
    amount,
    onAmountChange,
    selectedToken,
    onTokenClick,
    disabled = false,
  } = props

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // accept only number and point
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="bg-zinc-800 p-4 rounded-lg border border-zinc-700 mb-2">
      <label className="block text-sm font-medium text-zinc-400 mb-2 text-left">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="text"
          className="flex-grow text-3xl font-medium text-white bg-transparent border-none outline-none p-0 min-w-0 disabled:text-zinc-500"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.0"
          disabled={disabled}
          data-testid="amount-input"
        />
        <button
          className="flex items-center bg-zinc-900 border border-zinc-700 rounded-full p-2 pr-6 cursor-pointer text-white text-lg font-semibold transition-colors hover:bg-zinc-700"
          onClick={onTokenClick}
          data-testid="token-button"
        >
          {selectedToken ? (
            <>
              <img
                src={selectedToken.iconUrl}
                alt={selectedToken.currency}
                className="w-7 h-7 rounded-full mr-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/000000/png';
                }}
              />
              <span className="mr-1">{selectedToken.currency}</span>
            </>
          ) : (
            <span className="pl-2 pr-1">Select Token</span>
          )}
          <span className="text-zinc-400 text-sm">▼</span>
        </button>
      </div>
    </div>
  );
};
