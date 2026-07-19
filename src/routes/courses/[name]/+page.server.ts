import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Detailansicht eines Kurses: Metadaten, Assignment-Namen und Lint-Funde.
 * Owner-Isolation im Backend — `course(name)` liefert nur einen eigenen Kurs.
 */
export const load: PageServerLoad = async ({ params }) => {
	const name = params.name;
	let course;
	try {
		const d = await backendRequest(
			graphql(`
				query Course($name: String!) {
					course(name: $name) {
						name
						coursePath
						semesterPath
						useCoursenameAsPrefix
						useEmailDomainAsSuffix
						students
						groups {
							name
							members
						}
						assignmentNames
						studentCount
						groupCount
						importedAt
						updatedAt
					}
				}
			`),
			{ name }
		);
		course = d?.course ?? null;
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}
	if (!course) throw error(404, `Kurs „${name}" nicht gefunden`);

	// Lint separat: ein Fehler hier soll die Detailseite nicht verhindern.
	let lint: { path: string; message: string; severity: string }[];
	try {
		const d = await backendRequest(
			graphql(`
				query CourseLint($name: String!) {
					courseLint(name: $name) {
						path
						message
						severity
					}
				}
			`),
			{ name }
		);
		lint = d?.courseLint ?? [];
	} catch {
		lint = [];
	}

	// Aktivitäts-Log separat und resilient: der Status pro Assignment ist eine
	// Ergänzung, kein Grund, die Seite scheitern zu lassen.
	let activity: { assignment: string; op: string; status: string; detail: string; at: string }[];
	try {
		const d = await backendRequest(
			graphql(`
				query CourseActivity($name: String!) {
					courseActivity(course: $name) {
						assignment
						op
						status
						detail
						at
					}
				}
			`),
			{ name }
		);
		activity = d?.courseActivity ?? [];
	} catch {
		activity = [];
	}

	return { course, lint, activity };
};
