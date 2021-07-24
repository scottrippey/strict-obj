import strictObject from './strict-object';

type TestData = {
  one: number;
  two: string;
  three: {
    a: string;
    b: string;
  };
  nested: TestData;
};

describe('strictObject', () => {
  describe('the basics', () => {
    let data: TestData;
    beforeEach(() => {
      data = strictObject<TestData>({ one: 1, two: 'TWO' });
    });

    it('should allow access to existing properties', () => {
      expect(data.one).toEqual(1);
      expect(data.two).toEqual('TWO');
    });

    it('should allow setting existing properties', () => {
      data.one = 111;
      expect(data.one).toEqual(111);
      data.two = 't-w-o';
      expect(data.two).toEqual('t-w-o');
    });

    it('should not allow access to non-defined properties', () => {
      expect(() => data.three).toThrowErrorMatchingInlineSnapshot(
        `"strictObject.three is not defined"`
      );
    });

    it('should allow setting of non-defined properties', () => {
      data.three = { a: 'A', b: 'B' };
      expect(data.three.a).toEqual('A');
      expect(data.three.b).toEqual('B');
    });
  });

  describe('nested behavior', () => {
    let data: TestData;
    beforeEach(() => {
      data = strictObject<TestData>({
        one: 1,
        two: 'TWO',
        nested: { one: 111, two: '222' },
      });
    });

    it('', () => {
      expect(data.nested.one).toEqual(111);
      expect(data.nested.two).toEqual('222');
      expect(() => data.nested.three).toThrowErrorMatchingInlineSnapshot(
        `"strictObject.nested.three is not defined"`
      );
    });
  });
});
