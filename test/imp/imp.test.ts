/**
 * @author WMXPY
 * @namespace Imp
 * @fileoverview Imp Test
 */
import { Connor } from 'connor';
import { MODULE_NAME } from '../../src/declare/error';

Connor.instance(MODULE_NAME);

import { expect } from 'chai';
import * as Chance from 'chance';
import { IInput } from '../../src';
import { Imp } from '../../src/imp';
import { MockReadStream } from '../mock/node/read';


describe('Given a <Imp> class', function (this: Mocha.Suite): void {

    const chance: Chance.Chance = new Chance('common-imp-test');

    it('should be able to start listen', () => {

        const stream: MockReadStream = new MockReadStream();
        const imp: Imp = new Imp(stream.flush());
        const inputted: string[] = [];

        imp.listen((str: string, key: IInput) => {
            inputted.push(str);
            return false;
        });

        const result: string[] = stream.result();
        expect(inputted).to.be.lengthOf(0);
        expect(result).to.be.lengthOf(6);
    });

    it('should be able to stop listen', () => {

        const stream: MockReadStream = new MockReadStream();
        const imp: Imp = new Imp(stream.flush());
        const inputted: string[] = [];

        imp.listen((str: string, key: IInput) => {
            inputted.push(str);
            return false;
        });
        imp.stopListen();

        const result: string[] = stream.result();
        expect(inputted).to.be.lengthOf(0);
        expect(result).to.be.lengthOf(8);
    });

    it('should be able to react when key press', () => {

        const stream: MockReadStream = new MockReadStream();
        const imp: Imp = new Imp(stream.flush());
        const inputted: string[] = [];

        imp.listen((str: string, key: IInput) => {
            inputted.push(str);
            return false;
        });
        imp.press({
            sequence: 'a',
            name: 'a',
            ctrl: false,
            shift: false,
            meta: false,
        });

        const result: string[] = stream.result();
        expect(inputted).to.be.lengthOf(1);
        expect(result).to.be.lengthOf(6);
    });
});
