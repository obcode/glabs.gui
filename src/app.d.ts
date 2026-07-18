declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			// Vom Auth-Proxy (Caddy/oauth2-proxy) injizierte Identität; in
			// hooks.server.js aus X-Remote-User gesetzt. Bei glabs ist der
			// remoteUser zugleich die E-Mail-Adresse (OIDC gegen sso.hm.edu).
			remoteUser?: string;
			remoteDisplayname?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	// Von Vite via `define` injizierte GUI-Version (aus semantic-release-Tag).
	const __APP_VERSION__: string;

	// Von Vite via `define` injizierter Build-Zeitpunkt (ISO-8601).
	const __BUILD_TIME__: string;
}

export {};
