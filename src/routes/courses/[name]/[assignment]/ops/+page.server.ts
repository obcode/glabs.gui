import type { PageServerLoad } from './$types';

/**
 * The operations page plans via /api/op/plan and runs via the runOp WebSocket
 * subscription (both client-side). The server load only passes the route params.
 */
export const load: PageServerLoad = async ({ params }) => {
	return { course: params.name, assignment: params.assignment };
};
