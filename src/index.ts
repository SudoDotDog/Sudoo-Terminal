/**
 * @author WMXPY
 * @description Sudoo Terminal
 */

import { Connor } from 'connor';
import { Canvas as CanvasClass } from './canvas/index';
import { ERROR_CODE, MODULE_NAME } from './declare/error';

Connor.dictionary(MODULE_NAME, {
    1101: 'Canvas is only available in terminal',
    9001: 'Internal error',
});

const error = Connor.getErrorCreator(MODULE_NAME);

export const Canvas = (): CanvasClass => {

    const stream: NodeJS.WriteStream = process.stdout;
    if (stream.isTTY) {
        return CanvasClass.instance;
    }
    throw error(ERROR_CODE.CANVAS_NOT_AVAILABLE);
};

export { ICanvas } from './declare/canvas';
export { CanvasClass };

