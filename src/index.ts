import * as puppeteer from "puppeteer";
import { ScreenshotOptions } from "puppeteer";
import { defaultOptions, defaultPngShorthandOptions, defaultJpegShorthandOptions, config } from "./constants";
import { getFileTypeFromPath, getNaturalSvgDimensions, embedSvgInBody, stringifyFunction, setStyle } from "./helpers";
import { IOptions, IPngShorthandOptions, IJpegShorthandOptions } from "./typings/types";

let browserDestructionTimeout: any; // TODO: add proper typing
let browserInstance: puppeteer.Browser|undefined;

const getBrowser = async () => {
  clearTimeout(browserDestructionTimeout);

  return (browserInstance = browserInstance ? browserInstance : await puppeteer.launch(config.puppeteer));
};

const scheduleBrowserForDestruction = () => {
  clearTimeout(browserDestructionTimeout);
  browserDestructionTimeout = setTimeout(() => {
    /* istanbul ignore next */
    if (browserInstance) {
      browserInstance.close(); // Closes the browser asynchronously (no await)
      browserInstance = undefined;
    }
  }, 1000);
};

const convertSvg = async (inputSvg: Buffer|string, options: IOptions): Promise<Buffer|string> => {
  const svg = Buffer.isBuffer(inputSvg) ? (inputSvg as Buffer).toString("utf8") : inputSvg;
  const screenshotOptions = {...defaultOptions, ...options};
  const browser = await getBrowser();
  const page = await browser.newPage();

  // ⚠️ Offline mode is enabled to prevent any HTTP requests over the network
  await page.setOfflineMode(true);

  // Get the natural dimensions of the SVG if they were not specified
  if (!screenshotOptions.width && !screenshotOptions.height) {
    const naturalSvgDimensions = await page.evaluate(stringifyFunction(getNaturalSvgDimensions, svg));

    screenshotOptions.width = naturalSvgDimensions.width;
    screenshotOptions.height = naturalSvgDimensions.height;
  }

  const currentSvgDimensions = await page.evaluate(stringifyFunction(embedSvgInBody, svg, screenshotOptions.width, screenshotOptions.height));

  // Resize the viewport to mirror the in-browser SVG size
  await page.setViewport({ width: currentSvgDimensions.width, height: currentSvgDimensions.height });

  // Infer the file type from the file path if no type is provided
  if (!options.type && screenshotOptions.path) {
    const fileType = getFileTypeFromPath(screenshotOptions.path);

    if (config.supportedImageTypes.includes(fileType)) {
      screenshotOptions.type = fileType as ScreenshotOptions["type"];
    }
  }

  // The quality option is only applicable to jpeg images.
  if (screenshotOptions.type !== "jpeg") {
    delete screenshotOptions.quality;
  }

  await page.evaluate(stringifyFunction(setStyle, "body", {
    margin: 0,
    padding: 0
  }));

  if (screenshotOptions.type === "jpeg") {
    await page.evaluate(stringifyFunction(setStyle, "html", {
      "background-color": config.jpegBackground
    }));
  }

  if (screenshotOptions.background) {
    await page.evaluate(stringifyFunction(setStyle, "body", {
      "background-color": screenshotOptions.background
    }));
  }

  const screenshot = await page.screenshot(screenshotOptions);

  page.close(); // Closes the tab asynchronously (no await)
  scheduleBrowserForDestruction();

  if (screenshotOptions.encoding) {
    return screenshot.toString(screenshotOptions.encoding);
  }

  return screenshot;
};

const to = (svg: Buffer|string) => {
  return async (options: IOptions): Promise<Buffer|string> => {
    return convertSvg(svg, options);
  };
};

const toPng = (svg: Buffer|string) => {
  return async (options?: IPngShorthandOptions): Promise<Buffer|string> => {
    return convertSvg(svg, {...defaultPngShorthandOptions, ...options});
  };
};

const toJpeg = (svg: Buffer|string) => {
  return async (options?: IJpegShorthandOptions): Promise<Buffer|string> => {
    return convertSvg(svg, {...defaultJpegShorthandOptions, ...options});
  };
};

export const from = (svg: Buffer|string) => {
  return {
    to: to(svg),
    toPng: toPng(svg),
    toJpeg: toJpeg(svg)
  };
};
