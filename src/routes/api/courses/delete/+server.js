import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Löscht einen Kurs des angemeldeten Nutzers. Owner-Isolation im Backend: es
 * lässt sich nur ein eigener Kurs löschen.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { name } = await request.json();
	return gqlProxy(
		gql`
			mutation DeleteCourse($name: String!) {
				deleteCourse(name: $name)
			}
		`,
		{ name }
	);
}
