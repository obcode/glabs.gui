import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Importiert einen Kurs aus hochgeladenem YAML-Text. Der Client liest die Datei
 * und schickt den Inhalt als `yaml`. Ein vorhandener Kurs gleichen Namens wird
 * ersetzt. Fehler (z. B. inline `signKey:`, ungültiges YAML) kommen als lesbare
 * Meldung vom Backend zurück.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { yaml } = await request.json();
	return gqlProxy(
		gql`
			mutation ImportCourseYAML($yaml: String!) {
				importCourseYAML(yaml: $yaml) {
					name
				}
			}
		`,
		{ yaml }
	);
}
