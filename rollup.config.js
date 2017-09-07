import pkg from './package.json';

export default {
  plugins: [],
  external: ['expression-expander'],
  input: pkg.module,

  output: {
    format: 'cjs',
    file: pkg.main
  }
};
