// ── Fallback facts ──────────────────────────────────────────────────

export const FALLBACK_FACTS = [
  "Cats sleep for about 70% of their lives.",
  "A group of cats is called a clowder.",
  "Cats have over 20 vocalizations, including the purr.",
  "A cat's hearing is much more sensitive than a human's or dog's.",
  "Cats can rotate their ears 180 degrees.",
  "The first cat in space was a French cat named Felicette in 1963.",
  "Cats have a specialized collarbone that allows them to always land on their feet.",
  "A cat can jump up to six times its length.",
  "Cats spend about 30-50% of their day grooming themselves.",
  "The oldest known pet cat was found in a 9,500-year-old grave on Cyprus.",
];

// ── API fetching ────────────────────────────────────────────────────

export async function fetchCatFact() {
  try {
    const res = await fetch("https://catfact.ninja/fact", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.fact;
  } catch {
    return FALLBACK_FACTS[Math.floor(Math.random() * FALLBACK_FACTS.length)];
  }
}

// ── Speech bubble ───────────────────────────────────────────────────

export function makeSpeechBubble(text, maxWidth = 50) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if (current && (current.length + 1 + word.length) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);

  const width = Math.max(...lines.map((l) => l.length));
  const top    = " " + "_".repeat(width + 2);
  const bottom = " " + "-".repeat(width + 2);

  let body;
  if (lines.length === 1) {
    body = [`< ${lines[0].padEnd(width)} >`];
  } else {
    body = lines.map((line, i) => {
      const padded = line.padEnd(width);
      if (i === 0)                return `/ ${padded} \\`;
      if (i === lines.length - 1) return `\\ ${padded} /`;
      return `| ${padded} |`;
    });
  }

  return [top, ...body, bottom].join("\n");
}

// ── ASCII cat ───────────────────────────────────────────────────────

export const CAT_ART = String.raw`
    \
     \
       /\_/\
      ( o.o )
       > ^ <
      /|   |\
     (_|   |_)`;
