// Zieht das GraphQL-Schema aus dem Backend-Repo (glabs, Schwesterverzeichnis)
// in eine einzige, eingecheckte SDL-Datei `schema.graphql`. Diese vendorte Kopie
// ist die Quelle für graphql-codegen — so laufen Codegen und Typecheck
// reproduzierbar (auch in CI, wo das Backend-Repo nicht vorliegt), ohne einen
// laufenden Server zu brauchen.
//
// Bei Schema-Änderungen im Backend: `pnpm run schema:pull` ausführen und die
// aktualisierte schema.graphql + neu generierte Typen (`pnpm run codegen`)
// mitcommitten.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
// glabs.gui und glabs liegen als Schwesterverzeichnisse unter .../sw/.
const graphDir = join(repoRoot, '..', 'glabs', 'web', 'graph');
const outFile = join(repoRoot, 'schema.graphql');

const files = readdirSync(graphDir)
	.filter((f) => f.endsWith('.graphqls'))
	.sort();

if (files.length === 0) {
	console.error(`Keine .graphqls-Dateien in ${graphDir} gefunden.`);
	process.exit(1);
}

const parts = files.map((f) => {
	const body = readFileSync(join(graphDir, f), 'utf-8').trimEnd();
	return `# ----- ${f} -----\n${body}\n`;
});

const header =
	'# GENERIERT von `pnpm run schema:pull` aus glabs/web/graph/*.graphqls.\n' +
	'# Nicht von Hand bearbeiten — bei Backend-Schema-Änderungen neu ziehen.\n\n';

writeFileSync(outFile, header + parts.join('\n'), 'utf-8');
console.log(`schema.graphql geschrieben (${files.length} Dateien): ${files.join(', ')}`);
