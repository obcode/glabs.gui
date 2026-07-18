import { gql } from 'graphql-request';
import { backendRequest } from '$lib/server/backend';

/**
 * Serverseitiger Layout-Load: angemeldete Identität (`me`) und Server-Infos für
 * den Footer. Der Backend-Call reicht via AsyncLocalStorage (siehe
 * hooks.server.js / $lib/server/backend) den X-Remote-User-Header weiter.
 *
 * Beide Blöcke haben einen eigenen try/catch: ein Backend, das down ist oder
 * (lokal/Dev ohne Proxy) kein passendes Ergebnis liefert, soll die Seite nicht
 * mitreißen. `me = null` wird wie „lokal / voller Zugriff" behandelt — es wird
 * dann kein Nutzer-Chip angezeigt.
 *
 * `guiVersion`/`buildTime` sind Vite-`define`-Konstanten (Buildzeit).
 *
 * @type {import('./$types').LayoutServerLoad}
 */
export const load = async () => {
	let me = null;
	try {
		const d = await backendRequest(gql`
			query Me {
				me {
					email
					name
				}
			}
		`);
		me = d?.me ?? null;
	} catch {
		// Backend down oder Kennung nicht freigeschaltet → me bleibt null.
	}

	let serverInfo = null;
	try {
		const d = await backendRequest(gql`
			query ServerInfo {
				serverInfo {
					version
					commit
					date
				}
			}
		`);
		serverInfo = d?.serverInfo ?? null;
	} catch {
		// Älteres/abwesendes Backend → Footer zeigt nur die GUI-Version.
	}

	return {
		me,
		serverInfo,
		guiVersion: __APP_VERSION__,
		buildTime: __BUILD_TIME__
	};
};
