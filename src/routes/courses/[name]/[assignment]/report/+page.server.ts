import type { PageServerLoad } from './$types';

/**
 * The report is fetched live in the browser over a WebSocket subscription (see
 * $lib/reportSubscription), so it can show progress while GitLab is queried. The
 * server load only passes the route params through — no slow SSR GitLab call.
 */
export const load: PageServerLoad = async ({ params }) => {
	return { course: params.name, assignment: params.assignment };
};
