import type { PageServerLoad } from './$types';

/**
 * Die Repo-Übersicht wird live im Browser über eine WebSocket-Subscription geladen
 * (assignmentweise, mit Fortschritt), nicht im SSR — so blockiert die Seite nicht,
 * während GitLab abgefragt wird. Der Load reicht nur die Route-Parameter durch.
 */
export const load: PageServerLoad = async ({ params }) => {
	return { course: params.name };
};
