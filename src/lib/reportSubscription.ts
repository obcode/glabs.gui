import { graphql } from '$lib/gql';
import { subscribe } from '$lib/wsClient';
import type { AssignmentReportProgressSubscription } from '$lib/gql/graphql';

// One progress event of the report stream (the subscription payload).
export type ReportProgress = AssignmentReportProgressSubscription['assignmentReportProgress'];

const DOC = graphql(`
	subscription AssignmentReportProgress($course: String!, $name: String!) {
		assignmentReportProgress(course: $course, name: $name) {
			message
			done
			error
			report {
				course
				assignment
				url
				description
				generated
				hasReleaseMergeRequest
				hasReleaseDockerImages
				projects {
					name
					active
					emptyRepo
					commits
					lastActivity
					webUrl
					openIssuesCount
					openMergeRequestsCount
					members {
						name
						username
						webUrl
					}
					lastCommit {
						title
						committerName
						committedDate
						webUrl
					}
					release {
						mergeRequest {
							found
							webUrl
							pipelineStatus
						}
						dockerImages {
							status
							images {
								wanted
								image
							}
						}
					}
				}
			}
		}
	}
`);

/**
 * Subscribe to the live report stream for one assignment. Calls `next` for every
 * progress event and `error` on a transport failure. Returns a cleanup function.
 */
export function subscribeAssignmentReport(
	course: string,
	name: string,
	handlers: { next: (p: ReportProgress) => void; error: (message: string) => void }
): () => void {
	return subscribe<AssignmentReportProgressSubscription>(
		DOC,
		{ course, name },
		{
			next: (d) => {
				if (d.assignmentReportProgress) handlers.next(d.assignmentReportProgress);
			},
			error: handlers.error
		}
	);
}
