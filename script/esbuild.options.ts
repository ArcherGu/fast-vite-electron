import { join } from 'path';
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { builtinModules } from "module";
import { BuildOptions } from "esbuild";

export function createOptions(): BuildOptions {
    return {
        entryPoints: [join(__dirname, '../src/main/index.ts')],
        target: 'es2020',
        outfile: join(__dirname, '../dist/main/index.js'),
        format: 'cjs',
        bundle: true,
        platform: 'node',
        plugins: [
            esbuildDecorators({
                tsconfig: join(__dirname, '../tsconfig.json')
            })
        ],
        external: [
            ...builtinModules.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x)),
            'electron'
        ]
    };
};