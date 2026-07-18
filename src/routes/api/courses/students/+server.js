import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Ersetzt die Kurs-Studierenden (das GUI hat vorher additiv gemergt).
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { name, students } = await request.json();
	return gqlProxy(
		gql`
			mutation SetCourseStudents($name: String!, $students: [String!]!) {
				setCourseStudents(name: $name, students: $students) {
					name
				}
			}
		`,
		{ name, students }
	);
}
