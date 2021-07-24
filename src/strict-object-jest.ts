import {
  strictObject as strictObjectRaw,
  StrictObjectConfig,
} from "./strict-object";
export { isStrictObject, StrictObjectConfig } from "./strict-object";

const jestConfig: StrictObjectConfig = {
  ignore: [
    // Jest's expect checks these objects
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    "nodeType",
    // Snapshots:
    "$$typeof",
    "tagName",
    "@@__IMMUTABLE_ITERABLE__@@",
    "@@__IMMUTABLE_RECORD__@@",
    "_isMockFunction",
    "toJSON",
  ],
};

export const strictObject: typeof strictObjectRaw = (object, name, config) => {
  const mergedConfig = config
    ? {
        ...config,
        ignore: config.ignore
          ? [...config.ignore, ...jestConfig.ignore!]
          : jestConfig.ignore,
      }
    : jestConfig;
  return strictObjectRaw(object, name, mergedConfig);
};
export default strictObject;
