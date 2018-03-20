"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
let browserDestructionTimeout; // TODO: add proper typing
let browserInstance;
const getBrowser = async () => {
    clearTimeout(browserDestructionTimeout);
    return (browserInstance = browserInstance ? browserInstance : await puppeteer.launch(constants_1.config.puppeteer));
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
const convertSvg = async (inputSvg, options) => {
    const svg = Buffer.isBuffer(inputSvg) ? inputSvg.toString("utf8") : inputSvg;
    const screenshotOptions = Object.assign({}, constants_1.defaultOptions, options);
    const browser = await getBrowser();
    const page = await browser.newPage();
    // ⚠️ Offline mode is enabled to prevent any HTTP requests over the network
    await page.setOfflineMode(true);
    // Get the natural dimensions of the SVG if they were not specified
    if (!screenshotOptions.width && !screenshotOptions.height) {
        const naturalSvgDimensions = await page.evaluate(helpers_1.stringifyFunction(helpers_1.getNaturalSvgDimensions, svg));
        screenshotOptions.width = naturalSvgDimensions.width;
        screenshotOptions.height = naturalSvgDimensions.height;
    }
    const currentSvgDimensions = await page.evaluate(helpers_1.stringifyFunction(helpers_1.embedSvgInBody, svg, screenshotOptions.width, screenshotOptions.height));
    // Resize the viewport to mirror the in-browser SVG size
    await page.setViewport({ width: currentSvgDimensions.width, height: currentSvgDimensions.height });
    // Infer the file type from the file path if no type is provided
    if (!options.type && screenshotOptions.path) {
        const fileType = helpers_1.getFileTypeFromPath(screenshotOptions.path);
        if (constants_1.config.supportedImageTypes.includes(fileType)) {
            screenshotOptions.type = fileType;
        }
    }
    // The quality option is only applicable to jpeg images.
    if (screenshotOptions.type !== "jpeg") {
        delete screenshotOptions.quality;
    }
    await page.evaluate(helpers_1.stringifyFunction(helpers_1.setStyle, "body", {
        margin: 0,
        padding: 0
    }));
    if (screenshotOptions.type === "jpeg") {
        await page.evaluate(helpers_1.stringifyFunction(helpers_1.setStyle, "html", {
            "background-color": constants_1.config.jpegBackground
        }));
    }
    if (screenshotOptions.background) {
        await page.evaluate(helpers_1.stringifyFunction(helpers_1.setStyle, "body", {
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
exports.from = (svg) => {
    return {
        to: to(svg),
        toPng: toPng(svg),
        toJpeg: toJpeg(svg)
    };
};
