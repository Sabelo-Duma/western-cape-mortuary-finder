import { describe, it, expect } from "vitest";
import {
  WESTERN_CAPE_CITIES,
  SERVICE_TYPES,
  AVAILABILITY_LABELS,
} from "@/lib/constants";

describe("WESTERN_CAPE_CITIES", () => {
  it("should contain exactly 10 cities", () => {
    expect(WESTERN_CAPE_CITIES).toHaveLength(10);
  });

  it("should include Cape Town", () => {
    const capeTown = WESTERN_CAPE_CITIES.find((c) => c.slug === "cape-town");
    expect(capeTown).toBeDefined();
    expect(capeTown!.name).toBe("Cape Town");
  });

  it("should be sorted alphabetically", () => {
    const names = WESTERN_CAPE_CITIES.map((c) => c.name);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it("should have unique slugs", () => {
    const slugs = WESTERN_CAPE_CITIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("SERVICE_TYPES", () => {
  it("should contain expected services", () => {
    expect(SERVICE_TYPES).toContain("Cold Storage");
    expect(SERVICE_TYPES).toContain("Embalming");
    expect(SERVICE_TYPES).toContain("Chapel");
  });
});

describe("AVAILABILITY_LABELS", () => {
  it("should map all availability statuses", () => {
    expect(AVAILABILITY_LABELS.available).toBe("Available");
    expect(AVAILABILITY_LABELS.limited).toBe("Limited Space");
    expect(AVAILABILITY_LABELS.full).toBe("Full");
  });
});
