import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Ersetzt die Kurs-Gruppen (das GUI hat vorher additiv gemergt).
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { name, groups } = await request.json();
	return gqlProxy(
		gql`
			mutation SetCourseGroups($name: String!, $groups: [GroupInput!]!) {
				setCourseGroups(name: $name, groups: $groups) {
					name
				}
			}
		`,
		{ name, groups }
	);
}
