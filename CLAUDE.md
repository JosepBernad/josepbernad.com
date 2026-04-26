# Project conventions for Claude

## Typography: never write em-dash or en-dash

Do not use em-dash (`—`, U+2014) or en-dash (`–`, U+2013) anywhere in this
project. They read as AI-generated and look out of place against the rest of
the copy.

This rule applies to **all** files: user-facing content (`src/_data/*.json`,
`src/pages/*.njk`, `src/_includes/*.njk`, `src/llms*.njk`, etc.), code
comments, test descriptions, commit messages, and changelog entries.

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
