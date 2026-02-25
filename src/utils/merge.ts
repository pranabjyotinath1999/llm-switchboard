/**
 * Basic deep merge utility for configuration objects.
 * Arrays and nulls are replaced rather than concatenated.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Deep merges sources into target.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepMerge<T>(target: any, ...sources: any[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}
