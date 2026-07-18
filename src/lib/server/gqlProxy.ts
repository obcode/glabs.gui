import { json } from '@sveltejs/kit';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { gqlErrorMessage } from '$lib/gqlError';
import { backendRequest } from '$lib/server/backend';

// Serverseitiger Helfer für die /api-Proxy-Endpunkte: führt eine GraphQL-
// Operation gegen glabs-web ($GLABS_SERVER) aus und verpackt das Ergebnis als
// JSON — mit einheitlichem Fehler-Handling (HTTP 400 + lesbare Meldung aus
// gqlErrorMessage).
//
//   import { graphql } from '$lib/gql';
//   export async function POST({ request }) {
//     const { yaml } = await request.json();
//     return gqlProxy(
//       graphql(`mutation ImportCourseYAML($yaml: String!){ importCourseYAML(yaml: $yaml){ name } }`),
//       { yaml }
//     );
//   }

/**
 * Führt eine getippte GraphQL-Operation aus und liefert das Ergebnis als
 * JSON-Response (bei Fehlern `{ error }` mit HTTP 400).
 */
export async function gqlProxy<TData, TVars>(
	document: TypedDocumentNode<TData, TVars>,
	...args: TVars extends Record<string, never> ? [variables?: TVars] : [variables: TVars]
): Promise<Response> {
	try {
		const data = await backendRequest(document, ...args);
		return json(data);
	} catch (e) {
		return json({ error: gqlErrorMessage(e) }, { status: 400 });
	}
}
