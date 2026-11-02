import { getSafeRedirect } from "./safeRedirect";

describe("getSafeRedirect", () => {
  it("aceita caminhos internos", () => {
    expect(getSafeRedirect("/treinos?x=1")).toBe("/treinos?x=1");
  });

  it.each(["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "", undefined, 42])(
    "rejeita %s",
    (value) => {
      expect(getSafeRedirect(value)).toBe("/");
    },
  );
});
