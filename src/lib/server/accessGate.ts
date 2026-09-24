import { graphql } from '$lib/gql';
import type { AccessStatus } from '$lib/gql/graphql';
import { backendRequest } from '$lib/server/backend';

// Zugangs-Riegel der GUI. Er ist reine Führung: glabs-web lässt Nicht-Freigeschaltete
// ohnehin nur an `me`, `serverInfo` und `requestAccess` (access_gate.go im Backend).
// Hier geht es darum, dass diese Personen statt lauter Fehlerseiten die Seite
// „Freischaltung anfragen" sehen.

/** Pfad der Anfrage-Seite. */
export const ACCESS_PAGE = '/zugang';

/**
 * Pfade, die auch ohne Freischaltung erreichbar sein müssen: die Anfrage-Seite
 * selbst, ihr API-Endpunkt, der Health-Check (kein Backend-Call!) und die
 * statischen Bündel.
 */
export function isOpenPath(pathname: string): boolean {
	return (
		pathname === ACCESS_PAGE ||
		pathname === '/api/access/request' ||
		pathname === '/healthz/gui' ||
		pathname.startsWith('/_app/') ||
		pathname === '/favicon.ico' ||
		pathname === '/favicon.png'
	);
}

export type GateDecision = 'allow' | 'redirect' | 'deny';

/**
 * Was mit einer Anfrage passiert. `access = null` heißt „unbekannt" (Backend nicht
 * erreichbar) — dann wird durchgelassen: ein kurz fehlendes Backend darf niemanden
 * aussperren, und sperren würde das Backend ohnehin selbst.
 */
export function gateDecision(pathname: string, access: AccessStatus | null): GateDecision {
	if (access === null || access === 'APPROVED' || isOpenPath(pathname)) return 'allow';
	return pathname.startsWith('/api/') ? 'deny' : 'redirect';
}

const TTL_MS = 30_000;
const cache = new Map<string, { access: AccessStatus | null; expires: number }>();

/**
 * Zugangsstatus der aktuellen Kennung (aus dem AsyncLocalStorage), ~30 s pro
 * Kennung gecacht. Anders als früher ein Map statt eines einzelnen Eintrags: der
 * GUI-Server bedient alle Nutzer, ein Slot würde bei zwei gleichzeitigen ständig
 * überschrieben.
 */
export async function accessOf(remoteUser: string | undefined): Promise<AccessStatus | null> {
	const key = cacheKey(remoteUser);
	const now = Date.now();
	const hit = cache.get(key);
	if (hit && now < hit.expires) return hit.access;

	let access: AccessStatus | null;
	try {
		const d = await backendRequest(
			graphql(`
				query AccessGate {
					me {
						access
					}
				}
			`)
		);
		access = d?.me?.access ?? null;
	} catch {
		access = null;
	}
	// Abgelaufene Einträge nebenbei wegräumen, damit das Map nicht wächst.
	for (const [k, v] of cache) if (now >= v.expires) cache.delete(k);
	// „Unbekannt" nicht cachen: beim nächsten Request neu fragen.
	if (access !== null) cache.set(key, { access, expires: now + TTL_MS });
	return access;
}

/** Nach einer Anfrage oder Entscheidung: den Status dieser Kennung neu holen. */
export function forgetAccess(remoteUser: string | undefined) {
	cache.delete(cacheKey(remoteUser));
}

/** Wie das Backend: Groß-/Kleinschreibung und Leerraum zählen nicht. */
function cacheKey(remoteUser: string | undefined): string {
	return (remoteUser ?? '').trim().toLowerCase();
}
