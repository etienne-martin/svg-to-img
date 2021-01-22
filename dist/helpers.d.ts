/// <reference types="node" />
import { IBoundingBox, IOptions } from "./typings";
export declare const getFileTypeFromPath: (path: string) => string;
export declare const stringifyFunction: (func: any, ...argsArray: any[]) => string;
export declare const writeFileAsync: (path: string, data: Buffer) => Promise<void>;
export declare const renderSvg: (svg: string, options: {
    width?: IOptions["width"];
    height?: IOptions["height"];
    type: IOptions["type"];
    quality: IOptions["quality"];
    background?: IOptions["background"];
    clip?: IBoundingBox;
    jpegBackground: string;
}) => Promise<unknown>;
