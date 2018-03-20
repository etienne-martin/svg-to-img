import { getFileTypeFromPath, stringifyFunction } from "../helpers";

// Mock URL.createObjectURL(blob);
Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: jest.fn(() => {
    return `blob:null/f2747239-6dc7-48bf-80c8-dd0ae9f70d7f`;
  })
});

// Mock img.naturalWidth
Object.defineProperty(HTMLImageElement.prototype, "naturalHeight", {
  writable: true,
  value: 10
});

// Mock img.naturalWidth
Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
  writable: true,
  value: 10
});

// Mock img.addEventListener("onload", () => {});
Element.prototype.addEventListener = jest.fn((event, callback) => {
  setTimeout(callback, 100);
});

describe("Helper functions", () => {
  test("Get file type from path", async () => {
    const fileType = await getFileTypeFromPath("test.jpg");

    expect(fileType).toBe("jpeg");
  });

  test("Stringify function", async () => {
    const func = stringifyFunction((str: string, obj: object, num: number) => str + obj + num, "a", {a: 1}, 1);

    expect(func).toEqual(`((str, obj, num) => str + obj + num)(\`a\`,{"a":1},1)`);
  });
});
