"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileTypeFromPath = (path) => {
    return path.toLowerCase().replace(new RegExp("jpg", "g"), "jpeg").split(".").reverse()[0];
};
exports.getSvgNaturalDimensions = async (svg) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf8" });
        img.addEventListener("load", () => {
            resolve({
                height: img.naturalHeight,
                width: img.naturalWidth
            });
        });
        img.addEventListener("error", () => {
            reject(new Error("Malformed SVG"));
        });
        img.src = URL.createObjectURL(blob);
    });
};
exports.embedSvgInBody = async (rawSvg, width, height) => {
    return new Promise((resolve, reject) => {
        const sandbox = document.createElement("div");
        sandbox.innerHTML = rawSvg;
        const svg = sandbox.querySelector("svg");
        /* istanbul ignore if  */
        if (!svg) {
            return;
        }
        svg.setAttribute("preserveAspectRatio", "none");
        const img = new Image();
        const blob = new Blob([sandbox.innerHTML], { type: "image/svg+xml;charset=utf8" });
        img.style.width = width;
        img.style.height = height;
        img.src = URL.createObjectURL(blob);
        img.addEventListener("load", () => {
            resolve();
        });
        img.addEventListener("error", () => {
            reject(new Error("Malformed SVG"));
        });
        document.body.appendChild(img);
    });
};
exports.convertFunctionToString = (func, ...argsArray) => {
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
exports.setStyle = (selector, styles) => {
    const elements = Array.from(document.querySelectorAll(selector));
    for (const element of elements) {
        for (const [property, value] of Object.entries(styles)) {
            element.style.setProperty(property, value);
        }
    }
};
