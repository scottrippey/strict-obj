export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Primitive
    ? T[P]
    : T[P] extends Function
    ? T[P]
    : T[P] extends Date
    ? T[P]
    : T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};
