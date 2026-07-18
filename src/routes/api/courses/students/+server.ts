import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Ersetzt die Kurs-Studierenden (das GUI hat vorher additiv gemergt).
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name, students } = await request.json();
	return gqlProxy(
		graphql(`
			mutation SetCourseStudents($name: String!, $students: [String!]!) {
				setCourseStudents(name: $name, students: $students) {
					name
				}
			}
		`),
		{ name, students }
	);
};
