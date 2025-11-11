import React, { useState, useMemo } from 'react';
import type {Token} from "../../hooks/useGetTokens/api.ts";

export interface Props {
  isOpen: boolean;
  tokens: Token[];
  onClose: () => void;
  onSelect: (token: Token) => void;
  title?: string;
}

const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

export default function TokenSelector(props: Props) {
  const { isOpen, tokens, onSelect, onClose, title = "Select a token" } = props;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.currency.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  const handleSelectToken = (token: Token) => {
    onSelect(token);
    onClose();
    setSearchQuery('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" data-testid="modal-backdrop" onClick={onClose}>
      <div className="bg-zinc-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden border border-zinc-700" onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
      }}>
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h5 className="text-lg font-semibold text-white">{title}</h5>
          <button onClick={onClose} className="text-2xl text-zinc-400 hover:text-white">&times;</button>
        </div>

        <div className="p-4 border-b border-zinc-700">
          <input
            type="text"
            className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by name or symbol"
            data-testid="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="overflow-y-auto p-2">
          {filteredTokens.map((token) => (
            <div
              key={token.currency}
              className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-zinc-700"
              data-testid={`token-item-${token.currency}`}
              onClick={() => handleSelectToken(token)}
            >
              <img
                src={`${ICON_BASE_URL}${token.currency}.svg`}
                alt={token.currency}
                className="w-8 h-8 rounded-full mr-3 bg-zinc-600"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/000000/png';
                }}
              />
              <span className="text-lg font-medium text-white">{token.currency}</span>
            </div>
          ))}
          {filteredTokens.length === 0 && (
            <div className="p-4 text-center text-zinc-400">No tokens found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
