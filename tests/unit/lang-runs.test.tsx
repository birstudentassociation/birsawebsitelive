import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { langRuns, rehypeLangRuns, splitLangRuns } from "@/lib/lang-runs";
import ErrorMessage from "@/components/ErrorMessage";

describe("splitLangRuns", () => {
  it("tags Thai runs inside English text", () => {
    expect(splitLangRuns("Ask your คกร. representative", "en")).toEqual([
      { text: "Ask your " },
      { text: "คกร.", lang: "th" },
      { text: " representative" },
    ]);
  });

  it("keeps spaced and dotted Thai phrases whole", () => {
    const runs = splitLangRuns("The กกต.ร. runs the ศูนย์ ความเป็นเลิศ vote", "en");
    expect(runs.filter((run) => run.lang).map((run) => run.text)).toEqual([
      "กกต.ร.",
      "ศูนย์ ความเป็นเลิศ",
    ]);
  });

  it("leaves Thai pages and plain English untouched", () => {
    expect(splitLangRuns("สมัครชมรม BIRSA", "th")).toEqual([{ text: "สมัครชมรม BIRSA" }]);
    expect(splitLangRuns("Join a club", "en")).toEqual([{ text: "Join a club" }]);
  });
});

describe("langRuns", () => {
  it("renders Thai runs in a span with lang", () => {
    const html = renderToStaticMarkup(<p>{langRuns("Call คณะ today", "en")}</p>);
    expect(html).toBe('<p>Call <span lang="th">คณะ</span> today</p>');
  });
});

describe("rehypeLangRuns", () => {
  it("wraps text but not code or elements that already set lang", () => {
    const tree = {
      type: "root",
      children: [
        { type: "element", tagName: "p", children: [{ type: "text", value: "See ทะเบียน" }] },
        { type: "element", tagName: "code", children: [{ type: "text", value: "ทะเบียน" }] },
        {
          type: "element",
          tagName: "span",
          properties: { lang: "th" },
          children: [{ type: "text", value: "ทะเบียน" }],
        },
      ],
    };
    rehypeLangRuns({ locale: "en" })(tree);
    const [para, code, span] = tree.children;
    expect(para?.children).toEqual([
      { type: "text", value: "See " },
      {
        type: "element",
        tagName: "span",
        properties: { lang: "th" },
        children: [{ type: "text", value: "ทะเบียน" }],
      },
    ]);
    expect(code?.children).toEqual([{ type: "text", value: "ทะเบียน" }]);
    expect(span?.children).toEqual([{ type: "text", value: "ทะเบียน" }]);
  });
});

describe("ErrorMessage", () => {
  it("prefixes a hidden Error: in the message's language", () => {
    expect(renderToStaticMarkup(<ErrorMessage>Enter your name</ErrorMessage>)).toContain(
      '<span class="sr-only">Error: </span>Enter your name'
    );
    expect(renderToStaticMarkup(<ErrorMessage>กรอกชื่อของคุณ</ErrorMessage>)).toContain(
      '<span class="sr-only">ข้อผิดพลาด: </span>กรอกชื่อของคุณ'
    );
  });

  it("renders nothing without a message", () => {
    expect(renderToStaticMarkup(<ErrorMessage>{undefined}</ErrorMessage>)).toBe("");
  });
});
