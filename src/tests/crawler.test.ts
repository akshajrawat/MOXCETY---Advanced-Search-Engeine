import axios from "axios";
import { pageCrawler } from "../core/crawler";

// 1. TELL JEST TO HIJACK AXIOS
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Page Crawler Service", () => {
  // CLEAR MOCKS BEFORE EACH TEST
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST 1: HAPPY PATH (Valid HTML)
  test("should extract title and normalize links from HTML", async () => {
    // A. SETUP: The "Fake Website"
    const fakeHTML = `
      <html>
        <head><title>Test Page Title</title></head>
        <body>
          <a href="/about">About Us</a>
          <a href="https://other-site.com">External Link</a>
          <a href="#">Ignore Me</a>
        </body>
      </html>
    `;

    // B. MOCK: When axios.get is called, return this fake data
    mockedAxios.get.mockResolvedValue({ data: fakeHTML });

    // C. EXECUTE
    const result = await pageCrawler("https://mysite.com");

    // D. ASSERT
    expect(result.title).toBe("Test Page Title");

    // Check Parsing Logic
    expect(result.links).toContain("https://mysite.com/about"); // Normalized relative link!
    expect(result.links).toContain("https://other-site.com"); // Absolute link
    expect(result.links).not.toContain("#"); // Ignored junk
  });

  // TEST 2: EMPTY PAGE
  test("should handle pages with no title or links", async () => {
    mockedAxios.get.mockResolvedValue({
      data: "<html><body>Nothing here</body></html>",
    });

    const result = await pageCrawler("https://empty.com");

    expect(result.title).toBe("");
    expect(result.links).toHaveLength(0);
  });
  

  // TEST 3: NETWORK ERROR (The "Graceful Fail")
  test("should return empty object on 404 or Network Error", async () => {
    // Simulate a crash (e.g. 404 Not Found)
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    // Suppress console.error for this specific test so it doesn't clutter terminal
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const result = await pageCrawler("https://broken-site.com");

    expect(result.title).toBe("");
    expect(result.links).toEqual([]);

    // Restore console
    consoleSpy.mockRestore();
  });
});
