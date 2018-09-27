/**
 * @author WMXPY
 * @namespace Mock_Node
 * @fileoverview Console
 */

export interface IMockConsoleResult {
    log: string[];
}

export const mockConsole = (): () => IMockConsoleResult => {
    const result: IMockConsoleResult = {
        log: [],
    };
    const tempConsole = global.console;

    (global as any).console = {
        log: (...contents: string[]) => {
            result.log.push(...contents);
        },
    };

    return (): IMockConsoleResult => {
        (global as any).console = tempConsole;
        return result;
    };
};
