"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileTypeFromPath = (path) => {
    return path.toLowerCase().replace(new RegExp("jpg", "g"), "jpeg").split(".").reverse()[0];
};
exports.getSvgNaturalDimensions = (svg) => {
    return new Promise((resolve, reject) => {
        const img = document.createElement("img");
        const blob = new Blob([svg], { type: "image/svg+xml;charset=utf8" });
        img.addEventListener("load", () => {
            resolve({
                height: img.naturalHeight,
                width: img.naturalWidth
            });
        });
        img.addEventListener("error", (error) => {
            reject(error);
        });
        img.src = URL.createObjectURL(blob);
    });
};
exports.injectSvgInPage = async (rawSvg, width, height) => {
    const img = document.createElement("img");
    const sandbox = document.createElement("div");
    sandbox.innerHTML = rawSvg;
    const svg = sandbox.querySelector("svg");
    if (!svg) {
        return;
    }
    svg.setAttribute("preserveAspectRatio", "none");
    const blob = new Blob([sandbox.innerHTML], { type: "image/svg+xml;charset=utf8" });
    img.style.width = width;
    img.style.height = height;
    img.src = URL.createObjectURL(blob);
    document.body.appendChild(img);
};
