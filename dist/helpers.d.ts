export declare const getFileTypeFromPath: (path: string) => string;
export declare const getNaturalSvgDimensions: (svg: string) => Promise<{}>;
export declare const embedSvgInBody: (rawSvg: string, width: string, height: string) => Promise<{}>;
export declare const stringifyFunction: (func: any, ...argsArray: any[]) => string;
export declare const setStyle: (selector: string, styles: {
    [key: string]: string;
}) => void;
