import * as fs from "fs";
import * as svgToImg from "../index";

const buffer = fs.readFileSync("./src/tests/svg/camera.svg");

describe("Index", () => {
  test("Convert SVG from buffer to jpeg", async () => {
    await svgToImg.from(buffer).to({
      path: "./src/tests/images/jpg1.jpg"
    });

    expect(1).toEqual(1);
  });
});
