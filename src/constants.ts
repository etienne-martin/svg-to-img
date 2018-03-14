import { IOptions } from "./typings/types";

export const config = {
  supportedImageTypes: ["jpeg", "png"],
  jpegBackground: "#fff",
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
};

export const defaultOptions: IOptions = {
  omitBackground: true,
  quality: 100,
  type: "png"
};

export const defaultPngShorthandOptions: IOptions = {
  type: "png"
};

export const defaultJpegShorthandOptions: IOptions = {
  type: "jpeg"
};
