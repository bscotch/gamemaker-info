import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';
import { assert } from '@bscotch/utility/browser';
import { decode } from 'html-entities';
import { z } from 'zod';

export type Validator<T> = { parse: (data: any) => T };

export type ArrayItemScore<T> = (item: T, idx: number, items: T[]) => number;
export function findMax<T>(items: T[]): T;
export function findMax<T>(items: T[], byProperty: keyof T): T;
export function findMax<T>(items: T[], score: ArrayItemScore<T>): T;
export function findMax<T>(
  items: T[],
  propOrFunc?: ArrayItemScore<T> | keyof T,
): T {
  assert(items.length, 'Cannot find max of empty array');
  const score = (item: T, idx: number) =>
    propOrFunc === undefined
      ? item
      : typeof propOrFunc === 'function'
      ? propOrFunc(item, idx, items)
      : item[propOrFunc];
  let maxScore = score(items[0], 0);
  let maxIdx = 0;
  for (let i = 1; i < items.length; i++) {
    const itemScore = score(items[i], i);
    if (itemScore > maxScore) {
      maxScore = itemScore;
      maxIdx = i;
    }
  }
  return items[maxIdx];
}

export function htmlString() {
  return z.string().transform((s) => {
    if (!s || typeof s !== 'string') {
      return s;
    }
    // decode HTML entities
    s = decode(s.trim());
    // remove anchor targets
    s = s.replace(/\btarget=[^\s>]+/g, '');
    // remove excess space
    s = s.replace(/ +/g, ' ');
    s = s.replace(/\r/g, '');
    s = s.replace(/[\t ]*\n[\t ]*(\n[\t ]*)+/g, '\n\n');
    return s;
  });
}

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
