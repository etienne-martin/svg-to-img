import * as puppeteer from "puppeteer";
import { ScreenshotOptions } from "puppeteer";
import { IOptions } from "./typings/types";

let browserDestructionTimeout: any; // TODO: add proper typing
let browserInstance: puppeteer.Browser | undefined;

const defaultOptions: IOptions = {
  fullPage: true,
  height: "auto",
  omitBackground: true,
  quality: 100,
  type: "png",
  width: "auto"
};

const getBrowser = async () => {
  clearTimeout(browserDestructionTimeout);

  return (browserInstance = browserInstance ? browserInstance : await puppeteer.launch());
};

const scheduleBrowserForDestruction = () => {
  clearTimeout(browserDestructionTimeout);
  browserDestructionTimeout = setTimeout(async () => {
    if (browserInstance) {
      browserInstance.close();
      browserInstance = undefined;
    }
  }, 1000);
};

const getFileTypeFromPath = (path: string) => {
  return path.toLowerCase().replace(new RegExp("jpg", "g"), "jpeg").split(".").reverse()[0];
};

const injectSvgInPage = async (input: string, page: puppeteer.Page, size: {
  width: IOptions["width"],
  height: IOptions["height"]
}) => {
  await page.evaluate((svg, width, height) => {
    const img = document.createElement("img");
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf8" });

    img.style.width = width;
    img.style.height = height;
    img.src = URL.createObjectURL(blob);

    document.body.appendChild(img);
  }, input, size.width, size.height);
};

const to = (input: Buffer | string) => {
  // Convert buffer to string
  if (Buffer.isBuffer(input)) {
    input = (input as Buffer).toString("utf8");
  }

  return async (output: IOptions) => {
    const screenshotOptions = {...defaultOptions, ...output};
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setJavaScriptEnabled(false);
    await page.setOfflineMode(true);
    await injectSvgInPage(input as string, page, {
      height: screenshotOptions.height,
      width: screenshotOptions.width
    });

    // await page.setViewport({ height: 1, width: 1 });

    // Infer the file type from the file path
    if (!output.type && screenshotOptions.path) {
      const fileType = getFileTypeFromPath(screenshotOptions.path);

      if (["jpeg", "png"].includes(fileType)) {
        screenshotOptions.type = fileType as ScreenshotOptions["type"];
      }
    }

    if (screenshotOptions.type === "png") {
      delete screenshotOptions.quality;
    }

    await page.evaluate(() => {
      document.body.style.margin = "0px";
      document.body.style.padding = "0px";
    });

    if (screenshotOptions.type === "jpeg") {
      await page.evaluate(() => {
        document.documentElement.style.background = "#fff";
      });
    }

    if (screenshotOptions.background) {
      await page.evaluate(background => {
        document.body.style.background = background;
      }, screenshotOptions.background);
    }

    console.log(screenshotOptions);

    const screenshot = await page.screenshot(screenshotOptions);

    await page.close();
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
