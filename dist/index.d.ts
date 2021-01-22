/// <reference types="node" />
import { IOptions, IShorthandOptions } from "./typings";
export declare const from: (svg: Buffer | string) => {
    to: (options: IOptions) => Promise<Buffer | string>;
    toPng: (options?: IShorthandOptions | undefined) => Promise<Buffer | string>;
    toJpeg: (options?: IShorthandOptions | undefined) => Promise<Buffer | string>;
    toWebp: (options?: IShorthandOptions | undefined) => Promise<Buffer | string>;
};
