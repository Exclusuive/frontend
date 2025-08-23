import { Transaction } from "@mysten/sui/transactions";
import {
  ConnectButton,
  useCurrentAccount,
  useSignTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";

function Home() {
  const { mutateAsync: signTransaction } = useSignTransaction();
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();

  return (
    <div style={{ padding: 20 }}>
      <ConnectButton />
      {currentAccount && (
        <>
          <div>
            <button
              onClick={async () => {
                const { bytes, signature } = await signTransaction({
                  transaction: new Transaction(),
                  chain: "sui:mainnet",
                });

                const executeResult = await client.executeTransactionBlock({
                  transactionBlock: bytes,
                  signature,
                  options: {
                    showRawEffects: true,
                  },
                });

                console.log(executeResult);
              }}
            >
              Sign empty transaction
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
