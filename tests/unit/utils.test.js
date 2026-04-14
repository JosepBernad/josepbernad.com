import { describe, it, expect } from 'vitest';
import { resolveKey, formatFilmDate } from '../../src/js/utils.js';

describe('resolveKey', () => {
  it('resolves a top-level key', () => {
    expect(resolveKey('title', { title: 'Films' })).toBe('Films');
  });

  it('resolves a nested dot-notation key', () => {
    const obj = { nav: { films: 'Films', about: 'About' } };
    expect(resolveKey('nav.films', obj)).toBe('Films');
    expect(resolveKey('nav.about', obj)).toBe('About');
  });

  it('resolves deeply nested keys', () => {
    const obj = { a: { b: { c: 'deep' } } };
    expect(resolveKey('a.b.c', obj)).toBe('deep');
  });

  it('returns undefined for a missing key', () => {
    expect(resolveKey('nav.missing', { nav: {} })).toBeUndefined();
  });

  it('returns undefined when an intermediate key is missing', () => {
    expect(resolveKey('nav.films', {})).toBeUndefined();
  });

  it('returns undefined when obj is null', () => {
    expect(resolveKey('nav', null)).toBeUndefined();
  });

  it('returns undefined when obj is undefined', () => {
    expect(resolveKey('nav', undefined)).toBeUndefined();
  });
});

describe('formatFilmDate', () => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  it('formats EN as "year month"', () => {
    expect(formatFilmDate('en', '2024', 9, months)).toBe('2024 October');
  });

  it('formats ES as "month year"', () => {
    const esMonths = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    expect(formatFilmDate('es', '2024', 9, esMonths)).toBe('octubre 2024');
  });

  it('formats CA as "month year"', () => {
    const caMonths = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny',
      'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
    expect(formatFilmDate('ca', '2025', 0, caMonths)).toBe('gener 2025');
  });

  it('handles January (index 0)', () => {
    expect(formatFilmDate('en', '2025', 0, months)).toBe('2025 January');
  });

  it('handles December (index 11)', () => {
    expect(formatFilmDate('en', '2023', 11, months)).toBe('2023 December');
  });
});
