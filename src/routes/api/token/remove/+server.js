import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Entfernt den gespeicherten GitLab-Token des angemeldeten Nutzers.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST() {
	return gqlProxy(gql`
		mutation RemoveGitlabToken {
			removeGitlabToken {
				set
				updatedAt
			}
		}
	`);
}
