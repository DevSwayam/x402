import { describe, it, expect } from "vitest";
import { getUsdcChainConfigForChain } from "./usdc";

describe("USDC Configuration", () => {
  it("should have USDC configuration for horizen-testnet", () => {
    const config = getUsdcChainConfigForChain(845320009);

    expect(config).toBeDefined();
    expect(config?.usdcAddress).toBe("0xD1DFf45486Ed0d172b40B54e0565276eE7936049");
    expect(config?.usdcName).toBe("USDC");
  });

  it("should return undefined for unsupported chain ID", () => {
    const config = getUsdcChainConfigForChain(999999);
    expect(config).toBeUndefined();
  });
});
