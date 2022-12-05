export function debounce(fn: Function, delay: number) {
  let timeoutId: number;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
  };
}

export function toDateIso(date: string | Date) {
  return new Date(date).toISOString();
}

export function toDateLocal(date: string | Date) {
  return new Date(date).toLocaleDateString();
}
