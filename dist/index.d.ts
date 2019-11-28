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
declare class Svg {
    private readonly svg;
    private browserSource;
    constructor(svg: Buffer | string, browserSource: BrowserSource);
    to(options: IOptions): Promise<Buffer | string>;
    toPng(options?: IShorthandOptions): Promise<Buffer | string>;
    toJpeg(options?: IShorthandOptions): Promise<Buffer | string>;
    toWebp(options?: IShorthandOptions): Promise<Buffer | string>;
    private convertSvg;
}
declare class SvgToImg {
    private readonly browserSource;
    constructor(browserSource: BrowserSource);
    from(svg: Buffer | string): Svg;
}
export declare const from: (svg: string | Buffer) => Svg;
export declare const connect: (options?: puppeteer.ConnectOptions | undefined) => SvgToImg;
export {};
