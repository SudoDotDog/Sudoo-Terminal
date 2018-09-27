/**
 * @author WMXPY
 * @description Binding
 */

import * as ModuleAlias from 'module-alias';
import * as Path from 'path';

((MODULE_ALIAS: string | undefined, isTest: boolean) => {
    if (MODULE_ALIAS) return; else process.env.NODE_MODULE_ALIAS_SUDOO = 'TRUE';
    const here: string = isTest ?
        Path.join(__dirname) :
        Path.join(__dirname, '..', 'dist');

    ModuleAlias.addAliases({
        "#canvas": Path.join(here, 'canvas'),
        "#declare":  Path.join(here, 'declare'),
        "#listener": Path.join(here, 'listener'),
        "#util": Path.join(here, 'util'),
    });
})(process.env.NODE_MODULE_ALIAS_SUDOO, process.env.NODE_ENV === 'test');
