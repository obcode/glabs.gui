import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Löscht ein Assignment aus einem Kurs des Aufrufers.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { course, name } = await request.json();
	return gqlProxy(
		gql`
			mutation DeleteAssignment($course: String!, $name: String!) {
				deleteAssignment(course: $course, name: $name)
			}
		`,
		{ course, name }
	);
}
