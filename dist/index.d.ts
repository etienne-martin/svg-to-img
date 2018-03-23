/// <reference types="node" />
import { IOptions, IShorthandOptions } from "./typings";
export declare const from: (svg: string | Buffer) => {
    to: (options: IOptions) => Promise<string | Buffer>;
    toPng: (options?: IShorthandOptions | undefined) => Promise<string | Buffer>;
    toJpeg: (options?: IShorthandOptions | undefined) => Promise<string | Buffer>;
    toWebp: (options?: IShorthandOptions | undefined) => Promise<string | Buffer>;
};
