import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Studierenden-Übersicht eines Kurses, angereichert mit ZPA-Details. Die ZPA-Abfragen
 * laufen serverseitig (kann bei großem Roster ein paar Sekunden dauern).
 */
export const load: PageServerLoad = async ({ params }) => {
	const course = params.name;
	try {
		const d = await backendRequest(
			graphql(`
				query CourseStudents($course: String!) {
					courseStudents(course: $course) {
						email
						found
						firstName
						lastName
						gender
						group
						mtknr
					}
				}
			`),
			{ course }
		);
		return { course, students: d?.courseStudents ?? [] };
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}
};
