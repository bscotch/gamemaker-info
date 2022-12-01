import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

export type Validator<T> = { parse: (data: any) => T };

export function countNonUnique(arr: any[]): number {
  return arr.length - new Set(arr).size;
}

export async function fetchXml<T = unknown>(
  url: string,
  validator?: Validator<T>,
): Promise<T> {
  const res = await fetchUrl(url);
  try {
    const data = await res.text();
    const asJson = new XMLParser().parse(data);
    return validator ? validator.parse(asJson) : (asJson as T);
  } catch (err) {
    throw new Error(
      `Error parsing XML from ${url}: ${
        isError(err) ? err.message : 'UNKNOWN'
      }`,
    );
  }
}

export async function fetchJson<T = unknown>(
  url: string,
  validator?: Validator<T>,
): Promise<T> {
  const res = await fetchUrl(url);
  try {
    const parsed = await res.json();
    return validator ? validator.parse(parsed) : (parsed as T);
  } catch (err) {
    throw new Error(
      `Error parsing JSON from ${url}: ${
        isError(err) ? err.message : 'UNKNOWN'
      }`,
    );
  }
}

function isError(thing: unknown): thing is Error {
  return thing instanceof Error;
}

async function fetchUrl(url: string) {
  try {
    const res = await fetch(url);
    if (res.status >= 300) {
      throw new Error(
        `Error fetching "${url}": ${res.status} ${res.statusText}`,
      );
    }
    return res;
  } catch (err) {
    throw new Error(
      `Error fetching "${url}": ${isError(err) ? err.message : 'UNKNOWN'}`,
    );
  }
}
