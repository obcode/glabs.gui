import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Importiert einen Kurs aus hochgeladenem YAML-Text. Der Client liest die Datei
 * und schickt den Inhalt als `yaml`. Ein vorhandener Kurs gleichen Namens wird
 * ersetzt. Fehler (z. B. inline `signKey:`, ungültiges YAML) kommen als lesbare
 * Meldung vom Backend zurück.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { yaml } = await request.json();
	return gqlProxy(
		graphql(`
			mutation ImportCourseYAML($yaml: String!) {
				importCourseYAML(yaml: $yaml) {
					name
				}
			}
		`),
		{ yaml }
	);
};
