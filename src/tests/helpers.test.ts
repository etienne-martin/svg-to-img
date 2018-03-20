import { getFileTypeFromPath, stringifyFunction, renderSvg } from "../helpers";
import { config } from "../constants";

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

  test("Render SVG with all options", async () => {
    const base64 = await renderSvg("<svg xmlns='http://www.w3.org/2000/svg'/>", {
      width: 100,
      height: 100,
      type: "jpeg",
      quality: 1,
      background: "#09f",
      jpegBackground: config.jpegBackground
    });

    expect(base64).toBe("");
  });

  test("Render SVG with default options", async () => {
    const base64 = await renderSvg("<svg xmlns='http://www.w3.org/2000/svg'/>", {
      type: "png",
      quality: 1,
      jpegBackground: config.jpegBackground
    });

    expect(base64).toBe("");
  });

  test("Render SVG with clipping options", async () => {
    const base64 = await renderSvg("<svg xmlns='http://www.w3.org/2000/svg'/>", {
      clip: {
        x: 10,
        y: 10,
        width: 100,
        height: 100
      },
      type: "jpeg",
      quality: 1,
      jpegBackground: config.jpegBackground
    });

    expect(base64).toBe("");
  });
});
