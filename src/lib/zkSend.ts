// import { Transaction } from "@mysten/sui/transactions";
// import { SuiClient, getFullnodeUrl } from "@mysten/sui/client";
// import { fromBase64, toB64 } from "@mysten/bcs";
// import { Ed25519Keypair } from "@mysten/sui/keypairs";

// const client = new SuiClient({ url: getFullnodeUrl("testnet") });

// export async function createSponsoredTransaction(
//   tx: Transaction,
//   claimer: string,
//   sender: string
// ): Promise<{ digest: string; bytes: string }> {
//   const transactionBlockKindBytes = await tx.build({
//     onlyTransactionKind: true,
//     client,
//   });

//   const response = await fetch("http://localhost:8080/zk/zk-send/sponsor", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       network: "testnet",
//       sender,
//       claimer,
//       txBytes: toB64(transactionBlockKindBytes),
//       allowedAddresses: [claimer],
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to create sponsored transaction");
//   }

//   return await response.json();
// }

// export async function executeSponsoredTransaction(
//   digest: string,
//   signature: string
// ): Promise<{ digest: string }> {
//   const response = await fetch(`http://localhost:8080/zk/zk-send/execute`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ digest, signature }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to execute sponsored transaction");
//   }

//   return await response.json();
// }

// export async function claimAssets(
//   tx: Transaction,
//   claimer: string,
//   keypair?: Ed25519Keypair,
//   signFn?: (bytes: Uint8Array) => Promise<string>,
//   reclaim = false
// ) {
//   const sender = reclaim ? claimer : keypair!.getPublicKey().toSuiAddress();

//   const { bytes: base64Bytes, digest } = await createSponsoredTransaction(tx, claimer, sender);

//   const bytes = fromBase64(base64Bytes);
//   const signature = signFn
//     ? await signFn(bytes)
//     : (await keypair!.signTransaction(bytes)).signature;

//   const resultDigest = (await executeSponsoredTransaction(digest, signature)).digest;

//   const result = await client.waitForTransaction({
//     digest: resultDigest,
//     options: { showEffects: true },
//   });

//   if (result.effects?.status.status !== "success") {
//     throw new Error(`Claim transaction failed: ${result.effects?.status.error ?? "Unknown error"}`);
//   }

//   return result;
// }
