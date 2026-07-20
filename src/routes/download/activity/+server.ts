import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { RequestHandler } from './$types';

/**
 * Der vollständige Audit-Verlauf des Nutzers als JSON-Datei zum Download — das
 * Audit-Log-Dump. Dieselben owner-scoped Daten wie die /activity-Seite; hier als
 * herunterladbare Datei mit Content-Disposition.
 */
export const GET: RequestHandler = async () => {
	let entries;
	try {
		const d = await backendRequest(
			graphql(`
				query ActivityLogDump {
					activityLog {
						course
						assignment
						op
						status
						detail
						at
					}
				}
			`)
		);
		entries = d?.activityLog ?? [];
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}

	return new Response(JSON.stringify(entries, null, 2), {
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'content-disposition': 'attachment; filename="glabs-activity.json"'
		}
	});
};
