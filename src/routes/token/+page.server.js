import { gql } from 'graphql-request';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';

/**
 * Status des hinterlegten GitLab-Tokens (SSR). Der Token selbst wird vom Backend
 * nie zurückgegeben — nur ob einer gesetzt ist und wann zuletzt.
 *
 * @type {import('./$types').PageServerLoad}
 */
export const load = async () => {
	try {
		const d = await backendRequest(gql`
			query GitlabToken {
				gitlabToken {
					set
					updatedAt
				}
			}
		`);
		return { status: d?.gitlabToken ?? { set: false, updatedAt: null }, error: null };
	} catch (e) {
		return { status: { set: false, updatedAt: null }, error: gqlErrorMessage(e) };
	}
};
