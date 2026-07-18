import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Legt einen neuen, leeren Kurs an (glabs-web lehnt einen bereits vorhandenen
 * Namen ab).
 */
export const POST: RequestHandler = async ({ request }) => {
	const { name, coursePath, semesterPath, useCoursenameAsPrefix, useEmailDomainAsSuffix } =
		await request.json();
	return gqlProxy(
		graphql(`
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
