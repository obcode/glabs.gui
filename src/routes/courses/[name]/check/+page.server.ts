import type { PageServerLoad } from './$types';

/**
 * The check runs live in the browser over a WebSocket subscription (see
 * $lib/checkSubscription), so it can show progress while GitLab is queried per
 * roster entry. The server load only passes the course name through.
 */
export const load: PageServerLoad = async ({ params }) => {
	return { course: params.name };
};
