import { describe, expect, it } from "vitest";
import { GET } from "@/app/llms.txt/route";

describe("/llms.txt", () => {
  it("serves Markdown with an H1 and links into the site", async () => {
    const response = GET();
    expect(response.headers.get("content-type")).toContain("text/markdown");

    const body = await response.text();
    expect(body.split("\n")[0]).toMatch(/^# \S/);
    expect(body).toContain("## Student life guides");
    expect(body).toContain("## Applying to BIR");
    expect(body).toContain("/en/services/applying-to-bir)");
    expect(body).toMatch(/- \[[^\]]+\]\(https?:\/\/[^)]+\/en\/news\/[a-z0-9-]+\)/);
  });
});
