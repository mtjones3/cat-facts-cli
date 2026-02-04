import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { makeSpeechBubble } from "./lib.js";

// ── Unit tests: speech bubble formatting ────────────────────────────

describe("makeSpeechBubble", () => {
  it("wraps a short single-line fact with < > delimiters", () => {
    const bubble = makeSpeechBubble("Cats are great.");
    const lines = bubble.split("\n");

    assert.match(lines[0], /^[\s_]+$/);                   // top border
    assert.match(lines[1], /^< Cats are great\.\s*>$/);   // single-line uses < >
    assert.match(lines[lines.length - 1], /^[\s-]+$/);    // bottom border
  });

  it("wraps long text into multiple lines with / \\ | delimiters", () => {
    const longText =
      "Cats have over 20 vocalizations including the purr and they are wonderful creatures that have lived with humans for thousands of years.";
    const bubble = makeSpeechBubble(longText, 40);
    const lines = bubble.split("\n");

    assert.ok(lines.length > 3, "should have multiple body lines");
    assert.match(lines[1], /^\//);                         // first body line starts with /
    assert.match(lines[lines.length - 2], /^\\/);          // last body line starts with \
  });

  it("respects maxWidth parameter", () => {
    const text = "A cat can jump up to six times its length which is very impressive.";
    const bubble = makeSpeechBubble(text, 30);
    const lines = bubble.split("\n");

    // All body lines (excluding top/bottom border) should be <= maxWidth + 4 (delimiters + spaces)
    for (let i = 1; i < lines.length - 1; i++) {
      assert.ok(lines[i].length <= 34, `Line ${i} too long: "${lines[i]}"`);
    }
  });

  it("handles a single word", () => {
    const bubble = makeSpeechBubble("Meow");
    assert.ok(bubble.includes("< Meow >"));
  });
});

// ── Integration tests: CLI execution ────────────────────────────────

function runCLI(args = []) {
  return execFileSync("node", ["index.js", ...args], {
    encoding: "utf8",
    timeout: 15000,
  });
}

function runCLIWithError(args = []) {
  try {
    execFileSync("node", ["index.js", ...args], {
      encoding: "utf8",
      timeout: 15000,
    });
    return { exitCode: 0, stderr: "" };
  } catch (err) {
    return { exitCode: err.status, stderr: err.stderr };
  }
}

describe("CLI", () => {
  it("--help prints usage information and exits 0", () => {
    const out = runCLI(["--help"]);
    assert.match(out, /USAGE/);
    assert.match(out, /--count/);
    assert.match(out, /--help/);
    assert.match(out, /--version/);
  });

  it("-h also prints help", () => {
    const out = runCLI(["-h"]);
    assert.match(out, /USAGE/);
  });

  it("--version prints the version number", () => {
    const out = runCLI(["--version"]);
    assert.match(out.trim(), /^\d+\.\d+\.\d+$/);
  });

  it("default invocation prints a cat fact with ASCII art", () => {
    const out = runCLI();
    assert.match(out, /___/);            // figlet banner (ASCII art)
    assert.match(out, /\/\\_\/\\/);     // cat face
    assert.match(out, /\( o\.o \)/);    // cat eyes
  });

  it("-n 2 prints two facts separated by a divider", () => {
    const out = runCLI(["-n", "2"]);
    assert.match(out, /~{20,}/);        // tilde divider between facts
    // Should have two cat art instances
    const catCount = (out.match(/\( o\.o \)/g) || []).length;
    assert.equal(catCount, 2);
  });

  it("invalid flag exits with error", () => {
    const { exitCode, stderr } = runCLIWithError(["--nope"]);
    assert.equal(exitCode, 1);
    assert.match(stderr, /Error/i);
  });

  it("-n 0 exits with error", () => {
    const { exitCode, stderr } = runCLIWithError(["-n", "0"]);
    assert.equal(exitCode, 1);
    assert.match(stderr, /positive integer/i);
  });

  it("-n abc exits with error", () => {
    const { exitCode, stderr } = runCLIWithError(["-n", "abc"]);
    assert.equal(exitCode, 1);
    assert.match(stderr, /positive integer/i);
  });
});
