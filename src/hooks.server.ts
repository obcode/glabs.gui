import type { Handle } from '@sveltejs/kit';
import { authContext } from '$lib/server/backend';

export const handle: Handle = async ({ event, resolve }) => {
	// Vom Auth-Proxy (oauth2-proxy hinter Caddy) autoritativ injizierte Identität.
	// Wird als AsyncLocalStorage-Kontext gesetzt, damit jeder serverseitige
	// GraphQL-Call (SSR-load()s, spätere /api-Proxys) sie als X-Remote-User an
	// glabs-web weiterreicht — siehe $lib/server/backend. Bei glabs ist die
	// Kennung zugleich die E-Mail-Adresse.
	//
	// Es gibt keinen Zugangs-Riegel mehr: glabs-web hat keine Allowlist, jede vom
	// Proxy authentifizierte Kennung (auf hm.edu eingeschränkt) ist zugelassen und
	// arbeitet strikt als eigener Nutzer. Der Proxy ist die Zugangsgrenze.
	const remoteUser = event.request.headers.get('x-remote-user') || undefined;
	const remoteDisplayname = event.request.headers.get('x-remote-displayname') || undefined;
	event.locals.remoteUser = remoteUser;
	event.locals.remoteDisplayname = remoteDisplayname;

	return authContext.run({ remoteUser, remoteDisplayname }, () => resolve(event));
};
