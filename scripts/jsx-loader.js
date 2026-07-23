import { transform } from 'esbuild';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const mockUrl = `file://${path.resolve('next-link-mock.js')}`;

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/link') {
    return { url: mockUrl, shortCircuit: true };
  }
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (err.code === 'ERR_UNSUPPORTED_DIR_IMPORT' || err.code === 'ERR_MODULE_NOT_FOUND') {
      try {
        const parentPath = context.parentURL ? new URL(context.parentURL).pathname : process.cwd();
        const reqPath = require.resolve(specifier, { paths: [parentPath] });
        return { url: `file://${reqPath}`, shortCircuit: true };
      } catch (e2) {}
    }
    throw err;
  }
}

export async function load(url, context, nextLoad) {
  if (url === mockUrl) {
    return {
      format: 'module',
      shortCircuit: true,
      source: `import React from 'react'; export default function Link({ children }) { return React.createElement('a', null, children); }`
    };
  }
  if (url.endsWith('.json')) {
    const fs = await import('fs');
    const path = new URL(url).pathname;
    const content = fs.readFileSync(path, 'utf8');
    return {
      format: 'module',
      shortCircuit: true,
      source: `export default ${content};`
    };
  }
  
  const result = await nextLoad(url, context);
  if (url.endsWith('.js') && !url.includes('node_modules')) {
    const source = typeof result.source === 'string' ? result.source : result.source.toString();
    if (source.includes('from \'react\'') || source.includes('React.createElement') || source.includes('</') || source.includes('/>')) {
      const transformed = await transform(source, {
        loader: 'jsx',
        jsx: 'automatic',
        format: 'esm',
        target: 'es2022'
      });
      return {
        format: 'module',
        shortCircuit: true,
        source: transformed.code
      };
    }
  }
  return result;
}
