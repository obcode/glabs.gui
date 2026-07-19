import { graphql } from '$lib/gql';
import { subscribe } from '$lib/wsClient';
import type { CourseRepoOverviewProgressSubscription } from '$lib/gql/graphql';

// One progress event of the repo-overview stream (the subscription payload).
export type RepoOverviewEvent =
	CourseRepoOverviewProgressSubscription['courseRepoOverviewProgress'];

const DOC = graphql(`
	subscription CourseRepoOverviewProgress($course: String!) {
		courseRepoOverviewProgress(course: $course) {
			total
			done
			error
			assignment {
				name
				per
				targets
				existing
				note
				repos {
					for
					url
					exists
				}
			}
		}
	}
`);

/**
 * Subscribe to the live repo-overview stream. Calls `next` for every event
 * (one finished assignment, then a final done) and `error` on a transport failure.
 * Returns a cleanup function.
 */
export function subscribeRepoOverview(
	course: string,
	handlers: { next: (e: RepoOverviewEvent) => void; error: (message: string) => void }
): () => void {
	return subscribe<CourseRepoOverviewProgressSubscription>(
		DOC,
		{ course },
		{
			next: (d) => {
				if (d.courseRepoOverviewProgress) handlers.next(d.courseRepoOverviewProgress);
			},
			error: handlers.error
		}
	);
}
