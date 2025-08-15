import { useCurrentAccount } from "@mysten/dapp-kit";
import { useSuiClient } from "@mysten/dapp-kit";
import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { MODULE } from "@/types/v2_moveRegistry";
import {
  MEMBERSHIP_MODULE_FUNCTIONS,
  UPGRADED_PACKAGE_ID,
  COMMUNITY_ID,
} from "@/types/v2_moveRegistry";

export function useUserMintMemberships() {
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
  const { MEMBERSHIP } = MODULE;

  const mintMembership = async ({
    membership_type,
    img_url,
    recipient,
  }: {
    membership_type: string;
    img_url: string;
    recipient: string;
  }) => {
    setIsPending(true);
    setError(null);
    setResult(null);

    if (!account) return;

    const tx = new Transaction();

    tx.moveCall({
      package: UPGRADED_PACKAGE_ID,
      module: MEMBERSHIP,
      target: MEMBERSHIP_MODULE_FUNCTIONS.mint_membership,
      arguments: [
        tx.object(COMMUNITY_ID),
        tx.pure.string(membership_type),
        tx.pure.string(img_url),
        tx.pure.address(recipient),
      ],
    });

    signAndExecuteTransaction(
      {
        transaction: tx.serialize(),
      },
      {
        onSuccess: () => {
          setResult(true);
          setIsPending(false);
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
    mintMembership,
    isPending,
    error,
    result,
  };
}
