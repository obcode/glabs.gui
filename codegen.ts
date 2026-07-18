import type { CodegenConfig } from '@graphql-codegen/cli';

// GraphQL-Codegen (client-preset): erzeugt aus dem eingecheckten Schema
// (schema.graphql, via `pnpm run schema:pull` gezogen) und den `graphql(...)`-
// Operationen im Quellcode voll getippte Dokument-Knoten unter src/lib/gql/.
//
// Nutzung im Code:
//   import { graphql } from '$lib/gql';
//   const CoursesDoc = graphql(`query Courses { courses { name } }`);
//   const data = await backendRequest(CoursesDoc); // data ist getippt
//
// Nach dem Ändern einer Operation (oder des Schemas) `pnpm run codegen` laufen
// lassen; `pnpm run check` und `pnpm run dev` tun das ohnehin vorab. Das
// generierte Verzeichnis src/lib/gql/ ist eingecheckt, damit ein frischer
// Checkout ohne vorherigen Codegen-Lauf typecheckt.
const config: CodegenConfig = {
	schema: './schema.graphql',
	documents: ['src/**/*.{ts,svelte}'],
	ignoreNoDocuments: true,
	generates: {
		'./src/lib/gql/': {
			preset: 'client',
			presetConfig: {
				// Kein Fragment-Masking: wir nutzen keine Fragmente und wollen die
				// Felder direkt (ungemaskt) am Ergebnis lesen.
				fragmentMasking: false
			},
			config: {
				useTypeImports: true,
				// Enums als String-Literal-Unions statt TS-`enum`: der Code vergleicht
				// z. B. `field.kind === 'BOOL'` und `severity === 'PROBLEM'` direkt gegen
				// String-Literale.
				enumsAsTypes: true,
				// Der benutzerdefinierte Zeit-Skalar des Backends wird als ISO-String
				// übertragen (siehe $lib/format formatDateTime).
				scalars: { Time: 'string' }
			}
		}
	}
};

export default config;
