import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Persistiert einen Assignment-Entwurf (glabs-web validiert erneut und lehnt
 * einen nicht-auflösbaren konkreten Entwurf ab).
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { course, name, draft } = await request.json();
	return gqlProxy(
		gql`
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
		`,
		{ course, name, draft }
	);
}
