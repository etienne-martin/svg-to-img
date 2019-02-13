import * as puppeteer from "puppeteer";
import { getFileTypeFromPath, renderSvg, stringifyFunction, writeFileAsync } from "./helpers";
import { config, defaultOptions, defaultPngShorthandOptions, defaultJpegShorthandOptions, defaultWebpShorthandOptions } from "./constants";
import { IOptions, IShorthandOptions } from "./typings";

const queue: Array<(result: puppeteer.Browser) => void> = [];
let browserDestructionTimeout: number;
let browserInstance: puppeteer.Browser|undefined;
let browserState: "closed"|"opening"|"open" = "closed";

const executeQueuedRequests = (browser: puppeteer.Browser) => {
  for (const resolve of queue) {
    resolve(browser);
  }
  // Clear items from the queue
  queue.length = 0;
};

const getBrowser = async (): Promise<puppeteer.Browser> => {
  return new Promise(async (resolve: (result: puppeteer.Browser) => void) => {
    clearTimeout(browserDestructionTimeout);

    if (browserState === "closed") {
      // Browser is closed
      queue.push(resolve);
      browserState = "opening";
      browserInstance = await puppeteer.launch(config.puppeteer);
      browserState = "open";

      return executeQueuedRequests(browserInstance);
    }

    /* istanbul ignore if */
    if (browserState === "opening") {
      // Queue request and wait for the browser to open
      return queue.push(resolve);
    }

    /* istanbul ignore next */
    if (browserState === "open") {
      // Browser is already open
      if (browserInstance) {
        return resolve(browserInstance);
      }
    }
  });
};

const scheduleBrowserForDestruction = () => {
  clearTimeout(browserDestructionTimeout);
  browserDestructionTimeout = setTimeout(async () => {
    /* istanbul ignore next */
    if (browserInstance) {
      browserState = "closed";
      await browserInstance.close();
    }
  }, 500);
};

const convertSvg = async (inputSvg: Buffer|string, passedOptions: IOptions): Promise<Buffer|string> => {
  const svg = Buffer.isBuffer(inputSvg) ? (inputSvg as Buffer).toString("utf8") : inputSvg;
  const options = {...defaultOptions, ...passedOptions};
  const browser = await getBrowser();
  const page = (await browser.pages())[0];

  // ⚠️ Offline mode is enabled to prevent any HTTP requests over the network
  await page.setOfflineMode(true);

  // Infer the file type from the file path if no type is provided
  if (!passedOptions.type && options.path) {
    const fileType = getFileTypeFromPath(options.path);

    if (config.supportedImageTypes.includes(fileType)) {
      options.type = fileType as IOptions["type"];
    }
  }

  const base64 = await page.evaluate(stringifyFunction(renderSvg, svg, {
    width: options.width,
    height: options.height,
    type: options.type,
    quality: options.quality,
    background: options.background,
    clip: options.clip,
    jpegBackground: config.jpegBackground
  }));

  scheduleBrowserForDestruction();

  const buffer = Buffer.from(base64, "base64");

  if (options.path) {
    await writeFileAsync(options.path, buffer);
  }

  if (options.encoding === "base64") {
    return base64;
  }

  if (!options.encoding) {
    return buffer;
  }

  return buffer.toString(options.encoding);
};

const to = (svg: Buffer|string) => {
  return async (options: IOptions): Promise<Buffer|string> => {
    return convertSvg(svg, options);
  };
};

const toPng = (svg: Buffer|string) => {
  return async (options?: IShorthandOptions): Promise<Buffer|string> => {
    return convertSvg(svg, {...defaultPngShorthandOptions, ...options});
  };
};

const toJpeg = (svg: Buffer|string) => {
  return async (options?: IShorthandOptions): Promise<Buffer|string> => {
    return convertSvg(svg, {...defaultJpegShorthandOptions, ...options});
  };
};

const toWebp = (svg: Buffer|string) => {
  return async (options?: IShorthandOptions): Promise<Buffer|string> => {
    return convertSvg(svg, {...defaultWebpShorthandOptions, ...options});
  };
};

export const from = (svg: Buffer|string) => {
  return {
    to: to(svg),
    toPng: toPng(svg),
    toJpeg: toJpeg(svg),
    toWebp: toWebp(svg)
  };
};
