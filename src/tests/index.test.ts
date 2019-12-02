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
    expect(md5(data)).toEqual("242fac8e57f2c24e6865733c78ffd49a");
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
    expect(md5(data)).toEqual("d7f42c771389e20ef07397ebcd3aa5ac");
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
    expect(md5(data)).toEqual("242fac8e57f2c24e6865733c78ffd49a");
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
    expect(md5(data)).toEqual("d7f42c771389e20ef07397ebcd3aa5ac");
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
    expect(md5(data)).toEqual("de0dcfb7ab63a50140c2ab562bd2d942");
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
    expect(md5(data)).toEqual("492efd51b52dc7376343202ee67225ca");
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
    expect(md5(data)).toEqual("2b6a20b486cf02671c13c0cb9e6bac1d");
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
    expect(md5(data)).toEqual("aef2e325aa30cd0299ee95c56ff49b9c");
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
    expect(md5(data)).toEqual("c683880ab02c0e76243d0abaceffe0c8");
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
    expect(md5(data)).toEqual("580c3453b5d102d5b06411c8a1fc4b23");
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
    expect(md5(data)).toEqual("1b1fe94386407eecc2d083882aa73589");
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
    expect(md5(data)).toEqual("cf75cb874aad3174a90936c9b6454cf8");
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
    expect(md5(data)).toEqual("6cd910ca5ebee7366cb6ec51da090b45");
  });

  test("SVG to PNG shorthand", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toPng();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "png",
      width: 187,
      height: 150
    });
    expect(md5(data)).toEqual("1b1fe94386407eecc2d083882aa73589");
  });

  test("SVG to JPEG shorthand", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toJpeg();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "jpg",
      width: 187,
      height: 150
    });
    fs.writeFileSync(`${outputDir}/da0a53cd944c1fbd56a64684969882cd.jpg`, data as Buffer);
    expect(md5(data)).toEqual("da0a53cd944c1fbd56a64684969882cd");
  });

  test("SVG to WEBP shorthand", async () => {
    const data = await svgToImg.from(responsiveSvgBuffer).toWebp();

    expect(sizeOf(data as Buffer)).toEqual({
      type: "webp",
      width: 187,
      height: 150
    });
    expect(md5(data)).toEqual("d7e682534f5118c62659afe5b13fe33e");
  });

  test("Clip the image", async () => {
    const data = await svgToImg.from(svgBuffer).toPng({
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
    expect(md5(data)).toEqual("29f7cd260d1ceaa8aef7964e5f2f7ae0");
  });

  test("Wait for browser destruction", async (done) => {
    await svgToImg.from(responsiveSvgBuffer).toJpeg();

    setTimeout(async () => {
      done();
    }, 2000);
  });

  test("Test multiple requests in parallel", async (done) => {
    let errors = 0;

    for (let i = 0; i < 10; i++) {
      try {
        await svgToImg.from("<svg xmlns='http://www.w3.org/2000/svg'/>").toPng();
      } catch (error) {
        console.log(error);
        errors++;
      }
    }

    setTimeout(() => {
      expect(errors).toBe(0);
      done();
    }, 1000);
  });

  test("Propagates error when cannot connect", async (done) => {
    const convert = svgToImg.connect({ browserWSEndpoint: "ws://localhost:12345" })
    try {
      await convert.from("<svg xmlns='http://www.w3.org/2000/svg'/>").toPng();
      done.fail();
    } catch (error) {
      expect(error.message).toContain("ECONNREFUSED");
      done();
    }
  });

  test("Propagates error when cannot connect with subsequent attempts", async (done) => {
    const convert = svgToImg.connect({ browserWSEndpoint: "ws://localhost:12345" });
    let errors = 0;
    for (let i = 0; i < 10; i++) {
      try {
        await convert.from("<svg xmlns='http://www.w3.org/2000/svg'/>").toPng();
        done.fail();
      } catch (error) {
        expect(error.message).toContain("ECONNREFUSED");
        errors++;
      }
    }
    expect(errors).toBe(10);
    done();
  });
});

// Kill any remaining Chromium instances
// pkill -f Chromium
