import { gql } from 'graphql-request';
import { error } from '@sveltejs/kit';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';

/**
 * Detailansicht eines Kurses: Metadaten, Assignment-Namen und Lint-Funde.
 * Owner-Isolation im Backend — `course(name)` liefert nur einen eigenen Kurs.
 *
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ params }) => {
	const name = params.name;
	let course;
	try {
		const d = await backendRequest(
			gql`
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
			`,
			{ name }
		);
		course = d?.course ?? null;
	} catch (e) {
		throw error(502, gqlErrorMessage(e));
	}
	if (!course) throw error(404, `Kurs „${name}" nicht gefunden`);

	// Lint separat: ein Fehler hier soll die Detailseite nicht verhindern.
	let lint;
	try {
		const d = await backendRequest(
			gql`
				query CourseLint($name: String!) {
					courseLint(name: $name) {
						path
						message
						severity
					}
				}
			`,
			{ name }
		);
		lint = d?.courseLint ?? [];
	} catch {
		lint = [];
	}

	return { course, lint };
};
