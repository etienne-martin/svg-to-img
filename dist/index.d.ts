/// <reference types="node" />
import { IOptions, IPngShorthandOptions, IJpegShorthandOptions } from "./typings/types";
export declare const from: (svg: string | Buffer) => {
    to: (options: IOptions) => Promise<string | Buffer>;
    toPng: (options?: IPngShorthandOptions | undefined) => Promise<string | Buffer>;
    toJpeg: (options?: IJpegShorthandOptions | undefined) => Promise<string | Buffer>;
};
