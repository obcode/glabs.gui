import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Löscht einen Kurs des angemeldeten Nutzers. Owner-Isolation im Backend: es
 * lässt sich nur ein eigener Kurs löschen.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();
	return gqlProxy(
		graphql(`
			mutation DeleteCourse($name: String!) {
				deleteCourse(name: $name)
			}
		`),
		{ name }
	);
};
