/// <reference types="node" />
import { IBoundingBox } from "./typings";
export declare const getFileTypeFromPath: (path: string) => string;
export declare const stringifyFunction: (func: any, ...argsArray: any[]) => string;
export declare const writeFileAsync: (path: string, data: Buffer) => Promise<{}>;
export declare const renderSvg: (svg: string, options: {
    width?: number | undefined;
    height?: number | undefined;
    type: "jpeg" | "png" | "webp" | undefined;
    quality: number | undefined;
    background?: string | undefined;
    clip?: IBoundingBox | undefined;
    jpegBackground: string;
}) => Promise<{}>;
