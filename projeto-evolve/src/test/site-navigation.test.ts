import { describe, expect, it } from "vitest";
import { resolveRoute, sitePathFromHash } from "@/router";

describe("site navigation", () => {
  it.each([
    ["#pm-standard", "privacymasters"],
    ["#ev-servizi", "bevolve"],
    ["#ta-sentieri", "tuttoaltopiano"],
    ["#ob-servizi", "oblivio"],
    ["#mc-contatti", "medicleo"],
    ["#/preview/medicleo", "medicleo"],
    ["#/site/oblivio", "oblivio"],
    ["", "privacymasters"],
  ])("opens the correct site for %s", (hash, slug) => {
    expect(resolveRoute(sitePathFromHash(hash))).toEqual({ kind: "preview", slug });
  });
});
