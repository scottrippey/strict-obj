import { strictObject } from "./strict-object-jest";

type TestData = {
  one: number;
  two: string;
  three: {
    a: string;
    b: string;
  };
  nested: TestData;
};

describe("strict-object/jest", () => {
  let data: TestData;
  beforeEach(() => {
    data = strictObject<TestData>({
      one: 1,
      nested: { one: 111 },
    });
  });

  it("should work with expect.toEqual", () => {
    expect(data).toEqual({ one: 1, nested: { one: 111 } });
    expect(data).not.toEqual({ one: 1 });
    expect(data).not.toEqual({ two: "two" });
  });
  it("should work with expect.toMatchObject", () => {
    expect(data).toMatchObject({ one: 1 });
    expect(data).toMatchObject({ nested: { one: 111 } });
    expect(data).not.toMatchObject({ two: "two" });
    expect(data).not.toMatchObject({ one: 111 });
  });
  it("should work with snapshots", () => {
    expect(data).toMatchInlineSnapshot(`
      Object {
        "nested": Object {
          "one": 111,
        },
        "one": 1,
      }
    `);
  });
});
