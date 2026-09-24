import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Freischaltungen: offene Anfragen und alle Entscheidungen. Ziel des Links in der
 * Admin-Mail (`?user=<email>` hebt die Zeile hervor). Wie /admin schon hier per
 * `me.isAdmin` gesperrt; autoritativ ist das Backend.
 */
export const load: PageServerLoad = async ({ parent, url }) => {
	const { me } = await parent();
	if (!me?.isAdmin) {
		error(403, 'Diese Seite ist nur für Administratoren.');
	}

	try {
		const d = await backendRequest(
			graphql(`
				query AccessEntries {
					accessEntries {
						email
						name
						department
						status
						reason
						requestedAt
						decidedAt
						decidedBy
					}
				}
			`)
		);
		return {
			entries: d?.accessEntries ?? [],
			highlight: (url.searchParams.get('user') ?? '').trim().toLowerCase()
		};
	} catch (e) {
		error(502, gqlErrorMessage(e));
	}
};
