import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';
// import nodent from 'rollup-plugin-nodent';
// eslint-disable-next-line import/extensions
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

const name = 'packAxios';

export default {
  input: './src/lib.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],

  plugins: [

    // Allows node_modules resolution
    resolve({
      extensions,
      main: true,
      browser: true,
    }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    json(),

    // Compile TypeScript/JavaScript files
    babel({
      runtimeHelpers: true,
      extensions,
      include: ['src/**/*'],
      exclude: 'node_modules/**',
    }),
    // nodent({
    //   noRuntime: true,
    // }),
  ],

  output: [
      {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    // {
    //   file: pkg.browser,
    //   format: 'iife',
    //   name,
    //   // https://rollupjs.org/guide/en#output-globals-g-globals
    //   globals: {
    //     "@babel/runtime/regenerator": "regeneratorRuntime"
    //   },
    // },
  ],
};
