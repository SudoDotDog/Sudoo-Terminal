/**
 * @author WMXPY
 * @namespace Imp
 * @description Imp
 */

import { Connor } from 'connor';
import * as Readline from 'readline';
import { Canvas } from '../canvas';
import { ERROR_CODE, MODULE_NAME } from '../declare/error';
import { HANDLE_KEY_PRESS_FUNCTION, IInput } from '../declare/imp';

const error = Connor.getErrorCreator(MODULE_NAME);

export class Imp {

    public static get instance(): Imp {

        if (!this._instance) {
            this._instance = new Imp();
        }
        return this._instance;
    }

    private static _instance: Imp;

    private _onKey: HANDLE_KEY_PRESS_FUNCTION | null;
    private _onSpecial: Map<string, HANDLE_KEY_PRESS_FUNCTION>;

    public constructor() {

        this._throwIfNotTTY();

        this._onKey = null;
        this._onSpecial = new Map<string, HANDLE_KEY_PRESS_FUNCTION>();
    }

    public clean(): Imp {

        this._onKey = null;
        this._onSpecial = new Map<string, HANDLE_KEY_PRESS_FUNCTION>();
        process.stdin.removeAllListeners();
        return this;
    }

    public on(key: string, onSpecial: HANDLE_KEY_PRESS_FUNCTION): Imp {

        this._onSpecial.set(key, onSpecial);
        return this;
    }

    public listen(onKey: HANDLE_KEY_PRESS_FUNCTION): Imp {

        this.stopListen();
        this._throwIfNotTTY();
        if (!process.stdin.setRawMode) {

            throw error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }

        Readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', this._handleKeyPress.bind(this));
        this._onKey = onKey;
        return this;
    }

    public stopListen(): Imp {

        if (process.stdin.setRawMode) {

            Readline.emitKeypressEvents(process.stdin);
            if (process.stdin.isTTY) process.stdin.setRawMode(false);
        }

        this.clean();
        return this;
    }

    private _throwIfNotTTY(): void {

        if (!process.stdin.isTTY) {
            throw error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }
        return;
    }

    private _handleKeyPress(str: string, key: IInput): Imp {

        this._throwIfNotTTY();
        if (key.name === 'left' || key.name === 'right') {

            const canvas = Canvas.instance;
            canvas.raw(key.sequence);
        } else if (key.ctrl && key.name === 'c') process.exit();
        else this._triggerHandler(str, key);
        return this;
    }

    private _triggerHandler(str: string, key: IInput): Imp {

        if (this._onSpecial.has(key.name || key.sequence)) {

            (this._onSpecial.get(key.name || key.sequence) as any)(str, key);
        } else {

            if (!this._onKey) throw error(ERROR_CODE.INTERNAL_ERROR);
            this._onKey(str, key);
        }
        return this;
    }
}
