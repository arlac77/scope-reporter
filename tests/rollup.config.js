const external = ['ava'];

export default [
  {
    input: 'tests/reporter-test.js',
    output: {
      file: 'build/reporter-test.js',
      format: 'cjs',
      sourcemap: true
    },
    external
  },
  {
    input: 'tests/scopedef-test.js',
    output: {
      file: 'build/scopedef-test.js',
      format: 'cjs',
      sourcemap: true
    },
    external
  }
];
