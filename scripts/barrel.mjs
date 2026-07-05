// @ts-check
import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// simple wrapper around barrelsby to allow appending exports after generation

const args = process.argv.slice(2);
const appendIndex = args.indexOf('--append');
let appendContent = '';

if (appendIndex !== -1) {
  if (appendIndex + 1 < args.length) {
    appendContent = args[appendIndex + 1];
    args.splice(appendIndex, 2);
  } else {
    console.error('Error: --append requires a value');
    process.exit(1);
  }
}

try {
  execSync(`barrelsby ${args.join(' ')}`, { stdio: 'inherit' });

  if (appendContent) {
    let directory = '.';
    let name = 'index';

    const dirIdx = args.indexOf('--directory');
    const dIdx = args.indexOf('-d');
    const dirIndex = dirIdx !== -1 ? dirIdx : dIdx;

    if (dirIndex !== -1 && dirIndex + 1 < args.length) {
      directory = args[dirIndex + 1];
    }

    const nameIdx = args.indexOf('--name');
    const nIdx = args.indexOf('-n');
    const nameIndex = nameIdx !== -1 ? nameIdx : nIdx;

    if (nameIndex !== -1 && nameIndex + 1 < args.length) {
      name = args[nameIndex + 1];
    }

    const indexPath = join(process.cwd(), directory, `${name}.ts`);

    if (existsSync(indexPath)) {
      const currentContent = readFileSync(indexPath, 'utf8');

      if (!currentContent.includes(appendContent.trim())) {
        console.log(`Appending export to ${indexPath}...`);
        appendFileSync(indexPath, `\n${appendContent}\n`);
      } else {
        console.log('Export already present.');
      }

      console.log('Barrel file updated successfully.');
    } else {
      console.error(`Error: Generated barrel file not found at ${indexPath}`);
      process.exit(1);
    }
  }
} catch (error) {
  console.error('Error running barrel script:', error);
  process.exit(1);
}
