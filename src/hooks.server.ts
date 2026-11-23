import { redirect } from '@sveltejs/kit';
import { sequence, type Handle, type HandleServerError } from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { SENTRY_DSN, SENTRY_ENVIRONMENT } from '$app/env/private';
import { authContext } from '#lib/server/backend.ts';
import { ACCESS_PAGE, accessOf, gateDecision, isOpenPath } from '#lib/server/accessGate.ts';
import { PREVIEW_COOKIE } from '#lib/server/preview.ts';
import { DATA_COLLECTION, scrubBreadcrumb, scrubEvent } from '#lib/sentryScrub.ts';

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
const reporting = !!SENTRY_DSN;
if (reporting) {
	Sentry.init({
		dsn: SENTRY_DSN,
		environment: SENTRY_ENVIRONMENT || 'production',
		// Ordnet jedes Issue dem Build zu, aus dem es kam.
		release: __APP_VERSION__,
		// Nur Fehler — GlitchTip liest keine Traces.
		tracesSampleRate: 0,
		// Zwingend: unten wird X-Remote-User gelesen, und das IST bei glabs die
		// E-Mail-Adresse der angemeldeten Person. /api/token/set trägt den GitLab-PAT im Body
		// und reicht ihn als GraphQL-Variable weiter. Sentry 11 sammelt ohne diese Option
		// Header, Cookies, Bodies, GraphQL-Variablen und Frame-Variablen ein — siehe
		// DATA_COLLECTION.
		dataCollection: DATA_COLLECTION,
		// Die zweite Linie, falls doch etwas angehängt wird: nur harmlose Header, keine
		// Query-Strings, keine Token oder Adressen in Texten. Siehe #lib/sentryScrub.
		beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
		beforeSend: (event) => scrubEvent(event)
	});
}

const reportError = Sentry.handleErrorWithSentry<HandleServerError>();

/**
 * Meldet Fehler aus SSR-load()s und /api-Handlern. Ohne DSN ein Durchreicher.
 *
 * Seit SvelteKit 3 läuft hier jeder Fehler durch, auch die mit `error()` geworfenen (etwa
 * `error(502, …)`, wenn glabs-web eine Anfrage ablehnt) und SvelteKits eigene 404s. Das sind
 * Antworten, keine Ausfälle: sie behalten Status und Meldung und werden nicht gemeldet — wie
 * unter SvelteKit 2. Nur `unknown` ist, wofür dieser Hook da ist.
 */
export const handleError: HandleServerError = (input) => {
	if (input.kind !== 'unknown') return;
	return reportError(input);
};

const guiHandle: Handle = async ({ event, resolve }) => {
	// Vom Auth-Proxy (oauth2-proxy hinter Caddy) autoritativ injizierte Identität.
	// Wird als AsyncLocalStorage-Kontext gesetzt, damit jeder serverseitige
	// GraphQL-Call (SSR-load()s, spätere /api-Proxys) sie als X-Remote-User an
	// glabs-web weiterreicht — siehe #lib/server/backend. Bei glabs ist die
	// Kennung zugleich die E-Mail-Adresse.
	//
	// Angemeldet heißt nicht freigeschaltet: Wer nicht freigeschaltet ist, landet auf
	// /zugang und kann dort die Freischaltung anfragen (siehe #lib/server/accessGate).
	// Der Riegel hier ist nur Führung — gesperrt wird im Backend.
	const remoteUser = event.request.headers.get('x-remote-user') || undefined;
	const remoteDisplayname = event.request.headers.get('x-remote-displayname') || undefined;
	event.locals.remoteUser = remoteUser;
	event.locals.remoteDisplayname = remoteDisplayname;
	// Nur Rechte weg, nie dazu: der Cookie kann also von jedem gesetzt werden,
	// ohne dass es etwas öffnet (siehe #lib/server/preview).
	const preview = event.cookies.get(PREVIEW_COOKIE) === '1';
	event.locals.preview = preview;

	return authContext.run({ remoteUser, remoteDisplayname, preview }, async () => {
		const { pathname } = event.url;
		// Offene Pfade fragen das Backend gar nicht erst (v. a. /healthz/gui).
		if (!isOpenPath(pathname)) {
			const decision = gateDecision(pathname, await accessOf(remoteUser, preview));
			if (decision === 'deny') {
				return Response.json(
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
 * `sentryHandle()` hängt die Anfrage — URL und Methode; Header, Cookies und Query-String nimmt
 * `dataCollection` wieder heraus — an alles, was darin scheitert; ohne das trägt ein Issue eine
 * Meldung und keine Umstände.
 *
 * Ohne DSN ganz weggelassen statt wirkungslos eingehängt: es schreibt Trace-Meta-Tags in jede
 * ausgelieferte Seite, und das wäre Aufwand ohne Leser.
 */
export const handle: Handle = reporting ? sequence(Sentry.sentryHandle(), guiHandle) : guiHandle;
