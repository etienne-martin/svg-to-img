import * as fs from "fs";
import * as svgToImg from "../index";

const svgString = fs.readFileSync("./src/tests/svg/camera.svg", { encoding: "utf8" });
const svgBuffer = fs.readFileSync("./src/tests/svg/camera.svg");

describe("Index", () => {
  test("Convert SVG from buffer to jpeg", async () => {
    await svgToImg.from(svgBuffer).to({
      path: "./src/tests/img/jpg1.jpg"
    });

    expect(1).toEqual(1);
  });

  test("Convert SVG from buffer to jpeg", async () => {
    await svgToImg.from(svgBuffer).to({
      path: "./src/tests/img/jpg1.xml"
    });

    expect(1).toEqual(1);
  });

  test("Convert SVG from string to jpeg", async () => {
    await svgToImg.from(svgString).to({
      encoding: "base64"
    });

    expect(1).toEqual(1);
  });

  test("With width and height params", async () => {
    await svgToImg.from(svgString).to({
      path: "./src/tests/img/jpg2.jpg",
      width: 1000,
      height: 200
    });

    expect(1).toEqual(1);
  });

  test("With background param", async () => {
    await svgToImg.from(svgString).to({
      background: "#09f"
    });

    expect(1).toEqual(1);
  });
});
