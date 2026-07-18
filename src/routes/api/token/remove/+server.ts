import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Entfernt den gespeicherten GitLab-Token des angemeldeten Nutzers.
 */
export const POST: RequestHandler = async () => {
	return gqlProxy(
		graphql(`
			mutation RemoveGitlabToken {
				removeGitlabToken {
					set
					updatedAt
				}
			}
		`)
	);
};
