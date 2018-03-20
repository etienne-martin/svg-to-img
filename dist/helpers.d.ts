export declare const getFileTypeFromPath: (path: string) => string;
export declare const stringifyFunction: (func: any, ...argsArray: any[]) => string;
export declare const renderSvg: (svg: string, options: {
    width?: number | undefined;
    height?: number | undefined;
    type: "jpeg" | "png" | "webp" | undefined;
    quality: number | undefined;
    background: string | undefined;
    jpegBackground: string;
}) => Promise<{}>;
