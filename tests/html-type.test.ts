import { describe, expect, it } from 'vitest';
import { countHtmlText, sliceHtmlByText } from '../src/lib/content/html-type';

describe('html typewriter slicing', () => {
  it('counts only text and entities, not tags', () => {
    expect(countHtmlText('<p>Hi <strong>V</strong></p>')).toBe(4);
    expect(countHtmlText('<p>A&nbsp;B</p>')).toBe(3);
  });

  it('keeps tags balanced while revealing text', () => {
    const html = '<p>Hi <strong>Varectra</strong></p>';
    expect(sliceHtmlByText(html, 2)).toBe('<p>Hi</p>');
    expect(sliceHtmlByText(html, 5)).toBe('<p>Hi <strong>Va</strong></p>');
    expect(sliceHtmlByText(html, countHtmlText(html))).toBe(html);
    expect(sliceHtmlByText(html, 5, '<span class="caret">█</span>'))
      .toBe('<p>Hi <strong>Va<span class="caret">█</span></strong></p>');
  });
});
