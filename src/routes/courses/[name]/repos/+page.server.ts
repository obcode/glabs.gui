import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Übersicht der tatsächlich generierten Repos pro Assignment. Fragt GitLab
 * serverseitig ab (ein Gruppen-Listing pro Assignment) — kann ein paar Sekunden
 * dauern und braucht einen hinterlegten GitLab-Token; ein Fehler (z. B. kein Token)
 * wird als `error` durchgereicht statt die Seite scheitern zu lassen.
 */
export const load: PageServerLoad = async ({ params }) => {
	const course = params.name;
	try {
		const d = await backendRequest(
			graphql(`
				query CourseRepoOverview($course: String!) {
					courseRepoOverview(course: $course) {
						name
						per
						targets
						existing
						note
						repos {
							for
							url
							exists
						}
					}
				}
			`),
			{ course }
		);
		return { course, overview: d?.courseRepoOverview ?? [], error: null as string | null };
	} catch (e) {
		return { course, overview: null, error: gqlErrorMessage(e) };
	}
};
