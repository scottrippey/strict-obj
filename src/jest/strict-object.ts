import {
  strictObject as strictObjectRaw,
  StrictObjectConfig,
} from "../strict-object";

export { isStrictObject, StrictObjectConfig } from "../strict-object";

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

function mergeConfigs(
  configA: StrictObjectConfig | undefined,
  configB: StrictObjectConfig | undefined
) {
  if (!configA) return configB;
  if (!configB) return configA;

  const result = { ...configA, ...configB };
  if (configA.ignore && configB.ignore) {
    result.ignore = [...configA.ignore, ...configB.ignore];
  }
  return result;
}

export const strictObject: typeof strictObjectRaw = (object, name, config) => {
  return strictObjectRaw(object, name, mergeConfigs(jestConfig, config));
};
export default strictObject;
