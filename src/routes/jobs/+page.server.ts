import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Die geplanten Jobs des angemeldeten Nutzers (neueste zuerst), über alle Kurse.
 */
export const load: PageServerLoad = async () => {
	try {
		const d = await backendRequest(
			graphql(`
				query ScheduledJobs {
					scheduledJobs {
						id
						op
						course
						assignment
						runAt
						graceMinutes
						status
						createdAt
						startedAt
						finishedAt
						err
						params {
							key
							value
						}
					}
				}
			`)
		);
		return { jobs: d?.scheduledJobs ?? [] };
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}
};
