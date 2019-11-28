"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
// tslint:disable-next-line: max-classes-per-file
class BrowserSource {
    constructor(factory) {
        this.factory = factory;
        this.queue = [];
        this.browserState = "closed";
    }
    async getBrowser() {
        return new Promise(async (resolve) => {
            /* istanbul ignore if */
            if (this.browserDestructionTimeout) {
                clearTimeout(this.browserDestructionTimeout);
            }
            /* istanbul ignore else */
            if (this.browserState === "closed") {
                // Browser is closed
                this.queue.push(resolve);
                this.browserState = "opening";
                this.browserInstance = await this.factory();
                this.browserState = "open";
                return this.executeQueuedRequests(this.browserInstance);
            }
            /* istanbul ignore next */
            if (this.browserState === "opening") {
                // Queue request and wait for the browser to open
                return this.queue.push(resolve);
            }
            /* istanbul ignore next */
            if (this.browserState === "open") {
                // Browser is already open
                if (this.browserInstance) {
                    return resolve(this.browserInstance);
                }
            }
        });
    }
    ;
    scheduleBrowserForDestruction() {
        /* istanbul ignore if */
        if (this.browserDestructionTimeout) {
            clearTimeout(this.browserDestructionTimeout);
        }
        this.browserDestructionTimeout = setTimeout(async () => {
            /* istanbul ignore next */
            if (this.browserInstance) {
                this.browserState = "closed";
                await this.browserInstance.close();
            }
        }, 500);
    }
    ;
    executeQueuedRequests(browser) {
        for (const resolve of this.queue) {
            resolve(browser);
        }
        // Clear items from the queue
        this.queue.length = 0;
    }
    ;
}
exports.BrowserSource = BrowserSource;
;
// tslint:disable-next-line: max-classes-per-file
class SvgToImg {
    constructor(svg, browserSource) {
        this.svg = svg;
        this.browserSource = browserSource;
    }
    async to(options) {
        return this.convertSvg(this.svg, options, this.browserSource);
    }
    ;
    async toPng(options) {
        return this.convertSvg(this.svg, Object.assign({}, constants_1.defaultPngShorthandOptions, options), this.browserSource);
    }
    ;
    async toJpeg(options) {
        return this.convertSvg(this.svg, Object.assign({}, constants_1.defaultJpegShorthandOptions, options), this.browserSource);
    }
    ;
    async toWebp(options) {
        return this.convertSvg(this.svg, Object.assign({}, constants_1.defaultWebpShorthandOptions, options), this.browserSource);
    }
    ;
    async convertSvg(inputSvg, passedOptions, browserSource) {
        const svg = Buffer.isBuffer(inputSvg) ? inputSvg.toString("utf8") : inputSvg;
        const options = Object.assign({}, constants_1.defaultOptions, passedOptions);
        const browser = await browserSource.getBrowser();
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
        browserSource.scheduleBrowserForDestruction();
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
    }
    ;
}
// tslint:disable-next-line: max-classes-per-file
class SvgToImgBrowser {
    constructor(browserSource) {
        this.browserSource = browserSource;
    }
    from(svg) {
        return new SvgToImg(svg, this.browserSource);
    }
    ;
}
const defaultBrowserSource = new BrowserSource(async () => puppeteer.launch(constants_1.config.puppeteer));
exports.from = (svg) => {
    return new SvgToImgBrowser(defaultBrowserSource).from(svg);
};
/* istanbul ignore next */
exports.connect = (options) => {
    return new SvgToImgBrowser(new BrowserSource(async () => puppeteer.connect(options)));
};
