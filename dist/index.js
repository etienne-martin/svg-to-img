"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
let browserDestructionTimeout; // TODO: add proper typing
let browserInstance;
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
const to = (input) => {
    return async (output) => {
        // Convert buffer to string
        const svg = Buffer.isBuffer(input) ? input.toString("utf8") : input;
        const screenshotOptions = Object.assign({}, constants_1.defaultOptions, output);
        const browser = await getBrowser();
        const page = await browser.newPage();
        // Get the natural dimensions of the SVG if they were not specified
        if (!screenshotOptions.width && !screenshotOptions.height) {
            const naturalDimensions = await page.evaluate(helpers_1.convertFunctionToString(helpers_1.getSvgNaturalDimensions, svg));
            screenshotOptions.width = naturalDimensions.width;
            screenshotOptions.height = naturalDimensions.height;
        }
        await page.setOfflineMode(true);
        await page.setViewport({ height: 1, width: 1 });
        await page.evaluate(helpers_1.convertFunctionToString(helpers_1.embedSvgInBody, svg, screenshotOptions.width, screenshotOptions.height));
        // Infer the file type from the file path if the type is not provided
        if (!output.type && screenshotOptions.path) {
            const fileType = helpers_1.getFileTypeFromPath(screenshotOptions.path);
            if (["jpeg", "png"].includes(fileType)) {
                screenshotOptions.type = fileType;
            }
        }
        if (screenshotOptions.type === "png") {
            delete screenshotOptions.quality;
        }
        await page.evaluate(helpers_1.convertFunctionToString(helpers_1.setStyle, "body", {
            margin: "0px",
            padding: "0px"
        }));
        if (screenshotOptions.type === "jpeg") {
            await page.evaluate(helpers_1.convertFunctionToString(helpers_1.setStyle, "html", {
                background: "#fff"
            }));
        }
        if (screenshotOptions.background) {
            await page.evaluate(helpers_1.convertFunctionToString(helpers_1.setStyle, "body", {
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
exports.from = (input) => {
    return {
        to: to(input)
    };
};
