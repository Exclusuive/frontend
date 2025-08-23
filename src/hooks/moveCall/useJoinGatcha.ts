import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE, PAYMENT_MODULE_FUNCTIONS, MARKET_ID } from "@/types/v2_moveRegistry";
import { UPGRADED_PACKAGE_ID, COMMUNITY_ID } from "@/types/v2_moveRegistry";

export function useJoinGatcha() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  const joinGatcha = async ({
    membership_id,
    isNew,
  }: {
    membership_id: string;
    isNew: boolean;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    if (isNew && membership_id) {
      const [coin_obj] = tx.splitCoins(tx.gas, [tx.pure("u64", 0)]);
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: MODULE.PAYMENT,
        target: PAYMENT_MODULE_FUNCTIONS.process_payment_with_membership,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [
          tx.object(COMMUNITY_ID),
          tx.object(MARKET_ID),
          tx.object(coin_obj),
          tx.pure.u64(0),
          tx.object(membership_id),
        ],
      });
      tx.transferObjects([coin_obj], account.address);
    } else {
      const [coin_obj] = tx.splitCoins(tx.gas, [tx.pure("u64", 3000000000)]);
      tx.moveCall({
        package: UPGRADED_PACKAGE_ID,
        module: MODULE.PAYMENT,
        target: PAYMENT_MODULE_FUNCTIONS.process_payment_without_membership,
        typeArguments: ["0x2::sui::SUI"],
        arguments: [tx.object(MARKET_ID), tx.object(coin_obj), tx.pure.u64(3000000000)],
      });
      tx.transferObjects([coin_obj], account.address);
    }

    signAndExecuteTransaction(
      {
        transaction: tx,
        account: account,
        chain: "sui:mainnet",
      },
      {
        onSuccess: () => {
          setResult(true);
          setIsPending(false);
          localStorage.setItem("joined_gatcha", "true");
        },
        onError: (err: any) => {
          setResult(false);
          setIsPending(false);
          setError(err.message);
        },
        onSettled: () => {
          setIsPending(false);
        },
      },
    );
  };

  return {
    joinGatcha,
    isPending,
    error,
    result,
  };
}
