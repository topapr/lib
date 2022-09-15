import { useCallback, useState } from 'react';

export interface MintParams {
  chain_id: string | number;
  contract: string;
  to: string;
  nft_id: number;
  nft_data?: string;
}

export interface FetchNftsParams {
  address?: string;
  status?: 'success' | 'pending';
}

const useThentic = (api: string, chainId: number) => {
  const [nfts, setNfts] = useState<object[]>([]);
  const [currentNftMint, setCurrentNftMint] = useState();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLoader = useCallback(async (url: string, init?: RequestInit) => {
    setIsLoading(true);
    return await fetch(url, init)
      .then(res => res.json())
      .then(
        result => {
          return result;
        },
        error => {
          setError(error);
          return error;
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const fetchNfts = useCallback(
    async (params?: FetchNftsParams) => {
      const res = await fetchLoader(
        `https://thentic.tech/api/nfts?key=${api}&chain_id=${chainId}`
      );

      if (res.nfts) {
        // Parse address in data if available
        const parsedNfts = (res.nfts as any[]).map(nft => {
          const isDataAddress = (nft.data as string).includes('{"address":');
          if (isDataAddress) {
            try {
              const nftData = JSON.parse(nft.data);
              return {
                ...nft,
                address: nftData.address || '',
                data: nftData.data || nft.nft_data,
              };
            } catch {
              return nft;
            }
          }

          return nft;
        });

        if (params) {
          const filteredAddrNfts = params.address
            ? parsedNfts.filter((nft: any) => nft.address === params.address)
            : parsedNfts;
          const filteredStatusNfts = params.status
            ? filteredAddrNfts.filter(
                (nft: any) => nft.status === params.status
              )
            : filteredAddrNfts;

          setNfts(filteredStatusNfts);
          return filteredStatusNfts;
        } else {
          setNfts(parsedNfts);
          return parsedNfts;
        }
      }

      return res;
    },
    [api, chainId, fetchLoader]
  );

  const fetchMintNft = useCallback(
    async (params: MintParams) => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          key: api,
          // Insert wallet address as data
          nft_data: JSON.stringify({
            address: params.to,
            data: params.nft_data || {},
          }),
        }),
      };
      const res = await fetchLoader(
        `https://thentic.tech/api/nfts/mint`,
        requestOptions
      );
      if (res) {
        setCurrentNftMint(res);
      }
      return res;
    },
    [api, fetchLoader]
  );

  const mintNft = useCallback(
    async (params: MintParams) => {
      const nftMint = await fetchMintNft(params);
      if (nftMint && nftMint.transaction_url) {
        window.open(nftMint.transaction_url);
      }
    },
    [fetchMintNft]
  );

  return {
    nfts,
    currentNftMint,
    fetchNfts,
    fetchMintNft,
    mintNft,
    isLoading,
    error,
  };
};

export default useThentic;
