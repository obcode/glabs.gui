import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Aktualisiert die Kurs-Einstellungen (Assignments/Studierende/Gruppen bleiben
 * unangetastet).
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { name, coursePath, semesterPath, useCoursenameAsPrefix, useEmailDomainAsSuffix } =
		await request.json();
	return gqlProxy(
		gql`
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
		`,
		{
			name,
			coursePath,
			semesterPath,
			useCoursenameAsPrefix: !!useCoursenameAsPrefix,
			useEmailDomainAsSuffix: !!useEmailDomainAsSuffix
		}
	);
}
