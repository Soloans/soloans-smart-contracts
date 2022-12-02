// import web3 from "@solana/web3.js";
// import token from "@solana/spl-token";
const web3 = require("@solana/web3.js");
const { SolendMarket } = require("@solendprotocol/solend-sdk");
const fs = require("fs");
// import {
//   TokenSwap,
//   TOKEN_SWAP_PROGRAM_ID,
//   TokenSwapLayout,
//   CurveType,
// } from "@solana/spl-token-swap";

// function loadKeypair(filename) {
//   const secret = JSON.parse(fs.readFileSync(filename).toString());
//   const secretKey = Uint8Array.from(secret);
//   return web3.Keypair.fromSecretKey(secretKey);
// }
// async function getTokenAccountCreationInstruction(mint, owner, payer) {
//   let tokenAccountAddress = await token.getAssociatedTokenAddress(
//     mint, // mint
//     owner, // owner
//     true // allow owner off curve
//   );

//   const tokenAccountInstruction =
//     await token.createAssociatedTokenAccountInstruction(
//       payer, // payer
//       tokenAccountAddress, // ata
//       owner, // owner
//       mint // mint
//     );
//   return [tokenAccountAddress, tokenAccountInstruction];
// }

async function main() {
  const connection = new web3.Connection("https://api.devnet.solana.com");

  const transaction = new web3.Transaction();
  // There are three levels of data you can request (and cache) about the lending market.
  // 1. Initalize market with parameters and metadata
  const market = await SolendMarket.initialize(
    connection,
    "production" // optional environment argument
    // new PublicKey("7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM") // optional market address (TURBO SOL). Defaults to 'Main' market
  );

  // 2. Read on-chain accounts for reserve data and cache
  //   await market.loadReserves();
  //   console.log(market.reserves);
  // LEND SOL 5VVLD7BQp8y3bTgyF5ezm1ResyMTR3PhYsT4iHFU8Sxz: "SOL",

  const amountOfLend = 1000;
  const sourceLiquidity = new web3.Keypair(
    "5VVLD7BQp8y3bTgyF5ezm1ResyMTR3PhYsT4iHFU8Sxz"
  );
  const hostFeeReceiver = new web3.PublicKey(
    "9RuqAN42PTUi9ya59k9suGATrkqzvb9gk2QABJtQzGP5"
  );
  const lendingMarket = new web3.PublicKey(
    "GvjoVKNjBvQcFaSKUW1gTE7DxhSpjHbE69umVR5nPuQp"
  );
  const userTransferAuthority = new web3.PublicKey(
    "63rALitNZKE94URtEpNv55pfMmV4mSSamWwGntYDEwRx"
  );
  const destinationLiquidity = web3.Keypair.generate();
  const reverse = web3.Keypair.generate();
  const lendingProgramId = web3.Keypair(
    "ALend7Ketfx5bxh6ghsCDXAoDrhvEmsXT3cynB6aPLgx"
  );

  const lendInstruction = await market.flashBorrowReserveLiquidityInstruction(
    amountOfLend,
    sourceLiquidity,
    destinationLiquidity,
    reverse,
    lendingProgramId
  );

  transaction.add(lendInstruction);

  /// Add Orca vào đây

  const reserveLiquidityFeeReceiver = new web3.PublicKey(
    "reserveLiquidityFeeReceiver"
  );
  const repayÍntruction = await market.flashRepayReserveLiquidityInstruction(
    amountOfLend,
    amountOfLend,
    sourceLiquidity,
    destinationLiquidity,
    reserveLiquidityFeeReceiver,
    hostFeeReceiver,
    reverse,
    lendingMarket,
    userTransferAuthority,
    lendingProgramId
  );

  transaction.add(repayÍntruction);
}
main();
