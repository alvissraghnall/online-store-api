

export const transformObj = <T extends Record<string, unknown>>(obj: T, predicate: (val: unknown, key: keyof T) => boolean) => {
  return Object.keys(obj).reduce<T>(
    (memo, key: keyof T) => {
      if(predicate(obj[key], key)) {
        memo[key] = obj[key];
      }
      return memo;
    }, {} as T
  );
};

export const omit = <T extends Record<string, unknown>>(obj: T, items: (keyof T)[]) => transformObj(obj, (value, key) => !items.includes(key));
export const pick = <T extends Record<string, unknown>>(obj: T, items: (keyof T)[]) => transformObj(obj, (value, key) => items.includes(key));
