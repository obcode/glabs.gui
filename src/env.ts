import { defineEnvVars } from '@sveltejs/kit/env';

/**
 * Alle Umgebungsvariablen, die die App liest. Seit SvelteKit 3 existiert eine Variable für den
 * Code erst, wenn sie hier deklariert ist: private aus `$app/env/private` (nur Server),
 * öffentliche aus `$app/env/public`.
 *
 * Alle werden beim Start des Prozesses gelesen, nicht zur Buildzeit eingebacken — ein Image
 * läuft in jeder Umgebung. Alle sind optional: nicht gesetzt heißt „nicht konfiguriert", und
 * jede lesende Stelle nennt ihren eigenen Fallback. Das Schema macht nur aus einem leeren
 * String `undefined`, so kommt eine nicht gesetzte Variable aus einer Compose-Datei an.
 */
const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	GLABS_SERVER: {
		description:
			'GraphQL-Endpunkt für den SSR-Prozess, im Deploy der interne Hop am Auth-Proxy vorbei. Nie die öffentliche URL.',
		schema: optional
	},
	SENTRY_DSN: {
		description: 'Wohin serverseitige Fehler gemeldet werden. Nicht gesetzt heißt: keine Meldung.',
		schema: optional
	},
	SENTRY_ENVIRONMENT: {
		description: 'Umgebungsname an serverseitigen Meldungen (Default: production).',
		schema: optional
	},
	PUBLIC_GLABS_SERVER: {
		public: true,
		description:
			'Öffentliche GraphQL-URL, wie der Browser sie sieht (mit OIDC-Cookie); auch Basis der Subscriptions (http→ws).',
		schema: optional
	},
	PUBLIC_GITLAB_HOST: {
		public: true,
		description: 'GitLab-Host für die Token-Anleitung und Links.',
		schema: optional
	},
	PUBLIC_SENTRY_DSN: {
		public: true,
		description:
			'Wohin Browserfehler gemeldet werden. Absichtlich öffentlich: eine DSN darf nur schreiben. Nicht gesetzt heißt: keine Meldung.',
		schema: optional
	},
	PUBLIC_SENTRY_ENVIRONMENT: {
		public: true,
		description: 'Umgebungsname an Browser-Meldungen (Default: production).',
		schema: optional
	}
});
