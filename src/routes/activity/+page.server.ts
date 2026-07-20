import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Der vollständige Audit-Verlauf des angemeldeten Nutzers über alle Kurse
 * (owner-scoped im Backend), neueste zuerst. Der JSON-Download derselben Daten
 * liegt unter /download/activity.
 */
export const load: PageServerLoad = async () => {
	try {
		const d = await backendRequest(
			graphql(`
				query ActivityLog {
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
		return { entries: d?.activityLog ?? [] };
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}
};
