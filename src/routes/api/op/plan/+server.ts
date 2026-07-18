import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Plan a mutating GitLab operation (token-free preview): returns the repositories
 * it would touch, warnings, and a confirm token for runOp.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { op, course, assignment, params, onlyFor } = await request.json();
	return gqlProxy(
		graphql(`
			mutation PlanOp(
				$op: Op!
				$course: String!
				$assignment: String!
				$params: OpParams
				$onlyFor: [String!]
			) {
				planOp(
					op: $op
					course: $course
					assignment: $assignment
					params: $params
					onlyFor: $onlyFor
				) {
					op
					course
					assignment
					resolved
					targets {
						for
						repo
						url
					}
					warnings
					destructive
					confirmPhrase
					token
					expiresAt
				}
			}
		`),
		{ op, course, assignment, params, onlyFor }
	);
};
