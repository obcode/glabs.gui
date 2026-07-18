import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Hinterlegt den GitLab-PAT des angemeldeten Nutzers. Der Token wird im Backend
 * AES-256-GCM verschlüsselt gespeichert und nie zurückgegeben. Braucht
 * secrets.key auf dem Server — fehlt er, kommt eine lesbare Fehlermeldung zurück.
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { token } = await request.json();
	return gqlProxy(
		gql`
			mutation SetGitlabToken($token: String!) {
				setGitlabToken(token: $token) {
					set
					updatedAt
				}
			}
		`,
		{ token }
	);
}
