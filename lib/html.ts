const BLOCKED_TAGS = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];

export function sanitizeArticleHtml(input: string): string {
  if (!input) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');

  BLOCKED_TAGS.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => el.remove());
  });

  doc.body.querySelectorAll('*').forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value.trim().toLowerCase();

      if (attrName.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }

      if ((attrName === 'href' || attrName === 'src') && attrValue.startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}
