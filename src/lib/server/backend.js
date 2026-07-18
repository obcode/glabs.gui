import { AsyncLocalStorage } from 'node:async_hooks';
import { GraphQLClient } from 'graphql-request';
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
// Identität pro Request in einem AsyncLocalStorage abgelegt (in hooks.server.js
// rund um resolve()) und hier beim Client-Bau ausgelesen.
//
// Zwei URLs (die SSR-Identity-Falle, siehe CLAUDE.md): GLABS_SERVER ist der
// interne Hop (umgeht den Proxy), PUBLIC_GLABS_SERVER wäre die öffentliche URL
// fürs Browser. Serverseitig nutzen wir immer GLABS_SERVER.

/** @typedef {{ remoteUser?: string, remoteDisplayname?: string }} AuthContext */

/** @type {AsyncLocalStorage<AuthContext>} */
export const authContext = new AsyncLocalStorage();

/**
 * GraphQLClient gegen glabs-web, der die aktuelle Identität (aus dem
 * AsyncLocalStorage, sonst aus einem explizit übergebenen Kontext) als
 * X-Remote-User weiterreicht.
 *
 * @param {AuthContext} [ctx] expliziter Kontext (Fallback: laufender Request)
 */
export function backendClient(ctx) {
	const { remoteUser, remoteDisplayname } = ctx ?? authContext.getStore() ?? {};
	/** @type {Record<string, string>} */
	const headers = {};
	if (remoteUser) headers['X-Remote-User'] = remoteUser;
	if (remoteDisplayname) headers['X-Remote-Displayname'] = remoteDisplayname;
	return new GraphQLClient(env.GLABS_SERVER, { headers });
}

/**
 * Kurzform für Einzel-Requests. Generisch: ohne Typargument fällt T auf `any`
 * zurück (aus einem String-Dokument ist T nicht ableitbar).
 *
 * @template {any} [T=any]
 * @param {import('graphql-request').RequestDocument} document Query/Mutation
 * @param {Record<string, any>} [variables]
 * @returns {Promise<T>}
 */
export function backendRequest(document, variables) {
	return /** @type {Promise<T>} */ (backendClient().request(document, variables));
}
