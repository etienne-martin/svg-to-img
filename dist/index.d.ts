/// <reference types="node" />
import * as puppeteer from "puppeteer";
import { IOptions, IShorthandOptions } from "./typings";
export declare class BrowserSource {
    private readonly factory;
    private queue;
    private browserDestructionTimeout;
    private browserInstance;
    private browserState;
    constructor(factory: () => Promise<puppeteer.Browser>);
    getBrowser(): Promise<puppeteer.Browser>;
    scheduleBrowserForDestruction(): void;
    private executeQueuedRequests;
}
declare class SvgToImg {
    private readonly svg;
    private browserSource;
    constructor(svg: Buffer | string, browserSource: BrowserSource);
    to(options: IOptions): Promise<Buffer | string>;
    toPng(options?: IShorthandOptions): Promise<Buffer | string>;
    toJpeg(options?: IShorthandOptions): Promise<Buffer | string>;
    toWebp(options?: IShorthandOptions): Promise<Buffer | string>;
    private convertSvg;
}
declare class SvgToImgBrowser {
    private readonly browserSource;
    constructor(browserSource: BrowserSource);
    from(svg: Buffer | string): SvgToImg;
}
export declare const from: (svg: string | Buffer) => SvgToImg;
export declare const connect: (options?: puppeteer.ConnectOptions | undefined) => SvgToImgBrowser;
export {};
