/* eslint-env node */
import { config } from "dotenv";
import express from "express";
import { verify, settle } from "unwallet-horizen/facilitator";
import {
  PaymentRequirementsSchema,
  PaymentRequirements,
  PaymentPayload,
  PaymentPayloadSchema,
} from "unwallet-horizen/types";
import {
  createPublicClient,
  createWalletClient,
  http,
  publicActions,
  type Chain,
  type Transport,
  type PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base, baseSepolia, avalanche, avalancheFuji, sei, seiTestnet } from "viem/chains";

config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const app = express();

// Configure express to parse JSON bodies
app.use(express.json());

type VerifyRequest = {
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirements;
};

type SettleRequest = {
  paymentPayload: PaymentPayload;
  paymentRequirements: PaymentRequirements;
};

// Supported networks (align with SDK NetworkSchema)
const SUPPORTED: Array<PaymentRequirements["network"]> = [
  "horizen-testnet",
  "base-sepolia",
  "base",
  "avalanche-fuji",
  "avalanche",
  "sei",
  "sei-testnet",
];

// Custom chain for Horizen Testnet
const horizenTestnet: Chain = {
  id: 845320009,
  name: "Horizen Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://horizen-rpc-testnet.appchain.base.org"] },
    public: { http: ["https://horizen-rpc-testnet.appchain.base.org"] },
  },
  blockExplorers: {
    default: {
      name: "Horizen Explorer",
      url: "https://horizen-explorer-testnet.appchain.base.org",
    },
  },
} as const;

function chainFromNetwork(network: PaymentRequirements["network"]): Chain {
  switch (network) {
    case "base":
      return base;
    case "base-sepolia":
      return baseSepolia;
    case "avalanche":
      return avalanche;
    case "avalanche-fuji":
      return avalancheFuji;
    case "sei":
      return sei;
    case "sei-testnet":
      return seiTestnet;
    case "horizen-testnet":
      return horizenTestnet;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}

function createConnectedClient(
  network: PaymentRequirements["network"],
): PublicClient<Transport, Chain, undefined> {
  const chain = chainFromNetwork(network);
  return createPublicClient({ chain, transport: http() }).extend(publicActions);
}

function createSigner(network: PaymentRequirements["network"], pk: `0x${string}`) {
  const chain = chainFromNetwork(network);
  return createWalletClient({ chain, transport: http(), account: privateKeyToAccount(pk) }).extend(
    publicActions,
  );
}

app.get("/verify", (req, res) => {
  res.json({
    endpoint: "/verify",
    description: "POST to verify x402 payments",
    body: {
      paymentPayload: "PaymentPayload",
      paymentRequirements: "PaymentRequirements",
    },
  });
});

app.post("/verify", async (req, res) => {
  try {
    const body: VerifyRequest = req.body;
    const paymentRequirements = PaymentRequirementsSchema.parse(body.paymentRequirements);
    const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);

    if (!SUPPORTED.includes(paymentRequirements.network)) {
      return res.status(400).json({ error: `Unsupported network: ${paymentRequirements.network}` });
    }

    const client = createConnectedClient(paymentRequirements.network);
    const valid = await verify(client, paymentPayload, paymentRequirements);
    res.json(valid);
  } catch {
    res.status(400).json({ error: "Invalid request" });
  }
});

app.get("/settle", (req, res) => {
  res.json({
    endpoint: "/settle",
    description: "POST to settle x402 payments",
    body: {
      paymentPayload: "PaymentPayload",
      paymentRequirements: "PaymentRequirements",
    },
  });
});

app.get("/supported", (req, res) => {
  res.json({
    kinds: SUPPORTED.map(n => ({ x402Version: 1, scheme: "exact", network: n })),
  });
});

app.post("/settle", async (req, res) => {
  try {
    const body: SettleRequest = req.body;
    const paymentRequirements = PaymentRequirementsSchema.parse(body.paymentRequirements);
    const paymentPayload = PaymentPayloadSchema.parse(body.paymentPayload);

    if (!SUPPORTED.includes(paymentRequirements.network)) {
      return res.status(400).json({ error: `Unsupported network: ${paymentRequirements.network}` });
    }

    const signer = createSigner(paymentRequirements.network, PRIVATE_KEY as `0x${string}`);
    const response = await settle(signer, paymentPayload, paymentRequirements);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: `Invalid request: ${error}` });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening at http://localhost:${process.env.PORT || 3000}`);
});
