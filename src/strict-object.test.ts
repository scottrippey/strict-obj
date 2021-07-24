import strictObject from "./strict-object";

type TestData = {
  one: number;
  two: string;
  three: {
    a: string;
    b: string;
  };
  nested: TestData;
};

describe("strictObject", () => {
  describe("the basics", () => {
    let data: TestData;
    beforeEach(() => {
      data = strictObject<TestData>({
        one: 1,
        two: "TWO",
        nested: undefined,
      });
    });

    it("should allow access to existing properties", () => {
      expect(data.one).toEqual(1);
      expect(data.two).toEqual("TWO");
      expect(data.nested).toEqual(undefined);
    });

    it("should allow setting existing properties", () => {
      data.one = 111;
      expect(data.one).toEqual(111);
      data.two = "t-w-o";
      expect(data.two).toEqual("t-w-o");
    });

    it("should not allow access to non-defined properties", () => {
      expect(() => data.three).toThrowErrorMatchingInlineSnapshot(
        `"strictObject.three is not defined"`
      );
    });

    it("should allow setting of non-defined properties", () => {
      data.three = { a: "A", b: "B" };
      expect(data.three.a).toEqual("A");
      expect(data.three.b).toEqual("B");
    });
  });

  describe("name", () => {
    it("errors should show helpful names", () => {
      const data = strictObject<TestData>(
        {
          nested: {
            three: {},
          },
        },
        "data"
      );
      expect(() => data.one).toThrowErrorMatchingInlineSnapshot(
        `"data.one is not defined"`
      );
      expect(() => data.nested.one).toThrowErrorMatchingInlineSnapshot(
        `"data.nested.one is not defined"`
      );
      expect(() => data.nested.three.a).toThrowErrorMatchingInlineSnapshot(
        `"data.nested.three.a is not defined"`
      );
    });
  });

  describe("nested behavior", () => {
    let data: TestData;
    beforeEach(() => {
      data = strictObject<TestData>({
        one: 1,
        two: "TWO",
        nested: { one: 111, two: "222" },
      });
    });

    it("should be able to get nested properties", () => {
      expect(data.nested.one).toEqual(111);
      expect(data.nested.two).toEqual("222");
    });

    it("should be able to set nested properties", () => {
      data.nested.one = 111111;
      expect(data.nested.one).toEqual(111111);
    });

    it("should throw an error when a nested object is missing a property", () => {
      expect(() => data.nested.three).toThrowErrorMatchingInlineSnapshot(
        `"strictObject.nested.three is not defined"`
      );
    });

    it("should be able to set and read a nested property", () => {
      data.nested.three = { a: "A", b: "B" };
      expect(data.nested.three.a).toEqual("A");
      expect(data.nested.three.b).toEqual("B");
    });

    it("should handle circular references just fine", () => {
      data.nested = data;
      expect(data.nested.one).toEqual(1);
      expect(data.nested.nested.one).toEqual(1);
      expect(data.nested.nested.nested.one).toEqual(1);
    });
  });

  describe("cache", () => {
    let data: TestData;
    beforeEach(() => {
      data = strictObject<TestData>({
        three: { a: "A", b: "B" },
      });
      data.nested = data;
    });
    it("it should return the same exact smart object each time", () => {
      expect(data.three === data.three).toBeTruthy();
      expect(data === data.nested).toBeTruthy();
      expect(data.nested === data.nested).toBeTruthy();
      expect(data === data.nested.nested.nested).toBeTruthy();
      expect(data.three === data.nested.three).toBeTruthy();
      expect(strictObject(data) === data).toBeTruthy();
      expect(strictObject(data.nested) === data).toBeTruthy();
      expect(strictObject(data.three) === data.three).toBeTruthy();
    });
    it("error messages from circular references do not have nested names", () => {
      expect(() => data.nested.nested.one).toThrowErrorMatchingInlineSnapshot(
        `"strictObject.one is not defined"`
      );
    });
  });
});
