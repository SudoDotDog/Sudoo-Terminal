/**
 * @author WMXPY
 * @namespace Imp
 * @description Imp
 */

import { Connor } from 'connor';
import { ERROR_CODE, MODULE_NAME } from '../declare/error';

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
}
