"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
let browserDestructionTimeout;
let browserInstance;
const getBrowser = async () => {
    clearTimeout(browserDestructionTimeout);
    if (!browserInstance) {
        browserInstance = await puppeteer.launch(constants_1.config.puppeteer);
        await browserInstance.newPage();
    }
    return browserInstance;
};
const scheduleBrowserForDestruction = () => {
    clearTimeout(browserDestructionTimeout);
    browserDestructionTimeout = setTimeout(() => {
        if (browserInstance) {
            browserInstance.close();
            browserInstance = undefined;
        }
    }, 1000);
};
const convertSvg = async (inputSvg, passedOptions) => {
    const svg = Buffer.isBuffer(inputSvg) ? inputSvg.toString("utf8") : inputSvg;
    const options = Object.assign({}, constants_1.defaultOptions, passedOptions);
    const browser = await getBrowser();
    const page = (await browser.pages())[1];
    await page.setOfflineMode(true);
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
