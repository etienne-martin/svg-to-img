import * as puppeteer from "puppeteer";
import { ScreenshotOptions } from "puppeteer";
import { defaultOptions} from "./constants";
import { getFileTypeFromPath, getSvgNaturalDimensions, embedSvgInBody, convertFunctionToString, setStyle } from "./helpers";
import { IOptions } from "./typings/types";

let browserDestructionTimeout: any; // TODO: add proper typing
let browserInstance: puppeteer.Browser | undefined;

const getBrowser = async () => {
  clearTimeout(browserDestructionTimeout);

  return (browserInstance = browserInstance ? browserInstance : await puppeteer.launch());
};

const scheduleBrowserForDestruction = () => {
  clearTimeout(browserDestructionTimeout);
  browserDestructionTimeout = setTimeout(async () => {
    /* istanbul ignore next */
    if (browserInstance) {
      browserInstance.close();
      browserInstance = undefined;
    }
  }, 1000);
};

const to = (input: Buffer | string) => {
  return async (output: IOptions): Promise<Buffer | string> => {
    // Convert buffer to string
    const svg = Buffer.isBuffer(input) ? (input as Buffer).toString("utf8") : input;
    const screenshotOptions = {...defaultOptions, ...output};
    const browser = await getBrowser();
    const page = await browser.newPage();

    // Get the natural dimensions of the SVG if they were not specified
    if (!screenshotOptions.width && !screenshotOptions.height) {
      const naturalDimensions = await page.evaluate(convertFunctionToString(getSvgNaturalDimensions, svg));

      screenshotOptions.width = naturalDimensions.width;
      screenshotOptions.height = naturalDimensions.height;
    }

    await page.setOfflineMode(true);
    await page.setViewport({ height: 1, width: 1 });
    await page.evaluate(convertFunctionToString(embedSvgInBody, svg, screenshotOptions.width, screenshotOptions.height));

    // Infer the file type from the file path if the type is not provided
    if (!output.type && screenshotOptions.path) {
      const fileType = getFileTypeFromPath(screenshotOptions.path);

      if (["jpeg", "png"].includes(fileType)) {
        screenshotOptions.type = fileType as ScreenshotOptions["type"];
      }
    }

    if (screenshotOptions.type === "png") {
      delete screenshotOptions.quality;
    }

    await page.evaluate(convertFunctionToString(setStyle, "body", {
      margin: "0px",
      padding: "0px"
    }));

    if (screenshotOptions.type === "jpeg") {
      await page.evaluate(convertFunctionToString(setStyle, "html", {
        background: "#fff"
      }));
    }

    if (screenshotOptions.background) {
      await page.evaluate(convertFunctionToString(setStyle, "body", {
        background: screenshotOptions.background
      }));
    }

    const screenshot = await page.screenshot(screenshotOptions);

    page.close(); // Close tab asynchronously (no await)
    scheduleBrowserForDestruction();

    if (screenshotOptions.encoding) {
      return screenshot.toString(screenshotOptions.encoding);
    }

    return screenshot;
  };
};

export const from = (input: Buffer | string) => {
  return {
    to: to(input)
  };
};
