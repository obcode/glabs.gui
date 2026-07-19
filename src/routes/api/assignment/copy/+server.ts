import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Kopiert ein Assignment eines Kurses des Aufrufers unter einem neuen Namen.
 * Nur der Name muss eindeutig sein; die Kopie ist ansonsten identisch.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { course, from, newName } = await request.json();
	return gqlProxy(
		graphql(`
			mutation CopyAssignment($course: String!, $from: String!, $newName: String!) {
				copyAssignment(course: $course, from: $from, newName: $newName) {
					name
				}
			}
		`),
		{ course, from, newName }
	);
};
