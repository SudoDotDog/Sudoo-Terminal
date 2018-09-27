/**
 * @author WMXPY
 * @namespace Test_Util_String
 * @fileoverview Similarity
 */

require('../../../src/binding');
import { similar } from '#util/string/similarity';
import { expect } from 'chai';
import * as Chance from 'chance';

describe('Given similarity function', function (this: Mocha.Suite): void {
    const chance: Chance.Chance = new Chance('util-string-similarity-test');

    it('should get 0 with same strings', () => {
        const baseString: string = chance.string();
        const result: number = similar(baseString, baseString);

        expect(result).to.be.equal(0);
    });

    it('should get more than 1 with different strings', () => {
        const baseString: string = chance.string();
        const targetString: string = chance.string();

        const result: number = similar(baseString, targetString);

        expect(result).to.be.gte(1);
    });
});
