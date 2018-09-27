/**
 * @author WMXPY
 * @namespace Canvas
 * @description Canvas
 */

export class Canvas {
    private static _instance: Canvas | null;

    private _stream: NodeJS.WritableStream;

    private _lastDraw: string;

    public constructor(stream?: NodeJS.WritableStream) {
        this._stream = stream || process.stdout;
        this._lastDraw = '';
    }

    public static get instance(): Canvas {
        if (!this._instance) {
            this._instance = new Canvas();
        }

        return this._instance;
    }

    public raw(...contents: string[]): Canvas {
        const raw: string = contents.join('');
        this._stream.write(raw);
        return this;
    }

    public draw(...contents: string[]): Canvas {
        const draw: string = contents.join('');
        this._lastDraw = draw;
        this._stream.write(draw);
        return this;
    }

    public drawObject(object: any): Canvas {
        this.draw(JSON.stringify(object, null, 2));
        return this;
    }

    public enter(): Canvas {
        this._stream.write('\n');
        return this;
    }

    public replace(...contents: string[]): Canvas {
        if (!this._lastDraw) {
            this.draw(...contents);
            return this;
        }

        this.clear(this._replaceLines());
        this.draw(...contents);
        return this;
    }

    public cursor(place: number, top?: boolean): Canvas {
        if (top) {
            (this._stream as any).moveCursor(place, -1);
        } else {
            (this._stream as any).cursorTo(place);
        }

        return this;
    }

    public clear(lines: number = 0): Canvas {
        this.cursor(0);
        (this._stream as any).clearLine();

        if (lines) {
            for (let i = 0; i < lines - 1; i++) {
                this.cursor(0, true);
                (this._stream as any).clearLine();
            }
        }

        return this;
    }

    public exit(code?: number): void {
        this.enter();
        process.exit(code);
        return;
    }

    protected _width(): number {
        const width: number | undefined = process.stdout.columns;
        return width || Number.MAX_SAFE_INTEGER;
    }

    protected _replaceLines(): number {
        const lastDrawLines: string[] = this._lastDraw.split('\n');
        const width: number = this._width();
        const results: number = lastDrawLines.reduce((previous: number, line: string) => {
            return previous + Math.ceil(line.length / (width));
        }, 0);

        return results || 0;
    }
}
