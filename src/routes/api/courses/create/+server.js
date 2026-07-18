import { gql } from 'graphql-request';
import { gqlProxy } from '$lib/server/gqlProxy';

/**
 * Legt einen neuen, leeren Kurs an (glabs-web lehnt einen bereits vorhandenen
 * Namen ab).
 *
 * @type {import('./$types').RequestHandler}
 */
export async function POST({ request }) {
	const { name, coursePath, semesterPath, useCoursenameAsPrefix, useEmailDomainAsSuffix } =
		await request.json();
	return gqlProxy(
		gql`
			mutation CreateCourse(
				$name: String!
				$coursePath: String!
				$semesterPath: String!
				$useCoursenameAsPrefix: Boolean!
				$useEmailDomainAsSuffix: Boolean!
			) {
				createCourse(
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
