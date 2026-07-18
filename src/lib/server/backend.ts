import { AsyncLocalStorage } from 'node:async_hooks';
import { GraphQLClient } from 'graphql-request';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { env } from '$env/dynamic/private';

// Identitäts-Weiterreichung an glabs-web (Auth-Modell: reiner Proxy-Header).
//
// In Produktion läuft glabs-web mit auth.enabled: true und lernt die angemeldete
// Identität ausschließlich aus dem X-Remote-User-Header (Inhalt = verifizierte
// OIDC-E-Mail), den der Auth-Proxy (oauth2-proxy hinter Caddy) autoritativ in
// jeden Request injiziert. Der SSR-Hop des GUI läuft aber Container-zu-Container
// (GLABS_SERVER = http://glabs:8080/query) am Proxy vorbei — ohne diesen Header
// weist glabs-web fail-closed mit 401 ab. Deshalb muss jeder serverseitige
// GraphQL-Call den Header selbst mitschicken.
//
// Statt `locals` durch alle load()/Handler-Signaturen zu fädeln, wird die
// Identität pro Request in einem AsyncLocalStorage abgelegt (in hooks.server.ts
// rund um resolve()) und hier beim Client-Bau ausgelesen.
//
// Zwei URLs (die SSR-Identity-Falle, siehe CLAUDE.md): GLABS_SERVER ist der
// interne Hop (umgeht den Proxy), PUBLIC_GLABS_SERVER wäre die öffentliche URL
// fürs Browser. Serverseitig nutzen wir immer GLABS_SERVER.

export interface AuthContext {
	remoteUser?: string;
	remoteDisplayname?: string;
}

export const authContext = new AsyncLocalStorage<AuthContext>();

/**
 * GraphQLClient gegen glabs-web, der die aktuelle Identität (aus dem
 * AsyncLocalStorage, sonst aus einem explizit übergebenen Kontext) als
 * X-Remote-User weiterreicht.
 *
 * @param ctx expliziter Kontext (Fallback: laufender Request)
 */
export function backendClient(ctx?: AuthContext): GraphQLClient {
	const url = env.GLABS_SERVER;
	// Fail-fast bei Fehlkonfiguration (narrowt zugleich `string | undefined` →
	// `string`). Der Wurf wird von den Aufrufern gefangen: im Layout → me/
	// serverInfo = null, im Zugangs-Riegel → kein `.response` → nicht aussperren.
	if (!url) throw new Error('GLABS_SERVER is not set — cannot reach glabs-web');

	const { remoteUser, remoteDisplayname } = ctx ?? authContext.getStore() ?? {};
	const headers: Record<string, string> = {};
	if (remoteUser) headers['X-Remote-User'] = remoteUser;
	if (remoteDisplayname) headers['X-Remote-Displayname'] = remoteDisplayname;
	return new GraphQLClient(url, { headers });
}

/**
 * Kurzform für Einzel-Requests. Das getippte Dokument (aus `graphql(...)`,
 * $lib/gql) trägt Ergebnis- und Variablentyp, daher ist der Rückgabewert
 * vollständig typisiert. Operationen ohne Variablen dürfen das zweite Argument
 * weglassen, Operationen mit Variablen müssen es setzen.
 */
export function backendRequest<TData, TVars>(
	document: TypedDocumentNode<TData, TVars>,
	...[variables]: TVars extends Record<string, never> ? [variables?: TVars] : [variables: TVars]
): Promise<TData> {
	// graphql-request's variadische Überladungen vertragen sich schlecht mit einem
	// generischen Wrapper; die Typparameter des Dokuments geben den Aufrufern
	// bereits volle Typisierung, daher wird der Client-Call gecastet.
	return (backendClient().request as (d: unknown, v?: unknown) => Promise<TData>)(
		document,
		variables
	);
}
