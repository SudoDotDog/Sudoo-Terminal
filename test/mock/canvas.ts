/**
 * @author WMXPY
 * @namespace Mock_Common_Canvas
 * @fileoverview Class
 */

import { ICanvas } from "#declare/canvas";

export class MockCanvas implements ICanvas {
    private _result: string[];

    public constructor() {
        this._result = [];
    }

    public clear(): ICanvas {
        this._result.push('clear');
        return this;
    }

    public cursor(): ICanvas {
        this._result.push('cursor');
        return this;
    }

    public draw(...contents: string[]): ICanvas {
        this._result.push(...contents);
        return this;
    }

    public drawObject(...contents: string[]): ICanvas {
        this._result.push(...contents);
        return this;
    }

    public enter(): ICanvas {
        this._result.push('enter');
        return this;
    }

    public exit(code?: number): void {
        this._result.push('exit' + (code || 9));
    }

    public replace(): ICanvas {
        this._result.push('replace');
        return this;
    }

    public raw(...contents: string[]): ICanvas {
        this._result.push(...contents);
        return this;
    }

    public test_result() {
        return this._result;
    }
}
