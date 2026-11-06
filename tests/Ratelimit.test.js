/**
 * Tests de l'anti-abus (limite de requêtes par adresse IP).
 * Lancer : npm run test
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { checkRateLimit, enforceRateLimit, getClientIp, isRedisConfigured } from "@/lib/server/rateLimit";

/** Fausse requête avec une adresse IP donnée. */
function fakeRequest(ip) {
  return { headers: new Headers({ "x-forwarded-for": `${ip}, 10.0.0.1` }) };
}

const SMALL_LIMIT = { limit: 2, windowMs: 60 * 1000 };

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("adresse IP du visiteur", () => {
  it("préfère x-real-ip, sinon la première adresse de x-forwarded-for", () => {
    expect(getClientIp({ headers: new Headers({ "x-real-ip": "203.0.113.9" }) })).toBe("203.0.113.9");
    expect(getClientIp(fakeRequest("198.51.100.4"))).toBe("198.51.100.4");
    expect(getClientIp({ headers: new Headers() })).toBe("inconnue");
  });
});

describe("mode mémoire (sans Upstash)", () => {
  it("bloque la 3e requête quand la limite est 2", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("KV_REST_API_URL", "");
    expect(isRedisConfigured()).toBe(false);

    const request = fakeRequest("192.0.2.10");
    await enforceRateLimit(request, "test-memoire", SMALL_LIMIT);
    await enforceRateLimit(request, "test-memoire", SMALL_LIMIT);
    await expect(enforceRateLimit(request, "test-memoire", SMALL_LIMIT)).rejects.toMatchObject({ status: 429 });
  });

  it("compte chaque adresse IP séparément", async () => {
    const first = fakeRequest("192.0.2.20");
    await checkRateLimit(first, "test-ip", SMALL_LIMIT);
    await checkRateLimit(first, "test-ip", SMALL_LIMIT);
    expect(await checkRateLimit(first, "test-ip", SMALL_LIMIT)).toBe(false);
    expect(await checkRateLimit(fakeRequest("192.0.2.21"), "test-ip", SMALL_LIMIT)).toBe(true);
  });
});

describe("mode Upstash", () => {
  it("autorise la requête si Upstash est injoignable (une panne ne bloque pas les ventes)", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://upstash-introuvable.invalid");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "faux-jeton");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(isRedisConfigured()).toBe(true);

    expect(await checkRateLimit(fakeRequest("192.0.2.30"), "test-panne", SMALL_LIMIT)).toBe(true);
  });
});