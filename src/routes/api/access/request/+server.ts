import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import { forgetAccess } from '$lib/server/accessGate';
import type { RequestHandler } from './$types';

/**
 * Freischaltung anfragen. Wer anfragt, bestimmt allein der X-Remote-User des
 * Requests — nie ein Argument. Danach den gecachten Status vergessen, damit die
 * Seite sofort „Anfrage ist eingegangen" zeigt.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const body = await request.json().catch(() => ({}));
	const reason = typeof body?.reason === 'string' ? body.reason : '';
	const res = await gqlProxy(
		graphql(`
			mutation RequestAccess($reason: String) {
				requestAccess(reason: $reason) {
					access
				}
			}
		`),
		{ reason }
	);
	forgetAccess(locals.remoteUser);
	return res;
};
