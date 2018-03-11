export declare const getFileTypeFromPath: (path: string) => string;
export declare const getSvgNaturalDimensions: (svg: string) => Promise<{
    width: number;
    height: number;
}>;
export declare const injectSvgInPage: (rawSvg: string, width: string, height: string) => Promise<void>;
