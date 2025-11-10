import {useQuery} from "@tanstack/react-query";
import {fetchTokenPrices} from "./api.ts";

export default function useGetTokens() {
  const { isLoading, error, data } = useQuery({
    queryKey: ["tokenPrices"],
    queryFn: fetchTokenPrices,
  });

  return {
    isLoading,
    data,
    error,
  };
}
