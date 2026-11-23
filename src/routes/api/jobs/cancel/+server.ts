import { graphql } from '#lib/gql/index.ts';
import { gqlProxy } from '#lib/server/gqlProxy.ts';
import type { RequestHandler } from './$types';

/**
 * Bricht einen ausstehenden (PENDING) Job des Aufrufers ab.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { id } = await request.json();
	return gqlProxy(
		graphql(`
			mutation CancelScheduledJob($id: ID!) {
				cancelScheduledJob(id: $id) {
					id
					status
				}
			}
		`),
		{ id }
	);
};
