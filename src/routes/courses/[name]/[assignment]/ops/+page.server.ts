import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import type { PageServerLoad } from './$types';

/**
 * The operations page plans via /api/op/plan and runs via the runOp WebSocket
 * subscription (both client-side). The load additionally fetches the assignment's
 * roster (per + the target labels) so the user can restrict an op to selected
 * students/groups (onlyFor) — purely from the resolved config, no GitLab call.
 */
export const load: PageServerLoad = async ({ params }) => {
	const { name: course, assignment } = params;
	let per: string | null = null;
	let targets: string[] = [];
	try {
		const d = await backendRequest(
			graphql(`
				query OpsTargets($course: String!, $name: String!) {
					assignmentUrls(course: $course, name: $name) {
						per
						repos {
							for
						}
					}
				}
			`),
			{ course, name: assignment }
		);
		if (d?.assignmentUrls) {
			per = d.assignmentUrls.per;
			targets = d.assignmentUrls.repos.map((r) => r.for);
		}
	} catch {
		// Abstract/unresolvable assignment → no selection offered; the op still
		// runs for everyone.
	}
	return { course, assignment, per, targets };
};
