import { json } from '@sveltejs/kit';
import { gqlErrorMessage } from '$lib/gqlError';
import { backendRequest } from '$lib/server/backend';

// Serverseitiger Helfer für die /api-Proxy-Endpunkte: führt eine GraphQL-
// Operation gegen glabs-web ($GLABS_SERVER) aus und verpackt das Ergebnis als
// JSON — mit einheitlichem Fehler-Handling (HTTP 400 + lesbare Meldung aus
// gqlErrorMessage).
//
//   export async function POST({ request }) {
//     const { yaml } = await request.json();
//     return gqlProxy(gql`mutation($y: String!){ importCourseYAML(yaml: $y){ name } }`,
//       { y: yaml });
//   }

/**
 * @param {import('graphql-request').RequestDocument} document Query/Mutation
 * @param {Record<string, any>} [variables]
 * @returns {Promise<Response>} JSON-Response (Daten oder `{ error }` mit 400)
 */
export async function gqlProxy(document, variables) {
	try {
		const data = await backendRequest(document, variables);
		return json(data);
	} catch (e) {
		return json({ error: gqlErrorMessage(e) }, { status: 400 });
	}
}
