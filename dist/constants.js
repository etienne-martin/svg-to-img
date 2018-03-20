"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    supportedImageTypes: ["jpeg", "png"],
    jpegBackground: "#fff",
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
};
exports.defaultOptions = {
    omitBackground: true,
    quality: 100,
    type: "png"
};
exports.defaultPngShorthandOptions = {
    type: "png"
};
exports.defaultJpegShorthandOptions = {
    type: "jpeg"
};
