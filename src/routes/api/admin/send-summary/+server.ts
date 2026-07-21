import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Löst die nächtliche Zusammenfassung sofort aus (letzte 24h) — der
 * „Jetzt senden"-Button auf der Admin-Seite. Admin-gated im Backend.
 */
export const POST: RequestHandler = async () => {
	return gqlProxy(
		graphql(`
			mutation SendSummaryNow {
				sendSummaryNow
			}
		`)
	);
};
