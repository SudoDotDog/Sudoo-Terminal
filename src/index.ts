/**
 * @author WMXPY
 * @fileoverview Sudoo Terminal
 */

import { Canvas as CanvasClass } from '#canvas/index';
import { error, ERROR_CODE } from '#util/error';

export const Canvas = (): CanvasClass => {
    const stream: NodeJS.WriteStream = process.stdout;
    if (stream.isTTY) {
        return CanvasClass.instance;
    }
    throw error(ERROR_CODE.CANVAS_NOT_AVAILABLE);
};
