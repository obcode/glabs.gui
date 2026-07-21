import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Plattformweite Admin-Übersicht: der aggregierte Digest (dieselbe Sicht wie die
 * nächtliche Mail) plus der Live-Event-Feed. Beide Backend-Queries sind
 * admin-gated; das Backend ist autoritativ. Zusätzlich sperren wir hier schon per
 * `me.isAdmin` (aus dem Layout-Load), damit Nicht-Admins gar keinen Backend-Call
 * auslösen und sofort 403 sehen.
 */
export const load: PageServerLoad = async ({ parent }) => {
	const { me } = await parent();
	if (!me?.isAdmin) {
		throw error(403, 'Diese Seite ist nur für Administratoren.');
	}

	try {
		const d = await backendRequest(
			graphql(`
				query AdminOverview {
					platformSummary {
						from
						until
						totalEvents
						quiet
						activeUsers {
							email
							name
							department
							logins
						}
						rejectedLogins {
							email
							department
							count
						}
						scheduledJobs {
							at
							op
							course
							assignment
							detail
						}
						jobsRun
						jobDone
						jobFailed
						jobExpired
						jobCancelled
						jobFailures {
							at
							op
							course
							assignment
							detail
						}
						opDone
						opFailed
						opsByType {
							label
							count
						}
						opFailures {
							at
							op
							course
							assignment
							detail
						}
						courseCreated
						courseDeleted
						tokenSaved
						tokenDeleted
						problems {
							at
							type
							severity
							actor
							course
							assignment
							op
							detail
						}
					}
					platformEvents {
						at
						type
						severity
						actor
						actorName
						department
						course
						assignment
						op
						detail
					}
				}
			`)
		);
		return { summary: d?.platformSummary ?? null, events: d?.platformEvents ?? [] };
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}
};
