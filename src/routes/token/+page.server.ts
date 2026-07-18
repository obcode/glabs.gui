import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Status des hinterlegten GitLab-Tokens (SSR). Der Token selbst wird vom Backend
 * nie zurückgegeben — nur ob einer gesetzt ist und wann zuletzt.
 */
export const load: PageServerLoad = async () => {
	try {
		const d = await backendRequest(
			graphql(`
				query GitlabToken {
					gitlabToken {
						set
						updatedAt
					}
				}
			`)
		);
		return { status: d?.gitlabToken ?? { set: false, updatedAt: null }, error: null };
	} catch (e) {
		return { status: { set: false, updatedAt: null }, error: gqlErrorMessage(e) };
	}
};
