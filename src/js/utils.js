/**
 * Resolves a dot-notation key path against an object.
 * resolveKey('nav.films', { nav: { films: 'Films' } }) → 'Films'
 */
export function resolveKey(key, obj) {
  const keys = key.split('.');
  let value = obj;
  for (const k of keys) {
    if (value == null) return undefined;
    value = value[k];
  }
  return value;
}

/**
 * Formats a film month/year for display.
 * EN: "2024 October" | ES/CA: "octubre 2024"
 */
export function formatFilmDate(lang, year, monthIndex, months) {
  const monthName = months[monthIndex];
  return lang === 'en' ? `${year} ${monthName}` : `${monthName} ${year}`;
}
