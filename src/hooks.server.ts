import { json, redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/private';
import { authContext } from '$lib/server/backend';
import { ACCESS_PAGE, accessOf, gateDecision, isOpenPath } from '$lib/server/accessGate';

/**
 * Fehler des SSR-Node-Prozesses an GlitchTip melden (Projekt `glabs-gui`, dasselbe wie im
 * Browser — beide Hälften sind dieselbe Anwendung).
 *
 * Diese DSN bleibt im Container, anders als die des Browsers: kein `PUBLIC_`-Präfix, also
 * kompiliert SvelteKit sie nicht ins Bündel. Leer heißt: diese Hälfte meldet nicht.
 *
 * Ein eigenes Projekt und nicht das von glabs-web: ein Go-Fehler und ein Browserfehler
 * gehören nicht in dieselbe Liste.
 */
const reporting = !!env.SENTRY_DSN;
if (reporting) {
	Sentry.init({
		dsn: env.SENTRY_DSN,
		environment: env.SENTRY_ENVIRONMENT || 'production',
		// Nur Fehler — GlitchTip liest keine Traces.
		tracesSampleRate: 0,
		// Zwingend: unten wird X-Remote-User gelesen, und das IST bei glabs die
		// E-Mail-Adresse der angemeldeten Person.
		sendDefaultPii: false
	});
}

/** Meldet Fehler aus SSR-load()s und /api-Handlern. Ohne DSN ein Durchreicher. */
export const handleError = Sentry.handleErrorWithSentry();

const guiHandle: Handle = async ({ event, resolve }) => {
	// Vom Auth-Proxy (oauth2-proxy hinter Caddy) autoritativ injizierte Identität.
	// Wird als AsyncLocalStorage-Kontext gesetzt, damit jeder serverseitige
	// GraphQL-Call (SSR-load()s, spätere /api-Proxys) sie als X-Remote-User an
	// glabs-web weiterreicht — siehe $lib/server/backend. Bei glabs ist die
	// Kennung zugleich die E-Mail-Adresse.
	//
	// Angemeldet heißt nicht freigeschaltet: Wer nicht freigeschaltet ist, landet auf
	// /zugang und kann dort die Freischaltung anfragen (siehe $lib/server/accessGate).
	// Der Riegel hier ist nur Führung — gesperrt wird im Backend.
	const remoteUser = event.request.headers.get('x-remote-user') || undefined;
	const remoteDisplayname = event.request.headers.get('x-remote-displayname') || undefined;
	event.locals.remoteUser = remoteUser;
	event.locals.remoteDisplayname = remoteDisplayname;

	return authContext.run({ remoteUser, remoteDisplayname }, async () => {
		const { pathname } = event.url;
		// Offene Pfade fragen das Backend gar nicht erst (v. a. /healthz/gui).
		if (!isOpenPath(pathname)) {
			const decision = gateDecision(pathname, await accessOf(remoteUser));
			if (decision === 'deny') {
				return json(
					{ error: 'Nicht freigeschaltet — bitte zuerst die Freischaltung anfragen.' },
					{ status: 403 }
				);
			}
			if (decision === 'redirect') redirect(303, ACCESS_PAGE);
		}
		return resolve(event);
	});
};

/**
 * `sentryHandle()` hängt die Anfrage — URL, Methode, Header — an alles, was darin scheitert;
 * ohne das trägt ein Issue eine Meldung und keine Umstände.
 *
 * Ohne DSN ganz weggelassen statt wirkungslos eingehängt: es schreibt Trace-Meta-Tags in jede
 * ausgelieferte Seite, und das wäre Aufwand ohne Leser.
 */
export const handle: Handle = reporting ? sequence(Sentry.sentryHandle(), guiHandle) : guiHandle;
