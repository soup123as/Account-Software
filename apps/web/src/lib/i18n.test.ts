import { describe, expect, it } from 'vitest';
import { directionFor } from './i18n';

describe('directionFor', () => {
  it.each([
    ['en', 'ltr'],
    ['en-AU', 'ltr'],
    ['ar', 'rtl'],
    ['ar-AE', 'rtl'],
    ['he', 'rtl'],
  ])('%s is %s', (language, direction) => {
    expect(directionFor(language)).toBe(direction);
  });
});
