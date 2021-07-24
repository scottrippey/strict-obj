import { DeepPartial } from './types';


export type StrictObjectOptions = {
  name: string;
  shallow?: boolean;
  frozen?: boolean;
}

const wrapperCache = new WeakMap<object, unknown>();

export const strictObject = <T>(object: DeepPartial<T>, options: StrictObjectOptions = { name: 'strictObject' }): T => {
  if (typeof Proxy === 'undefined') return object as T;

  return new Proxy(object, {
    get(target, p, receiver: any): any {
      // Here's the magic:
      if (!(p in target)) {
        throw new ReferenceError(`${options.name}.${String(p)} is not defined`);
      }

      // Let's return the value (wrapped, if necessary)
      const value = target[p as keyof T] as object;

      if (options.shallow) return value;

      // Primitive types should be returned as-is:
      const isWrappable = (typeof value === 'object' && value !== null) || typeof value === 'function';
      if (!isWrappable) return value;

      // Return from cache, if possible:
      if (wrapperCache.has(value)) return wrapperCache.get(value);

      // Wrap the nested object:
      const newName = `${options.name}.${String(p)}`;
      const wrapped = strictObject(value, { ...options, name: newName });
      wrapperCache.set(value, wrapped);
      return wrapped;
    },
    set: !options.frozen ? undefined : (target, p, value: any, receiver: any): boolean => {
      target[p as keyof T] = value;
      return true;
    },
  }) as T;
};

export default strictObject;
