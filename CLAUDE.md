# Project conventions for Claude

## Typography: never write em-dash or en-dash in public text

Do not use em-dash (`—`, U+2014) or en-dash (`–`, U+2013) in any text that
ships to readers of the site. They read as AI-generated and look out of
place against the rest of the copy.

**In scope** (no long dashes): user-facing content rendered into the site:
`src/_data/*.json`, `src/pages/*.njk`, `src/_includes/*.njk`,
`src/llms*.njk`, and any other source under `src/` that becomes part of a
shipped page, JSON-LD payload, sitemap, or `llms.txt`.

**Out of scope** (long dashes are fine): internal/developer-only artifacts
that never reach the public site: commit messages, `CHANGELOG.md`, code
comments, test descriptions, this file, and other repo docs.

Use these instead, depending on intent:

- Parenthetical aside (`X — like this — Y`): use commas, parentheses, or
  split into two sentences.
- Colon-style introduction (`Yes — bio, logos, ...`): use a colon
  (`Yes: bio, logos, ...`).
- Numeric range (`2–3 days`): use a regular hyphen (`2-3 days`) or words
  (`2 to 3 days`).
- SEO title separator (`Page — Site`): use a pipe with spaces
  (`Page | Site`).
- Image `alt` text: use a comma.

The unit test `tests/unit/no-em-dash.test.js` enforces this rule and will
fail the build if a dash slips into `src/`.
