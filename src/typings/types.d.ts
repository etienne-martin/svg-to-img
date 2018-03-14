import * as puppeteer from "puppeteer";

export interface IOptions extends puppeteer.ScreenshotOptions {
  encoding?: "base64"|"utf8"|"binary"|"hex";
  background?: string;
  width?: number;
  height?: number;
}

export interface IPngShorthandOptions extends IOptions  {
  type?: never;
  quality?: never;
}

export interface IJpegShorthandOptions extends IOptions  {
  type?: never;
}
