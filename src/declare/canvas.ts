/**
 * @author WMXPY
 * @namespace Declare
 * @fileoverview Canvas
 */


export interface ICanvas {

    clear: (lines?: number) => ICanvas;
    cursor: (place: number, top?: boolean) => ICanvas;
    draw: (...contents: string[]) => ICanvas;
    drawObject: (object: any) => ICanvas;
    enter: () => ICanvas;
    exit: (code?: number) => void;
    raw: (...contents: string[]) => ICanvas;
    replace: (...contents: string[]) => ICanvas;
}
