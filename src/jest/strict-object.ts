import {
  mergeConfigs,
  strictObject as strictObjectRaw,
  StrictObjectConfig,
} from "../strict-object";

export {
  isStrictObject,
  mergeConfigs,
  StrictObjectConfig,
  DeepPartial,
} from "../strict-object";

export const jestConfig = {
  ignore: [
    // "expect" looks for these properties:
    "asymmetricMatch",
    Symbol.iterator,
    Symbol.toStringTag,
    "nodeType",
    // and "snapshots" looks for:
    "$$typeof",
    "tagName",
    "@@__IMMUTABLE_ITERABLE__@@",
    "@@__IMMUTABLE_RECORD__@@",
    "_isMockFunction",
    "toJSON",
  ],
};

export const strictObject: typeof strictObjectRaw = (object, name, config) => {
  return strictObjectRaw(object, name, mergeConfigs(jestConfig, config));
};
export default strictObject;
