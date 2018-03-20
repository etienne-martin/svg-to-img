import * as fs from "fs";
import * as svgToImg from "../index";
import { md5 } from "./helpers";
import * as rimraf from "rimraf";
import * as sizeOf from "image-size";

const inputDir = "./src/tests/svg";
const outputDir = "./src/tests/img";
const svgBuffer = fs.readFileSync(`${inputDir}/camera.svg`);
const responsiveSvgBuffer = fs.readFileSync(`${inputDir}/logo.svg`);
const svgString = svgBuffer.toString("utf8");

// Create output directory
rimraf.sync(outputDir);
fs.mkdirSync(outputDir);

describe("SVG to image conversion", () => {
  test("From buffer to image", async () => {
    const data = await svgToImg.from(svgBuffer).to({
      type: "jpeg"
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "jpg",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("677e67f0c96c14a79032351d5691bcb2");
  });

  test("From string to image", async () => {
    const data = await svgToImg.from(svgString).to({
      type: "png"
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("7c310bf3a7267c656d926ce5c8a1c365");
  });

  test("Infer file type from file extension", async () => {
    await svgToImg.from(svgBuffer).to({
      path: `${outputDir}/image.jpg`
    });

    const data = fs.readFileSync(`${outputDir}/image.jpg`);

    expect(sizeOf(data as Buffer)).toEqual({
      type: "jpg",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("677e67f0c96c14a79032351d5691bcb2");
  });

  test("Unknown file extension", async () => {
    await svgToImg.from(svgBuffer).to({
      path: `${outputDir}/image.ext`
    });

    const data = fs.readFileSync(`${outputDir}/image.ext`);

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("7c310bf3a7267c656d926ce5c8a1c365");
  });

  test("Base64 encoded output", async () => {
    const data = await svgToImg.from(svgString).to({
      encoding: "base64"
    });

    expect(sizeOf(Buffer.from(data as string, "base64"))).toEqual({
      type: "png",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("d8d4ae8a0824a579c7ca32a7ee93a678");
  });

  test("HEX encoded output", async () => {
    const data = await svgToImg.from(svgString).to({
      encoding: "hex"
    });

    expect(sizeOf(Buffer.from(data as string, "hex"))).toEqual({
      type: "png",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("dd8d4c070bb6db33ad15ace8dd56e61c");
  });

  test("JPEG compression", async () => {
    const data = await svgToImg.from(svgBuffer).toJpeg({
      quality: 0
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "jpg",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("435447377ac681b187d8d55a65ea6b37");
  });

  test("WEBP compression", async () => {
    const data = await svgToImg.from(svgBuffer).toWebp({
      quality: 0
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "webp",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("b5a88a19087b48e6aafacf688699ff0a");
  });

  test("Custom width and height", async () => {
    const data = await svgToImg.from(svgString).to({
      width: 1000,
      height: 200
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 1000,
      height: 200
    });
    expect(md5(data)).toEqual("35053a5b747abffa7cb1aba24bbbd603");
  });

  test("Custom background color", async () => {
    const data = await svgToImg.from(svgString).to({
      background: "#09f"
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 406,
      height: 206
    });
    expect(md5(data)).toEqual("f7c37d538eb948f6609d15d871b3f078");
  });

  test("Malformed SVG", async () => {
    try {
      await svgToImg.from("THIS IS NO SVG").to({
        type: "png"
      });
    } catch (error) {
      expect(error.message).toContain("Error: Malformed SVG");
    }
  });

  test("Responsive SVG (Infer natural dimensions)", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toPng();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 187,
      height: 150
    });
    expect(md5(data)).toEqual("a35bb124b354bb861a6b65118ff16dde");
  });

  test("Resize responsive SVG (Squashed)", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).to({
      width: 300,
      height: 100
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 300,
      height: 100
    });
    expect(md5(data)).toEqual("f6571224da1e85780c7dc0ea66b7c95c");
  });

  test("Resize responsive SVG (Proportionally)", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).to({
      width: 300
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 300,
      height: 241
    });
    expect(md5(data)).toEqual("1245ca2a1868e5148d0bbeacc0245d25");
  });

  test("SVG to PNG shorthand", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toPng();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 187,
      height: 150
    });
    expect(md5(data)).toEqual("a35bb124b354bb861a6b65118ff16dde");
  });

  test("SVG to JPEG shorthand", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toJpeg();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "jpg",
      width: 187,
      height: 150
    });
    expect(md5(data)).toEqual("da0a53cd944c1fbd56a64684969882cd");
  });

  test("SVG to WEBP shorthand", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toWebp();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "webp",
      width: 187,
      height: 150
    });
    expect(md5(data)).toEqual("b1080b283475987c0d57dd16a9f19288");
  });

  /*
  test("Clip the image", async () => {
    const data = await svgToImg.from(svgBuffer).to({
      clip: {
        x: 10,
        y: 10,
        width: 100,
        height: 100
      }
    });

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 100,
      height: 100
    });
    expect(md5(data)).toEqual("448274496ea3fa97f7d110697af9a268");
  });
  */

  test("Wait for browser destruction", async (done) => {
    await svgToImg.from(responsiveSvgBuffer).toJpeg();

    setTimeout(async () => {
      done();
    }, 2000);
  });
});

// Kill any remaining Chromium instances
// pkill -f Chromium
