/**
 * @author WMXPY
 * @namespace Mock_Node
 * @fileoverview Writeable Stream
 */

export class MockWriteableStream {
    private _moves: string[];

    public constructor() {
        this._moves = [];
    }

    public result() {
        return this._moves;
    }

    public flush(): NodeJS.WritableStream {
        return {
            write: this.__write.bind(this),
            cursorTo: this.__cursorTo.bind(this),
            clearLine: this.__clearLine.bind(this),
        } as any as NodeJS.WritableStream;
    }

    protected __write(content: string): void {
        this._moves.push('W:' + content);
    }

    protected __cursorTo(place: number): void {
        this._moves.push('M:' + place);
    }

    protected __clearLine(place: number): void {
        this._moves.push('C:' + place);
    }
}
