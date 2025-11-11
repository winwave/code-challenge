import React, { useState, useEffect } from 'react';
import CurrencyInput from '../CurrencyInput';
import TokenSelector from "../TokenSelector";
import useGetTokens from "../../hooks/useGetTokens";
import type {Token} from "../../hooks/useGetTokens/api.ts";

export const SWAP_ICON = '🔃';

export default function SwapForm() {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const [modalType, setModalType] = useState<'from' | 'to' | 'none'>('none');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const { data: tokens, isLoading, error } = useGetTokens()

  // Set default token value
  useEffect(() => {
    if (tokens && tokens.length > 0 && !fromToken) {
      setFromToken(tokens.find(t => t.currency === 'ETH') || tokens[0]);
    }
    if (tokens && tokens.length > 1 && !toToken) {
      setToToken(tokens.find(t => t.currency === 'BTC') || tokens[1]);
    }
  }, [tokens, fromToken, toToken]);

  useEffect(() => {
    if (!fromAmount || !fromToken || !toToken || fromAmount === '.') {
      setToAmount('');
      return;
    }

    const amountIn = parseFloat(fromAmount);
    if (isNaN(amountIn) || amountIn === 0) {
      setToAmount('');
      return;
    }

    const priceFrom = fromToken.price;
    const priceTo = toToken.price;

    if (priceTo > 0) {
      const calculatedToAmount = (amountIn * priceFrom) / priceTo;
      setToAmount(calculatedToAmount.toFixed(6));
    }
  }, [fromAmount, fromToken, toToken]);

  const handleSelectToken = (token: Token) => {
    if (modalType === 'from') {
      // If the new token selected matches the 'to' token, then swap
      if (token.currency === toToken?.currency) {
        setFromToken(token);
        setToToken(fromToken);
      } else {
        setFromToken(token);
      }
    } else if (modalType === 'to') {
      // If the new token selected matches the 'from' token, then swap
      if (token.currency === fromToken?.currency) {
        setToToken(token);
        setFromToken(toToken);
      } else {
        setToToken(token);
      }
    }
    setModalType('none');
  };

  const handleSwap = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAmount || !fromToken || !toToken || parseFloat(fromAmount) <= 0) {
      setSubmitMessage('Please enter a valid amount.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage(`Successfully swapped ${fromAmount} ${fromToken.currency} for ${toAmount} ${toToken.currency}!`);
      setFromAmount('');
    }, 2000); // simulate 2 seconds API response
  };

  if (isLoading) {
    return <div className="text-white">Loading token prices...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <>
      <form className="bg-zinc-900 border border-zinc-700 rounded-2xl p-5 max-w-lg w-full shadow-xl" onSubmit={handleSubmit}>
        <h5 className="text-xl font-semibold mb-5 text-left text-white">Currency Swap</h5>

        <CurrencyInput
          label="Amount to send"
          amount={fromAmount}
          onAmountChange={(value) => setFromAmount(value)}
          selectedToken={fromToken}
          onTokenClick={() => setModalType('from')}
        />

        <div className="flex justify-center -my-4 relative z-10">
          <button type="button" onClick={handleSwap} className="bg-zinc-800 border-4 border-zinc-900 rounded-full w-10 h-10 flex items-center justify-center text-blue-400 text-xl transition-transform hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {SWAP_ICON}
          </button>
        </div>

        <CurrencyInput
          label="Amount to receive"
          amount={toAmount}
          onAmountChange={() => {}}
          selectedToken={toToken}
          onTokenClick={() => setModalType('to')}
          disabled={true}
        />

        <button
          type="submit"
          className="w-full p-4 mt-5 font-semibold text-lg bg-blue-600 text-white rounded-xl transition-colors hover:bg-blue-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed"
          disabled={isSubmitting || !fromAmount || parseFloat(fromAmount) <= 0}
        >
          {isSubmitting ? 'Swapping...' : 'CONFIRM SWAP'}
        </button>

        {submitMessage && (
          <div className={`mt-4 text-center ${submitMessage.startsWith('Please') ? 'text-red-500' : 'text-green-500'}`}>
            {submitMessage}
          </div>
        )}
      </form>

      <TokenSelector
        isOpen={modalType !== 'none'}
        tokens={tokens || []}
        onClose={() => setModalType('none')}
        onSelect={handleSelectToken}
        title={modalType === 'from' ? 'Select token to send' : 'Select token to receive'}
      />
    </>
  );
};
