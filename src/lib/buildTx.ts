import { TxArg, TxCall } from "@/types/types";
import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID = import.meta.env.VITE_MOVE_CALL_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;

export function buildTx(calls: TxCall[]) {
  if (!PACKAGE_ID || !MODULE_ID) {
    throw new Error("Missing environment variables: VITE_PACKAGE_ID or VITE_MODULE");
  }

  const tx = new Transaction();
  const assigned: Record<string, any> = {};

  for (const call of calls) {
    // 🟢 assign-only
    if (!("funcName" in call)) {
      const { assign, value } = call as { assign: string; value: TxArg };

      if (value.type === "string") {
        assigned[assign] = tx.pure.string(value.value);
      } else if (value.type === "u64") {
        assigned[assign] = tx.pure.u64(value.value);
      } else {
        throw new Error(`Unsupported assign-only type: ${value.type}`);
      }

      continue;
    }

    const { funcName, args, typeArguments, assign } = call;

    // ✅ 🔥 SPECIAL HANDLING FOR TRANSFER
    if (funcName === "transfer") {
      if (args.length !== 2) throw new Error("transfer expects exactly 2 arguments");

      const objArg = args[0];
      const addrArg = args[1];

      if (objArg.type !== "variable") {
        throw new Error("First argument of transfer must be a variable");
      }
      if (addrArg.type !== "object") {
        throw new Error("Second argument of transfer must be an address");
      }

      const objectToTransfer = assigned[objArg.value];

      const recipient = tx.pure.address(addrArg.value);

      tx.transferObjects([objectToTransfer], recipient);
      continue;
    }

    // 🔵 move-call (기존 로직 그대로)
    const resolvedArgs = args.map((arg) => {
      switch (arg.type) {
        case "string":
          return tx.pure.string(arg.value);
        case "u64":
          return tx.pure.u64(arg.value);
        case "object":
          return tx.object(arg.value);
        case "variable":
          if (!(arg.value in assigned)) {
            throw new Error(`Variable ${arg.value} not found`);
          }
          return assigned[arg.value];
        default:
          throw new Error(`Unsupported argument type: ${JSON.stringify(arg)}`);
      }
    });

    const result = tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_ID}::${funcName}`,
      typeArguments: typeArguments ?? [],
      arguments: resolvedArgs,
    });

    if (assign) {
      assigned[assign] = result;
    }
  }

  return tx;
}
