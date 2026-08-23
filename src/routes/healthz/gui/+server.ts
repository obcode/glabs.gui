import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Lebenszeichen des SSR-Node-Prozesses.
 *
 * Warum es das braucht, obwohl `/healthz` schon existiert: das ist glabs-web, also das
 * Backend. Die Oberfläche läuft in einem eigenen Container, und ein hängender SvelteKit-Prozess
 * hinter einem gesunden Caddy sieht von außen genauso aus wie ein gesunder — eine Anfrage auf
 * `/` beantwortet oauth2-proxy mit einer Umleitung zur Anmeldung, ohne den Container je zu
 * fragen. Diese Route ist der einzige Weg, an dem sich „die GUI antwortet" von „die Haustür
 * antwortet" unterscheiden lässt.
 *
 * Der Pfad ist `/healthz/gui` und nicht `/healthz`: letzteres gehört dem Backend, und die
 * Caddy-Pfadprüfung ist exakt, die beiden kommen sich also nicht ins Gehege.
 *
 * Bewusst ohne jede Prüfung von Identität oder Backend-Erreichbarkeit. Das hier beantwortet
 * genau eine Frage — läuft dieser Prozess und welcher Build ist es —, und es muss sie auch
 * dann beantworten, wenn glabs-web oder MongoDB weg sind. Deren Ausfall meldet der jeweils
 * eigene Wächter; ein Lebenszeichen, das von fremden Diensten abhängt, meldet fremde Ausfälle
 * als eigene.
 */
export const GET: RequestHandler = () =>
	json(
		{ status: 'ok', version: __APP_VERSION__, built: __BUILD_TIME__ },
		// Ein zwischengespeichertes Lebenszeichen ist eine Lüge mit Verfallsdatum.
		{ headers: { 'Cache-Control': 'no-store' } }
	);
