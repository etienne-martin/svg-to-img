/// <reference types="node" />
import { IOptions } from "./typings/types";
export declare const from: (input: string | Buffer) => {
    to: (output: IOptions) => Promise<string | Buffer>;
};
