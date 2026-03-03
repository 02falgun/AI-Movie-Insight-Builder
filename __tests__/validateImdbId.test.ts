import { isValidImdbId } from "@/lib/validateImdbId";

describe("isValidImdbId", () => {
  it("validates expected IMDb ID formats", () => {
    expect(isValidImdbId("tt0133093")).toBe(true);
    expect(isValidImdbId("tt12345678")).toBe(true);
    expect(isValidImdbId("tt123")).toBe(false);
    expect(isValidImdbId("0133093")).toBe(false);
    expect(isValidImdbId("ttABC1234")).toBe(false);
  });
});
