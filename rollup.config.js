import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import cleanup from 'rollup-plugin-cleanup';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  external: [
    'classnames',
    'react',
    'rect-dom',
    'styled-components',
    'prop-types',
  ],
  input: ['src/index.js'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
    },
    { file: 'dist/index.es.js', format: 'es' },
  ],
  plugins: [
    json(),
    resolve({ extensions: ['.js', '.jsx', '.json'], modulesOnly: true }),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    external(),
    commonjs(),
    cleanup(),
  ],
};
