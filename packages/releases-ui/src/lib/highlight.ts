export type Indices = readonly [number, number][];

export function highlightText(text: string, indexArray: Indices | undefined) {
  if (!indexArray?.length) {
    return text;
  }
  // First create new arrays, splitting the current
  // ones up if neccessary to avoid overlaps with
  // html tags
  //"check the Runtime"
  for (let i = indexArray.length - 1; i >= 0; i--) {
    const index = indexArray[i];
    const match = text.slice(index[0], index[1] + 1);
    const parts = match.split(/(<[^>]+?>)/g);
    let highlightedText = '';
    for (let j = 0; j < parts.length; j += 2) {
      highlightedText += `<mark>${parts[j]}</mark>`;
      if (parts[j + 1]) {
        highlightedText += parts[j + 1];
      }
    }
    text = text.slice(0, index[0]) + highlightedText + text.slice(index[1] + 1);
    console.log({
      before: match,
      after: highlightedText,
    });
  }
  return text;
}
