/**
 * @author WMXPY
 * @namespace Util_String
 * @fileoverview Common
 */

export const lastElement: <T>(arr: T[]) => T =
    <T>(arr: T[]): T => arr[arr.length - 1];

export const splitInput: (input: string) => string[] =
    (input: string): string[] =>
        (input.match(/\"\S[^\"]*\"|\S+/g) || [])
            .map((str) => str.replace(/\"/g, ''))
            .filter((s: string) => Boolean(s.trim()));

export const spaces =
    (length: number) => ' '.repeat(length);
