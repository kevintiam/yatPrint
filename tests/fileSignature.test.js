import { describe, expect, it } from "vitest";
import { hasValidSignature } from "@/lib/server/fileSignature";

const make = (bytes, type) => new File([new Uint8Array(bytes)], "f", { type });
const text = (str, type) => new File([str], "f", { type });

describe("hasValidSignature", () => {
  it("accepte un vrai PNG", async () => {
    expect(await hasValidSignature(make([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0], "image/png"))).toBe(true);
  });

  it("refuse un faux PNG (texte renommé)", async () => {
    expect(await hasValidSignature(text("<html>piège</html>", "image/png"))).toBe(false);
  });

  it("accepte un PDF", async () => {
    expect(await hasValidSignature(text("%PDF-1.7\n...", "application/pdf"))).toBe(true);
  });

  it("accepte un SVG avec en-tête XML", async () => {
    expect(await hasValidSignature(text('<?xml version="1.0"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>', "image/svg+xml"))).toBe(true);
  });

  it("refuse du HTML annoncé comme SVG", async () => {
    expect(await hasValidSignature(text("<html><script>alert(1)</script></html>", "image/svg+xml"))).toBe(false);
  });

  it("refuse un type inconnu", async () => {
    expect(await hasValidSignature(text("abc", "text/plain"))).toBe(false);
  });
});
