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

export interface IInput {

    sequence: string;
    name?: string | SPECIAL_INPUT_NAME;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
}
