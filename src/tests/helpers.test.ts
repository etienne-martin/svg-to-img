import { getFileTypeFromPath, stringifyFunction, renderSvg, writeFileAsync } from "../helpers";
import { config } from "../constants";

beforeEach(() => {
  // Mock img.addEventListener("load|error", () => {});
  Element.prototype.addEventListener = jest.fn((event, callback) => {
    if (event === "load") {
      setTimeout(callback, 10);
    }
  });
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

  test("Malformed SVG", async () => {
    Element.prototype.addEventListener = jest.fn((event, callback) => {
      if (event === "error") {
        setTimeout(callback, 10);
      }
    });

    try {
      await renderSvg("THIS IS NO SVG", {
        type: "png",
        quality: 1,
        jpegBackground: config.jpegBackground
      });
    } catch (error) {
      expect(error.message).toContain("Malformed SVG");
    }
  });

  test("Write file asynchronously", async () => {
    let errorThrown = false;

    try {
      await writeFileAsync("...//NOT-A-VALID-PATH//...", Buffer.from("dummy-data", "utf8"));
    } catch {
      errorThrown = true;
    }

    expect(errorThrown).toEqual(true);
  });
});
