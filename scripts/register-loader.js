import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
register(pathToFileURL('./scripts/jsx-loader.js'), import.meta.url);
