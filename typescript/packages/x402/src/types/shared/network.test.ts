import { describe, it, expect } from "vitest";
import {
  NetworkSchema,
  SupportedEVMNetworks,
  EvmNetworkToChainId,
  ChainIdToNetwork,
} from "./network";

describe("Network Configuration", () => {
  it("should include horizen-testnet in NetworkSchema", () => {
    expect(NetworkSchema.options).toContain("horizen-testnet");
  });

  it("should include horizen-testnet in SupportedEVMNetworks", () => {
    expect(SupportedEVMNetworks).toContain("horizen-testnet");
  });

  it("should have correct chain ID for horizen-testnet", () => {
    expect(EvmNetworkToChainId.get("horizen-testnet")).toBe(845320009);
  });

  it("should map chain ID to network correctly", () => {
    expect(ChainIdToNetwork[845320009]).toBe("horizen-testnet");
  });

  it("should validate horizen-testnet network", () => {
    const result = NetworkSchema.safeParse("horizen-testnet");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("horizen-testnet");
    }
  });
});
