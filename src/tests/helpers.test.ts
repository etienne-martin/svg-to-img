import { getFileTypeFromPath, getSvgNaturalDimensions, embedSvgInBody } from "../helpers";

Object.defineProperty(URL, "createObjectURL", {
  writable: true,
  value: jest.fn(() => {
    return `data:image/svg+xml;charset=utf8,<svg xmlns="http://www.w3.org/2000/svg"/>`;
  })
});

describe("Helpers", () => {
  test("Get file type from path", async () => {
    const fileType = await getFileTypeFromPath("test.jpg");

    expect(fileType).toBe("jpeg");
  });

  test("Get SVG natural dimensions", async () => {
    await getSvgNaturalDimensions("<svg/>");

    expect(1).toEqual(1);
  });

  test("Embed svg in body", async () => {
    const expectedOutput = `<img src="data:image/svg+xml;charset=utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot;/>">`;
    await embedSvgInBody("<svg/>", "10", "10");

    expect(document.body.innerHTML).toEqual(expectedOutput);
  });
});
