import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Aktualisiert die Kurs-Einstellungen (Assignments/Studierende/Gruppen bleiben
 * unangetastet).
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name, coursePath, semesterPath, useCoursenameAsPrefix, useEmailDomainAsSuffix } =
		await request.json();
	return gqlProxy(
		graphql(`
			mutation SetCourse(
				$name: String!
				$coursePath: String!
				$semesterPath: String!
				$useCoursenameAsPrefix: Boolean!
				$useEmailDomainAsSuffix: Boolean!
			) {
				setCourse(
					name: $name
					coursePath: $coursePath
					semesterPath: $semesterPath
					useCoursenameAsPrefix: $useCoursenameAsPrefix
					useEmailDomainAsSuffix: $useEmailDomainAsSuffix
				) {
					name
				}
			}
		`),
		{
			name,
			coursePath,
			semesterPath,
			useCoursenameAsPrefix: !!useCoursenameAsPrefix,
			useEmailDomainAsSuffix: !!useEmailDomainAsSuffix
		}
	);
};
