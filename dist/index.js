"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
const queue = [];
let browserDestructionTimeout;
let browserInstance;
let browserState = "closed";
const executeQueuedRequests = (browser) => {
    for (const resolve of queue) {
        resolve(browser);
    }
    // Clear items from the queue
    queue.length = 0;
};
const getBrowser = async () => {
    return new Promise(async (resolve) => {
        clearTimeout(browserDestructionTimeout);
        if (browserState === "closed") {
            // Browser is closed
            queue.push(resolve);
            browserState = "opening";
            browserInstance = await puppeteer.launch(constants_1.config.puppeteer);
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
const convertSvg = async (inputSvg, passedOptions) => {
    const svg = Buffer.isBuffer(inputSvg) ? inputSvg.toString("utf8") : inputSvg;
    const options = Object.assign({}, constants_1.defaultOptions, passedOptions);
    const browser = await getBrowser();
    const page = (await browser.pages())[0];
    // ⚠️ Offline mode is enabled to prevent any HTTP requests over the network
    await page.setOfflineMode(true);
    // Infer the file type from the file path if no type is provided
    if (!passedOptions.type && options.path) {
        const fileType = helpers_1.getFileTypeFromPath(options.path);
        if (constants_1.config.supportedImageTypes.includes(fileType)) {
            options.type = fileType;
        }
    }
    const base64 = await page.evaluate(helpers_1.stringifyFunction(helpers_1.renderSvg, svg, {
        width: options.width,
        height: options.height,
        type: options.type,
        quality: options.quality,
        background: options.background,
        clip: options.clip,
        jpegBackground: constants_1.config.jpegBackground
    }));
    scheduleBrowserForDestruction();
    const buffer = Buffer.from(base64, "base64");
    if (options.path) {
        await helpers_1.writeFileAsync(options.path, buffer);
    }
    if (options.encoding === "base64") {
        return base64;
    }
    if (!options.encoding) {
        return buffer;
    }
    return buffer.toString(options.encoding);
};
const to = (svg) => {
    return async (options) => {
        return convertSvg(svg, options);
    };
};
const toPng = (svg) => {
    return async (options) => {
        return convertSvg(svg, Object.assign({}, constants_1.defaultPngShorthandOptions, options));
    };
};
const toJpeg = (svg) => {
    return async (options) => {
        return convertSvg(svg, Object.assign({}, constants_1.defaultJpegShorthandOptions, options));
    };
};
const toWebp = (svg) => {
    return async (options) => {
        return convertSvg(svg, Object.assign({}, constants_1.defaultWebpShorthandOptions, options));
    };
};
exports.from = (svg) => {
    return {
        to: to(svg),
        toPng: toPng(svg),
        toJpeg: toJpeg(svg),
        toWebp: toWebp(svg)
    };
};
