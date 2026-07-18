import { graphql } from '$lib/gql';
import { subscribe } from '$lib/wsClient';
import type { CourseCheckProgressSubscription } from '$lib/gql/graphql';

// One progress event of the course-check stream (the subscription payload).
export type CheckProgress = CourseCheckProgressSubscription['courseCheckProgress'];

const DOC = graphql(`
	subscription CourseCheckProgress($name: String!) {
		courseCheckProgress(name: $name) {
			message
			done
			error
			result {
				course
				errors
				ok
				students {
					input
					status
					message
				}
				groups {
					name
					members {
						input
						status
						message
					}
				}
				duplicates {
					student
					groups
				}
			}
		}
	}
`);

/**
 * Subscribe to the live course-check stream. Calls `next` for every progress event
 * and `error` on a transport failure. Returns a cleanup function.
 */
export function subscribeCourseCheck(
	name: string,
	handlers: { next: (p: CheckProgress) => void; error: (message: string) => void }
): () => void {
	return subscribe<CourseCheckProgressSubscription>(
		DOC,
		{ name },
		{
			next: (d) => {
				if (d.courseCheckProgress) handlers.next(d.courseCheckProgress);
			},
			error: handlers.error
		}
	);
}
