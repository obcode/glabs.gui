import * as Sentry from '@sentry/sveltekit';
import { env } from '$env/dynamic/public';

/**
 * Browserfehler an GlitchTip melden (Projekt `glabs-gui`).
 *
 * Die DSN landet im Bündel, das jede:r herunterlädt, und ist damit öffentlich. So sind
 * Sentry-DSNs gedacht — sie dürfen ausschließlich schreiben —, aber SvelteKit reicht eine
 * Variable ohne `PUBLIC_`-Präfix trotzdem nicht an den Client durch. Genau diese Weigerung
 * macht die Entscheidung im Namen sichtbar statt in einer Konfigurationsdatei.
 *
 * Leer oder nicht gesetzt heißt: gar keine Meldung. Die Entwicklung braucht also weder einen
 * Collector noch Konfiguration.
 *
 * `SENTRY_*`, nicht `GLITCHTIP_*`: der Collector ist zufällig GlitchTip, das Protokoll und
 * die Variable sind Sentrys — und tallox.gui wie plexams.gui tragen den Namen bereits.
 */
if (env.PUBLIC_SENTRY_DSN) {
	Sentry.init({
		dsn: env.PUBLIC_SENTRY_DSN,
		environment: env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
		// Nur Fehler. GlitchTip liest keine Traces, und jede Span wäre ein weiterer Aufruf
		// aus dem Browser jeder Nutzerin.
		tracesSampleRate: 0,
		// Ausdrücklich gesetzt statt geerbt: bei glabs IST die Kennung die E-Mail-Adresse
		// (siehe hooks.server.ts), sie darf also unter keinen Umständen mitgeschickt werden.
		//
		// ACHTUNG: Breadcrumbs halten weiterhin die besuchten URLs fest. Steht ein
		// generierter Projektpfad (`<assignment>-<student>`) im Pfad, steht er auch im Issue.
		// Der Server-Scrubber in glabs (web/obs/scrub.go) greift hier NICHT — er sitzt im
		// Go-Backend, nicht im Browser.
		sendDefaultPii: false
	});
}

/**
 * Meldet unbehandelte Browserfehler und gibt sie danach an SvelteKit zurück. Ohne DSN ein
 * Durchreicher.
 */
export const handleError = Sentry.handleErrorWithSentry();
