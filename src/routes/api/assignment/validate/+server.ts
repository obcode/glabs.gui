import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Validiert einen Assignment-Entwurf über den echten Resolver (glabs-web), ohne
 * zu speichern — für die Live-Vorschau und die Server-Validierung im Editor.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { course, name, draft } = await request.json();
	return gqlProxy(
		graphql(`
			query ValidateAssignmentDraft($course: String!, $name: String!, $draft: [FieldValueInput!]!) {
				validateAssignmentDraft(course: $course, name: $name, draft: $draft) {
					ok
					errors
					resolved
					resolveError
				}
			}
		`),
		{ course, name, draft }
	);
};
