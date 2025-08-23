import {
  ConnectButton,
  useSuiClient,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

function Home() {
  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
        },
      }),
  });

  const [digest, setDigest] = useState("");
  const currentAccount = useCurrentAccount();

  return (
    <div style={{ padding: 20 }}>
      <ConnectButton />
      {currentAccount && (
        <>
          <div>
            <button
              onClick={() => {
                signAndExecuteTransaction(
                  {
                    transaction: new Transaction(),
                    chain: "sui:mainnet",
                  },
                  {
                    onSuccess: (result) => {
                      console.log("object changes", result.objectChanges);
                      setDigest(result.digest);
                    },
                  },
                );
              }}
            >
              Sign and execute transaction
            </button>
          </div>
          <div>Digest: {digest}</div>
        </>
      )}
    </div>
  );
}

export default Home;
