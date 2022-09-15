import '@testing-library/jest-dom';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useThentic } from '../src';
import { makeid } from '../utils';

describe('useThentic', () => {
  it('can fetch ntfs', async () => {
    const { result } = renderHook(() =>
      useThentic('AwxmkxE1WrzsdRmdIfX6FjNvRf9mwPOS', 97)
    );
    await act(async () => result.current.fetchNfts());
    await waitFor(() => {
      // console.log('nfts', result.current.nfts);
      expect(result.current.nfts.length).toBeGreaterThan(0);
    });
  });

  it('can fetch mint nft', async () => {
    const { result } = renderHook(() =>
      useThentic('AwxmkxE1WrzsdRmdIfX6FjNvRf9mwPOS', 97)
    );
    await act(async () =>
      result.current.fetchMintNft({
        chain_id: 97,
        contract: '0x38cb48fd4b6ca05e0bdb55344b0479cdc681a5bb',
        to: '0x672a6cA43a8Be9950638c174515fcbe59B1E788E',
        nft_id: Math.floor(Math.random() * 100000) + 1,
        nft_data: makeid(5),
      })
    );
    await waitFor(() => {
      // console.log('fetchMintNft', result.current.nftPending);
      expect(result.current.currentNftMint).not.toEqual(undefined);
    });
  });
});
