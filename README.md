## useThentic

React hooks for Thentic API

## Installation

    npm install topapr

or

    yarn add topapr

## Examples

    import { useThentic } from  "topapr";

    export  default function TestThentic() {
      const { nfts, fetchNfts, isLoading } = useThentic("YOUR API", 97);

      useEffect(() => {
        fetchNfts({
          address: "YOUR WALLET ADDRESS",
          status: "success"
        });
      }, [fetchNfts]);

      return (
        isLoading ? <div>Loading...</div> : <div>{nfts}</div>
      );
    }

## Methods

- fetchNfts
- fetchMintNft
- mintNft

## State

- nfts
- currentNftMint
- error
- isLoading
