import { gql } from 'graphql-request';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';

/**
 * Die Kurse des angemeldeten Nutzers (SSR). Owner-Isolation ist im Backend
 * erzwungen — `courses` liefert ausschließlich die eigenen Kurse.
 *
 * @type {import('./$types').PageServerLoad}
 */
export const load = async () => {
	try {
		const d = await backendRequest(gql`
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
		`);
		return { courses: d?.courses ?? [], error: null };
	} catch (e) {
		// Kein Token/kein Backend/kein Zugang → leere Liste + Hinweis, statt 500.
		return { courses: [], error: gqlErrorMessage(e) };
	}
};
