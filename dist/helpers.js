"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileTypeFromPath = (path) => {
    return path.toLowerCase().replace(new RegExp("jpg", "g"), "jpeg").split(".").reverse()[0];
};
exports.stringifyFunction = (func, ...argsArray) => {
    // Remove istanbul coverage instruments
    const functionString = func.toString().replace(/cov_(.+?)\+\+[,;]?/g, "");
    const args = [];
    for (const argument of argsArray) {
        switch (typeof argument) {
            case "string":
                args.push("`" + argument + "`");
                break;
            case "object":
                args.push(JSON.stringify(argument));
                break;
            default:
                args.push(argument);
        }
    }
    return `(${functionString})(${args.join(",")})`;
};
exports.renderSvg = async (svg, options) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        if (!ctx) {
            return reject(new Error("Canvas not supported"));
        }
        if (options.width) {
            img.width = options.width;
        }
        if (options.height) {
            img.height = options.height;
        }
        img.addEventListener("load", () => {
            let imageWidth = img.naturalWidth;
            let imageHeight = img.naturalHeight;
            if (options.width || options.height) {
                const computedStyle = window.getComputedStyle(img);
                imageWidth = parseInt(computedStyle.getPropertyValue("width"), 10);
                imageHeight = parseInt(computedStyle.getPropertyValue("height"), 10);
            }
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            // Set default background color
            if (options.type === "jpeg") {
                ctx.fillStyle = options.jpegBackground;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            // Set background color
            if (options.background) {
                ctx.fillStyle = options.background;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            // Draw the image
            ctx.drawImage(img, 0, 0, imageWidth, imageHeight);
            const dataURI = canvas.toDataURL("image/" + options.type, options.quality);
            const base64 = dataURI.substr(`data:image/${options.type};base64,`.length);
            document.body.removeChild(img);
            resolve(base64);
        });
        img.addEventListener("error", () => {
            reject(new Error("Malformed SVG"));
        });
        document.body.appendChild(img);
        img.src = "data:image/svg+xml;charset=utf8," + svg;
    });
};
