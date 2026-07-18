import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Die Kurse des angemeldeten Nutzers (SSR). Owner-Isolation ist im Backend
 * erzwungen — `courses` liefert ausschließlich die eigenen Kurse.
 */
export const load: PageServerLoad = async () => {
	try {
		const d = await backendRequest(
			graphql(`
				query Courses {
					courses {
						name
						coursePath
						semesterPath
						assignmentNames
						studentCount
						groupCount
						importedAt
						updatedAt
					}
				}
			`)
		);
		return { courses: d?.courses ?? [], error: null };
	} catch (e) {
		// Kein Token/kein Backend/kein Zugang → leere Liste + Hinweis, statt 500.
		return { courses: [], error: gqlErrorMessage(e) };
	}
};
