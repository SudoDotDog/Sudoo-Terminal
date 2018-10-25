/**
 * @author WMXPY
 * @namespace Declare
 * @fileoverview Imp
 */

export enum SPECIAL_INPUT_NAME {
    ENTER = 'return',
    TAB = 'tab',
    BACKSPACE = 'backspace',
}

export enum SPECIAL_META {
    SHIFT = 'shift',
    CTRL = 'ctrl',
    META = 'meta',
}

export interface IInput {

    sequence: string;
    name?: string | SPECIAL_INPUT_NAME;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}

export type HANDLE_KEY_PRESS_FUNCTION = (str: string, key: IInput) => boolean;
