import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Löscht ein Assignment aus einem Kurs des Aufrufers.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { course, name } = await request.json();
	return gqlProxy(
		graphql(`
			mutation DeleteAssignment($course: String!, $name: String!) {
				deleteAssignment(course: $course, name: $name)
			}
		`),
		{ course, name }
	);
};
