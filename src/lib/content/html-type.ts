const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'col', 'wbr']);

const readTag = (html: string, start: number): { tag: string; end: number } => {
  const end = html.indexOf('>', start);
  if (end === -1) return { tag: html.slice(start), end: html.length };
  return { tag: html.slice(start, end + 1), end: end + 1 };
};

const readEntity = (html: string, start: number): { entity: string; end: number } => {
  const end = html.indexOf(';', start);
  if (end === -1 || end - start > 8) return { entity: html[start] ?? '', end: start + 1 };
  return { entity: html.slice(start, end + 1), end: end + 1 };
};

const tagName = (tag: string): string =>
  tag.match(/^<\/?([a-zA-Z0-9]+)/)?.[1]?.toLowerCase() ?? '';

/** Counts visible text units in escaped HTML (characters and entities). */
export const countHtmlText = (html: string): number => {
  let count = 0;
  let index = 0;
  while (index < html.length) {
    const current = html[index];
    if (current === '<') {
      index = readTag(html, index).end;
      continue;
    }
    if (current === '&') {
      index = readEntity(html, index).end;
      count += 1;
      continue;
    }
    count += 1;
    index += 1;
  }
  return count;
};

/**
 * Reveals the first `visible` text units of HTML while keeping tags balanced
 * so partial markup can be injected safely during a typewriter animation.
 */
export const sliceHtmlByText = (html: string, visible: number, suffix = ''): string => {
  const openTags: string[] = [];
  let output = '';
  let count = 0;
  let index = 0;

  while (index < html.length && count < visible) {
    const current = html[index];
    if (current === '<') {
      const { tag, end } = readTag(html, index);
      const name = tagName(tag);
      output += tag;
      if (name) {
        if (tag.startsWith('</')) {
          const match = openTags.lastIndexOf(name);
          if (match !== -1) openTags.splice(match, 1);
        } else if (!tag.endsWith('/>') && !VOID_TAGS.has(name)) {
          openTags.push(name);
        }
      }
      index = end;
      continue;
    }

    if (current === '&') {
      const { entity, end } = readEntity(html, index);
      output += entity;
      count += 1;
      index = end;
      continue;
    }

    output += current;
    count += 1;
    index += 1;
  }

  output += suffix;
  for (let tagIndex = openTags.length - 1; tagIndex >= 0; tagIndex -= 1) {
    output += `</${openTags[tagIndex]}>`;
  }

  return output;
};
