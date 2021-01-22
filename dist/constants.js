"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultWebpShorthandOptions = exports.defaultJpegShorthandOptions = exports.defaultPngShorthandOptions = exports.defaultOptions = exports.config = void 0;
exports.config = {
    supportedImageTypes: ["jpeg", "png", "webp"],
    jpegBackground: "#fff",
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
};
exports.defaultOptions = {
    quality: 1,
    type: "png"
};
exports.defaultPngShorthandOptions = {
    type: "png"
};
exports.defaultJpegShorthandOptions = {
    type: "jpeg"
};
exports.defaultWebpShorthandOptions = {
    type: "webp"
};
