# UnWallet Horizen

A comprehensive blockchain payment solution based on Coinbase's x402 Payment Protocol with additional support for **Horizen Testnet** and other blockchain networks.

## Features

- **Horizen Testnet Support**: Full integration with Horizen Testnet (Chain ID: 845320009)
- **USDC Integration**: Pre-configured USDC contract support for Horizen Testnet
- **Payment Protocol**: Complete x402 payment protocol implementation
- **Multi-Network Support**: Support for Base, Avalanche, IoTeX, Sei, and more
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **Wallet Integration**: Seamless wallet connectivity and transaction management

## Installation

```bash
npm install unwallet-horizen
# or
yarn add unwallet-horizen
# or
pnpm add unwallet-horizen
```

## Quick Start

### Using Horizen Testnet

```typescript
import { createConnectedClient, createSigner } from "unwallet-horizen";

// Create a public client for Horizen Testnet
const client = createConnectedClient("horizen-testnet");

// Create a wallet client for Horizen Testnet
const signer = createSigner("horizen-testnet", privateKey);

// Use in payment requirements
const paymentRequirements = {
  scheme: "exact",
  network: "horizen-testnet",
  asset: "0xD1DFf45486Ed0d172b40B54e0565276eE7936049", // USDC contract
  maxAmountRequired: "1000000", // $1.00 USDC (6 decimals)
  resource: "https://api.example.com/protected-endpoint",
  description: "API access fee",
  payTo: "0x1234567890123456789012345678901234567890",
  maxTimeoutSeconds: 60,
};
```

### Network Configuration

**Horizen Testnet Details:**

- **Chain ID**: `845320009`
- **RPC URL**: `https://horizen-rpc-testnet.appchain.base.org`
- **Block Explorer**: `https://horizen-explorer-testnet.appchain.base.org`
- **Native Currency**: ETH
- **USDC Contract**: `0xD1DFf45486Ed0d172b40B54e0565276eE7936049`

## Supported Networks

This package supports the following networks:

- **Base** (Mainnet & Sepolia)
- **Avalanche** (Mainnet & Fuji)
- **IoTeX** (Mainnet)
- **Sei** (Mainnet & Testnet)
- **Horizen Testnet** (New!)

## API Reference

### Core Functions

```typescript
// Create clients
createConnectedClient(network: string): ConnectedClient
createSigner(network: string, privateKey: Hex): SignerWallet

// Payment utilities
createPaymentHeader(paymentRequirements: PaymentRequirements, wallet: SignerWallet): Promise<string>
verifyPayment(payload: PaymentPayload, requirements: PaymentRequirements): Promise<VerifyResponse>
settlePayment(payload: PaymentPayload, requirements: PaymentRequirements): Promise<SettleResponse>
```

### Network Types

```typescript
type Network =
  | "base"
  | "base-sepolia"
  | "avalanche"
  | "avalanche-fuji"
  | "iotex"
  | "sei"
  | "sei-testnet"
  | "horizen-testnet"; // New!
```

## Differences from Original x402

This package is a fork of Coinbase's x402 with the following additions:

1. **Horizen Testnet Support**: Full integration including chain configuration, RPC endpoints, and USDC contract
2. **Updated Network Schema**: Extended to include `horizen-testnet`
3. **Enhanced USDC Configuration**: Added Horizen Testnet USDC contract mapping
4. **Custom Chain Definition**: Complete chain configuration for Horizen Testnet

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

Apache License 2.0 - see LICENSE file for details.

## Acknowledgments

This package is based on Coinbase's x402 Payment Protocol. Original work by Coinbase Inc.

- **Original Repository**: https://github.com/coinbase/x402
- **Original Author**: Coinbase Inc.
- **Contributor**: DevSwayam (Horizen Testnet support)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
