import { DeepPartial } from "./types";

export type StrictObjectConfig = {
  shallow?: boolean;
  throwOnSet?: boolean;
  ignore?: Array<string | number | symbol>;
};

const cache = new WeakMap<object, unknown>();

const isStrictObjectSymbol = Symbol("isStrictObjectSymbol");

export function strictObject<T>(
  object: DeepPartial<T>,
  name: string = "strictObject",
  config?: StrictObjectConfig
): T {
  if (typeof Proxy === "undefined") {
    // Nothing we can do here!
    return object as T;
  }

  // Return from cache, if possible:
  if (isStrictObject(object)) {
    return object as T;
  }
  if (cache.has(object)) {
    return cache.get(object) as T;
  }

  const proxyHandler: ProxyHandler<DeepPartial<T>> = {
    get(target, p, receiver: any): any {
      if (p === isStrictObjectSymbol) return isStrictObjectSymbol;

      // Ignore certain props:
      if (config?.ignore?.includes(p)) return target[p as keyof T];

      // Here's the magic:
      if (!(p in target)) {
        const error = new ReferenceError(`${name}.${String(p)} is not defined`);
        Error.captureStackTrace(error, proxyHandler.get);
        throw error;
      }

      // Let's return the value (wrapped, if necessary)
      const value = target[p as keyof T] as object;

      if (config?.shallow) return value;

      // Primitive types should be returned as-is:
      const isWrappable =
        (typeof value === "object" && value !== null) ||
        typeof value === "function";
      if (!isWrappable) return value;

      // Wrap the nested object:
      const newName = `${name}.${String(p)}`;
      return strictObject(value, newName, config);
    },
    set: !config?.throwOnSet
      ? undefined
      : (target, p, value: any, receiver: any): boolean => {
          if (!(p in target) && config?.ignore?.includes(p)) {
            const error = new ReferenceError(
              `${name}.${String(p)} is not defined`
            );
            Error.captureStackTrace(error, proxyHandler.set);
            throw error;
          }
          target[p as keyof T] = value;
          return true;
        },
  };
  const wrapper = new Proxy(object, proxyHandler) as T;

  cache.set(object, wrapper);

  return wrapper;
}
export default strictObject;

export function isStrictObject(object: unknown): boolean {
  if (typeof object === "object" && object !== null) {
    return (object as any)[isStrictObjectSymbol] === isStrictObjectSymbol;
  }
  return false;
}

export function mergeConfigs(
  configA: StrictObjectConfig | undefined,
  configB: StrictObjectConfig | undefined
): StrictObjectConfig | undefined {
  if (!configA) return configB;
  if (!configB) return configA;

  const result = {
    ...configA,
    ...configB,
  };
  if (configA.ignore && configB.ignore) {
    result.ignore = [...configA.ignore, ...configB.ignore];
  }
  return result;
}
