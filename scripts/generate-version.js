import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json from the parent folder
const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, '../package.json'), 'utf8'));

// Create a version file that simply exports the version as a constant
const versionFileContent = `// Auto-generated file, do not edit
export const version = '${packageJson.version}';
`;

// Write to your source directory
fs.writeFileSync(resolve(__dirname, '../src/utils/version.ts'), versionFileContent);
console.log(`Generated version file with version ${packageJson.version}`);