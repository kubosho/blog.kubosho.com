export function addWbr(text: string): string {
  const t = text;
  return t.replace(/、/g, '$&<wbr />');
}
