/**
 * @author WMXPY
 * @namespace Imp
 * @description Imp
 */

import { Connor, ErrorCreationFunction } from 'connor';
import * as Readline from 'readline';
import { Canvas } from '../canvas';
import { ERROR_CODE, MODULE_NAME } from '../declare/error';
import { HANDLE_KEY_PRESS_FUNCTION, IInput, SPECIAL_META } from '../declare/imp';

export class Imp {

    public static get instance(): Imp {

        if (!this._instance) {
            this._instance = new Imp(process.stdin);
        }
        return this._instance;
    }

    private static _instance: Imp;

    private _stdin: NodeJS.ReadStream;
    private _onKey: HANDLE_KEY_PRESS_FUNCTION | null;
    private _onSpecial: Map<string, HANDLE_KEY_PRESS_FUNCTION>;
    private _onMeta: Map<SPECIAL_META, HANDLE_KEY_PRESS_FUNCTION>;

    private _error: ErrorCreationFunction;

    public constructor(stdin: NodeJS.ReadStream) {
        this._stdin = stdin;

        this._throwIfNotTTY();

        this._onKey = null;
        this._onSpecial = new Map<string, HANDLE_KEY_PRESS_FUNCTION>();
        this._onMeta = new Map<SPECIAL_META, HANDLE_KEY_PRESS_FUNCTION>();
        this._stdin.removeAllListeners();

        this._error = Connor.getErrorCreator(MODULE_NAME);

    }

    public clear(): Imp {

        this._throwIfNotTTY();

        this._onKey = null;
        this._onSpecial = new Map<string, HANDLE_KEY_PRESS_FUNCTION>();
        this._onMeta = new Map<SPECIAL_META, HANDLE_KEY_PRESS_FUNCTION>();
        this._stdin.removeAllListeners();

        return this;
    }

    public onKey(key: string, onSpecial: HANDLE_KEY_PRESS_FUNCTION): Imp {

        this._onSpecial.set(key, onSpecial);
        return this;
    }

    public onMeta(meta: SPECIAL_META, onSpecial: HANDLE_KEY_PRESS_FUNCTION): Imp {

        if (meta !== SPECIAL_META.CTRL
            && meta !== SPECIAL_META.META
            && meta !== SPECIAL_META.SHIFT) {

            throw this._error(ERROR_CODE.META_NOT_AVAILABLE);
        }
        this._onMeta.set(meta, onSpecial);
        return this;
    }

    public listen(onKey: HANDLE_KEY_PRESS_FUNCTION): Imp {

        this.clear();
        this._throwIfNotTTY();
        if (!this._stdin.setRawMode) {

            throw this._error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }

        Readline.emitKeypressEvents(this._stdin);
        this._stdin.setRawMode(true);

        this._onKey = onKey;
        this._stdin.on('keypress', this._handleKeyPress.bind(this));
        return this;
    }

    public stopListen(): Imp {

        this.clear();
        this._throwIfNotTTY();
        if (!this._stdin.setRawMode) {

            throw this._error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }

        if (this._stdin.isTTY) this._stdin.setRawMode(false);
        return this;
    }

    public press(key: IInput): Imp {

        this._handleKeyPress(key.name || key.sequence, key);
        return this;
    }

    private _throwIfNotTTY(): Imp {

        if (!this._stdin.isTTY) {
            throw this._error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }
        return this;
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

        if (key.meta && this._onMeta.has(SPECIAL_META.META)) {

            const result: boolean = (this._onMeta.get(SPECIAL_META.META) as any)(str, key);
            if (result) this._triggerNormalKey(str, key);
            return this;
        }

        if (key.ctrl && this._onMeta.has(SPECIAL_META.CTRL)) {

            const result: boolean = (this._onMeta.get(SPECIAL_META.CTRL) as any)(str, key);
            if (result) this._triggerNormalKey(str, key);
            return this;
        }

        if (key.shift && this._onMeta.has(SPECIAL_META.SHIFT)) {

            const result: boolean = (this._onMeta.get(SPECIAL_META.SHIFT) as any)(str, key);
            if (result) this._triggerNormalKey(str, key);
            return this;
        }

        if (this._onSpecial.has(key.name || key.sequence)) {

            const result: boolean = (this._onSpecial.get(key.name || key.sequence) as any)(str, key);
            if (result) this._triggerNormalKey(str, key);
        } else this._triggerNormalKey(str, key);
        return this;
    }

    private _triggerNormalKey(str: string, key: IInput): Imp {

        if (!this._onKey) throw this._error(ERROR_CODE.INTERNAL_ERROR);
        this._onKey(str, key);
        return this;
    }
}
