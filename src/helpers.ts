export const getFileTypeFromPath = (path: string) => {
  return path.toLowerCase().replace(new RegExp("jpg", "g"), "jpeg").split(".").reverse()[0];
};

export const getSvgNaturalDimensions = async (svg: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
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

export const embedSvgInBody = async (rawSvg: string, width: string, height: string) => {
  const img = new Image();
  const sandbox = document.createElement("div");

  sandbox.innerHTML = rawSvg;

  const svg = sandbox.querySelector("svg");

  /* istanbul ignore if  */
  if (!svg) { return; }

  svg.setAttribute("preserveAspectRatio", "none");

  const blob = new Blob([sandbox.innerHTML], { type: "image/svg+xml;charset=utf8" });

  img.style.width = width;
  img.style.height = height;
  img.src = URL.createObjectURL(blob);

  document.body.appendChild(img);
};

export const convertFunctionToString = (func: any, ...argsArray: any[]) => {
  const args = "`" + argsArray.join("`,`") + "`";
  let functionString = func.toString();

  // Remove istanbul coverage instruments
  functionString = functionString.replace(/cov_(.+?)\+\+,?/g, "");
  functionString = functionString.replace(/cov_(.+?)\+\+;?/g, "");

  return `(${functionString})(${args})`;
};
