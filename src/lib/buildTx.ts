import { Transaction } from "@mysten/sui/transactions";

const PACKAGE_ID = "0xe47afcfd1189c1d1ec792428c952e07a6016046d5fdfdc7de3120c3ac249116f";
const MODULE_ID = "collection";

type Argument =
  | { type: "string"; value: string }
  | { type: "u64"; value: number | bigint }
  | { type: "object"; value: string };

export function buildTx(funcName: string, args: Argument[]) {
  const tx = new Transaction();

  tx.moveCall({
    target: `${PACKAGE_ID}::${MODULE_ID}::${funcName}`,
    arguments: args.map((arg) => {
      switch (arg.type) {
        case "string":
          return tx.pure.string(arg.value);
        case "u64":
          return tx.pure.u64(arg.value);
        case "object":
          return tx.object(arg.value);
        default:
          throw new Error(`Unsupported argument type: ${(arg as any).type}`);
      }
    }),
  });

  return tx;
}
