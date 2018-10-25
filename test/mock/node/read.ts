/**
 * @author WMXPY
 * @namespace Mock_Node
 * @fileoverview ReadStream
 */

export class MockReadStream {

    private _moves: string[];
    private _isTTY: boolean;
    private _listenerCount: number;

    public constructor(isTTY: boolean = true) {

        this._isTTY = isTTY;
        this._listenerCount = 0;
        this._moves = [];
    }

    public result() {
        return this._moves;
    }

    public flush(): NodeJS.ReadStream {
        return {
            setRawMode: this.__setRawMode.bind(this),
            on: this.__on.bind(this),
            isTTY: this._isTTY,
            listenerCount: this.__listenerCount.bind(this),
            removeAllListeners: this.__removeAllListeners.bind(this),
        } as any as NodeJS.ReadStream;
    }

    protected __listenerCount(): number {
        this._moves.push('ListenerCount:' + this._listenerCount);
        return this._listenerCount;
    }

    protected __setRawMode(mode: boolean): void {
        this._moves.push('SetRawMode:' + mode.toString());
    }

    protected __on(value: string, func: any): void {
        this._listenerCount++;
        this._moves.push('On:' + value + '-' + func.toString().length);
    }

    protected __removeAllListeners(): void {
        this._listenerCount = 0;
        this._moves.push('RemoveAllListeners');
    }
}
