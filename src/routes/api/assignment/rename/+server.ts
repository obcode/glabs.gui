import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Benennt ein Assignment eines Kurses des Aufrufers um. Geschwister, die per
 * `extends` erben, werden serverseitig auf den neuen Namen umgebogen.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { course, oldName, newName } = await request.json();
	return gqlProxy(
		graphql(`
			mutation RenameAssignment($course: String!, $oldName: String!, $newName: String!) {
				renameAssignment(course: $course, oldName: $oldName, newName: $newName) {
					name
				}
			}
		`),
		{ course, oldName, newName }
	);
};
