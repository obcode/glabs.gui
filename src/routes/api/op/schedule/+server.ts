import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import type { RequestHandler } from './$types';

/**
 * Schedule a planned operation (from planOp's token) to run at runAt. Reuses the
 * same confirm token as runOp; graceMinutes/confirmPhrase are optional.
 */
export const POST: RequestHandler = async ({ request }) => {
	const { token, runAt, graceMinutes, confirmPhrase } = await request.json();
	return gqlProxy(
		graphql(`
			mutation ScheduleOp(
				$token: String!
				$runAt: Time!
				$graceMinutes: Int
				$confirmPhrase: String
			) {
				scheduleOp(
					token: $token
					runAt: $runAt
					graceMinutes: $graceMinutes
					confirmPhrase: $confirmPhrase
				) {
					id
					op
					course
					assignment
					runAt
					graceMinutes
					status
				}
			}
		`),
		{ token, runAt, graceMinutes, confirmPhrase }
	);
};
