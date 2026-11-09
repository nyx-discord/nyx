// copies every `out/llms.mdx/<slug>/content.md` to `out/<slug>.md`
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'out');
const llmsDir = join(outDir, 'llms.mdx');

const entries = await readdir(llmsDir, {
  recursive: true,
  withFileTypes: true,
});
let count = 0;

for (const entry of entries) {
  if (!entry.isFile() || entry.name !== 'content.md') continue;

  const slugPath = relative(llmsDir, entry.parentPath);
  const target = join(outDir, `${slugPath === '' ? 'index' : slugPath}.md`);

  await mkdir(dirname(target), { recursive: true });
  await copyFile(join(entry.parentPath, entry.name), target);
  count++;
}

console.log(
  `[llms] Copied ${count} Markdown pages to ${relative(process.cwd(), outDir).split(sep).join('/')}/<slug>.md`,
);
