import type { Options } from 'tsup';

export const tsup: Options = {
  splitting: true,
  clean: true,
  format: ['cjs'],
  minify: true,
  bundle: true,
  skipNodeModulesBundle: true,
  target: 'es2020',
  outDir: 'bin',
  platform: 'node',
  entry: ['src/cli.ts'],
};
