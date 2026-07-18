import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Ersetzt die Kurs-Gruppen (das GUI hat vorher additiv gemergt).
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name, groups } = await request.json();
	return gqlProxy(
		graphql(`
			mutation SetCourseGroups($name: String!, $groups: [GroupInput!]!) {
				setCourseGroups(name: $name, groups: $groups) {
					name
				}
			}
		`),
		{ name, groups }
	);
};
