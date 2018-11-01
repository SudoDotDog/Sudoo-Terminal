/**
 * @author WMXPY
 * @namespace Mock_Common_Canvas
 * @fileoverview Class
 */

export class MockCanvas {
    private _result: string[];

    public constructor() {
        this._result = [];
    }

    public clear(): MockCanvas {
        this._result.push('clear');
        return this;
    }

    public cursor(): MockCanvas {
        this._result.push('cursor');
        return this;
    }

    public draw(...contents: string[]): MockCanvas {
        this._result.push(...contents);
        return this;
    }

    public drawObject(...contents: string[]): MockCanvas {
        this._result.push(...contents);
        return this;
    }

    public enter(): MockCanvas {
        this._result.push('enter');
        return this;
    }

    public exit(code?: number): void {
        this._result.push('exit' + (code || 9));
    }

    public replace(): MockCanvas {
        this._result.push('replace');
        return this;
    }

    public raw(...contents: string[]): MockCanvas {
        this._result.push(...contents);
        return this;
    }

    public test_result() {
        return this._result;
    }
}
