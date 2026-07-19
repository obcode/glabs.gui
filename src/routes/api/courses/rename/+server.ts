import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Benennt einen Kurs des Aufrufers um. Der Kursname ist der Top-Level-YAML-Key,
 * das Backend re-encodiert die Rohbytes.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { oldName, newName } = await request.json();
	return gqlProxy(
		graphql(`
			mutation RenameCourse($oldName: String!, $newName: String!) {
				renameCourse(oldName: $oldName, newName: $newName) {
					name
				}
			}
		`),
		{ oldName, newName }
	);
};
