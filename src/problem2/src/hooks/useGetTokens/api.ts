import {z} from "zod";

const API_URL = 'https://interview.switcheo.com/prices.json';
export const ICON_BASE_URL = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/';

const TokenSchema = z.object({
  currency: z.string(),
  price: z.number(),
  date: z.coerce.date(),
})

type ApiToken = z.infer<typeof TokenSchema>;

export interface Token extends ApiToken {
  iconUrl: string;
}

const TokensResponseSchema = z.array(TokenSchema);

export const fetchTokenPrices = async (): Promise<Token[]> => {
  try {
    const response = await fetch(API_URL);
    console.log(response);
    if (response.status > 400) {
      throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const results = TokensResponseSchema.parse(data);

    return Array.from(
      results.reduce((map, token) => {
        const existing = map.get(token.currency);
        if (!existing || new Date(token.date) > new Date(existing.date)) {
          map.set(token.currency, {
            ...token,
            iconUrl: `${ICON_BASE_URL}${token.currency}.svg`,
          });
        }

        return map;
      }, new Map<string, Token>())
        .values()
    );
  } catch (error) {
    console.error('Failed to fetch token prices:', error);
    throw error
  }
};
