import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Hinterlegt den GitLab-PAT des angemeldeten Nutzers. Der Token wird im Backend
 * AES-256-GCM verschlüsselt gespeichert und nie zurückgegeben. Braucht
 * secrets.key auf dem Server — fehlt er, kommt eine lesbare Fehlermeldung zurück.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { token } = await request.json();
	return gqlProxy(
		graphql(`
			mutation SetGitlabToken($token: String!) {
				setGitlabToken(token: $token) {
					set
					updatedAt
				}
			}
		`),
		{ token }
	);
};
