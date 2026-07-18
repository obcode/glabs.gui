import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Validiert einen Assignment-Entwurf über den echten Resolver (glabs-web), ohne
 * zu speichern — für die Live-Vorschau und die Server-Validierung im Editor.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { course, name, draft } = await request.json();
	return gqlProxy(
		gql`
			query ValidateAssignmentDraft($course: String!, $name: String!, $draft: [FieldValueInput!]!) {
				validateAssignmentDraft(course: $course, name: $name, draft: $draft) {
					ok
					errors
					resolved
					resolveError
				}
			}
		`,
		{ course, name, draft }
	);
}
