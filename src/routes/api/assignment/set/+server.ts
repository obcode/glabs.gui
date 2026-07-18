import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Persistiert einen Assignment-Entwurf (glabs-web validiert erneut und lehnt
 * einen nicht-auflösbaren konkreten Entwurf ab).
 */
export const POST: RequestHandler = async ({ request }) => {
	const { course, name, draft } = await request.json();
	return gqlProxy(
		graphql(`
			mutation SetAssignment($course: String!, $name: String!, $draft: [FieldValueInput!]!) {
				setAssignment(course: $course, name: $name, draft: $draft) {
					course
					name
					extends
					abstract
					own {
						key
						value
					}
					resolved
					resolveError
				}
			}
		`),
		{ course, name, draft }
	);
};
