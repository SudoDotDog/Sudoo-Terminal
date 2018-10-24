/**
 * @author WMXPY
 * @namespace Imp
 * @description Imp
 */

import { Connor } from 'connor';
import * as Readline from 'readline';
import { ERROR_CODE, MODULE_NAME } from '../declare/error';
import { IInput } from '../declare/imp';

const error = Connor.getErrorCreator(MODULE_NAME);

export class Imp {

    public static get instance(): Imp {

        if (!this._instance) {
            this._instance = new Imp();
        }
        return this._instance;
    }

    private static _instance: Imp;

    public constructor() {

        const stream: NodeJS.WriteStream = process.stdout;
        if (!stream.isTTY) {
            throw error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }
    }

    public listen(): Imp {

        if (process.stdin.setRawMode) {

            Readline.emitKeypressEvents(process.stdin);
            if (process.stdin.isTTY) process.stdin.setRawMode(true);
        }
        return this;
    }

    public stopListen(): Imp {

        if (process.stdin.setRawMode) {

            Readline.emitKeypressEvents(process.stdin);
            if (process.stdin.isTTY) process.stdin.setRawMode(false);
        }
        return this;
    }

    private _onKey(str: string, key: IInput): Imp {

        if ((key.name === 'left' || key.name === 'right')
            && process.stdout.isTTY) {
            return key as any;
        } else if (key.ctrl && key.name === 'c') {
            process.exit();
        }
        return this;
    }
}
