/**
 * @author WMXPY
 * @namespace Imp
 * @description Imp
 */

import { Connor } from 'connor';
import * as Readline from 'readline';
import { Canvas } from '../canvas';
import { ERROR_CODE, MODULE_NAME } from '../declare/error';
import { HANDLE_KEY_PRESS_FUNCTION, IInput, SPECIAL_META } from '../declare/imp';

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
    private _onMeta: Map<SPECIAL_META, HANDLE_KEY_PRESS_FUNCTION>;

    public constructor() {

        this._throwIfNotTTY();

        this._onKey = null;
        this._onSpecial = new Map<string, HANDLE_KEY_PRESS_FUNCTION>();
        this._onMeta = new Map<SPECIAL_META, HANDLE_KEY_PRESS_FUNCTION>();
    }

    public clear(): Imp {

        this._onKey = null;
        this._onSpecial = new Map<string, HANDLE_KEY_PRESS_FUNCTION>();
        process.stdin.removeAllListeners();
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

            throw error(ERROR_CODE.META_NOT_AVAILABLE);
        }
        this._onMeta.set(meta, onSpecial);
        return this;
    }

    public listen(onKey: HANDLE_KEY_PRESS_FUNCTION): Imp {

        this.clear();
        this._throwIfNotTTY();
        if (!process.stdin.setRawMode) {

            throw error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }

        Readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        this._onKey = onKey;
        process.stdin.on('keypress', this._handleKeyPress.bind(this));
        return this;
    }

    public stopListen(): Imp {

        this.clear();
        this._throwIfNotTTY();
        if (!process.stdin.setRawMode) {

            throw error(ERROR_CODE.IMP_NOT_AVAILABLE);
        }

        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        return this;
    }

    public press(key: IInput): Imp {

        this._handleKeyPress(key.name || key.sequence, key);
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

        if (!this._onKey) throw error(ERROR_CODE.INTERNAL_ERROR);
        this._onKey(str, key);
        return this;
    }
}
