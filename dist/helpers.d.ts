export declare const getFileTypeFromPath: (path: string) => string;
export declare const getSvgNaturalDimensions: (svg: string) => Promise<{}>;
export declare const embedSvgInBody: (rawSvg: string, width: string, height: string) => Promise<{}>;
export declare const convertFunctionToString: (func: any, ...argsArray: any[]) => string;
export declare const setStyle: (selector: string, styles: {
    [key: string]: string;
}) => void;
