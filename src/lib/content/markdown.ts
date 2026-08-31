const escapeHtml = (value: string): string =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

/**
 * Renders the deliberately small Markdown subset used by interactive viewers.
 * Escaping happens first, so CMS authors cannot inject executable HTML.
 */
export const renderSafeMarkdown = (source: string): string => {
  const escaped = escapeHtml(source.trim());
  return escaped
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${paragraph
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')}</p>`)
    .join('');
};
