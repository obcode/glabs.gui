import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Importiert ein einzelnes Assignment aus einem YAML-Schnipsel (mit dem
 * Assignment-Namen als oberstem Schlüssel) in einen bestehenden Kurs (Upsert).
 */
export const POST: RequestHandler = async ({ request }) => {
	const { course, yaml } = await request.json();
	return gqlProxy(
		graphql(`
			mutation ImportAssignmentYAML($course: String!, $yaml: String!) {
				importAssignmentYAML(course: $course, yaml: $yaml) {
					name
				}
			}
		`),
		{ course, yaml }
	);
};
