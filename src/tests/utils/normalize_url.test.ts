import { getNormalizedUrl } from "../../utils/normalize_url";

describe("URL normalizer (CRAWLER core logic)", () => {
  // test1
  test("Should standardize simple URL", () => {
    const input = "HTTPS://Google.com/";
    const output = getNormalizedUrl(input);

    expect(output).toBe("https://google.com");
  });

  // test2
  test("should treat these as the SAME URL", () => {
    const url1 = "https://react.dev/learn";
    const url2 = "https://react.dev/learn/";
    const url3 = "https://react.dev/learn#components";

    expect(getNormalizedUrl(url1)).toBe(getNormalizedUrl(url2));
    expect(getNormalizedUrl(url1)).toBe(getNormalizedUrl(url3));
  });

  // test3
  test("should resolve relative links using base URL", () => {
    const relative = "/docs/installation";
    const base = "https://ui.shadcn.com";

    const result = getNormalizedUrl(relative, base);
    expect(result).toBe("https://ui.shadcn.com/docs/installation");
  });

  // test4
  test("should return null for invalid links", () => {
    expect(getNormalizedUrl("not-a-url")).toBeNull();
    expect(getNormalizedUrl("javascript:alert(1)")).toBeNull(); 
  });
});
