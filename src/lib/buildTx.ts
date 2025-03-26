import { TxCall } from "@/types/types";
import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;

export function buildTx(calls: TxCall[]) {
  if (!PACKAGE_ID || !MODULE_ID) {
    throw new Error("Missing environment variables: VITE_PACKAGE_ID or VITE_MODULE");
  }

  const tx = new Transaction();

  for (const { funcName, args, typeArguments } of calls) {
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_ID}::${funcName}`,
      typeArguments: typeArguments ?? [],
      arguments: args.map((arg) => {
        switch (arg.type) {
          case "string":
            return tx.pure.string(arg.value);
          case "u64":
            return tx.pure.u64(arg.value);
          case "object":
            return tx.object(arg.value);
          default:
            throw new Error(`Unsupported argument type: ${JSON.stringify(arg)}`);
        }
      }),
    });
  }

  return tx;
}
