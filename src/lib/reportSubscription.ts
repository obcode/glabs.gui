import { createClient } from 'graphql-ws';
import { print } from 'graphql';
import { env } from '$env/dynamic/public';
import { graphql } from '$lib/gql';
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

// Browser → glabs-web GraphQL over WebSocket. Unlike the SSR calls (internal hop),
// the report stream runs in the browser against PUBLIC_GLABS_SERVER; in production
// the auth proxy injects the identity on the WS upgrade (as on any request), in
// dev the backend runs with auth disabled.
function wsURL(): string {
	const http = env.PUBLIC_GLABS_SERVER;
	if (!http) {
		throw new Error('PUBLIC_GLABS_SERVER ist nicht gesetzt — der Report-Stream kann nicht öffnen.');
	}
	return http.replace(/^http/, 'ws');
}

/**
 * Subscribe to the live report stream for one assignment. Calls `next` for every
 * progress event and `error` on a transport/connection failure. Returns a cleanup
 * function that unsubscribes and disposes the client.
 */
export function subscribeAssignmentReport(
	course: string,
	name: string,
	handlers: { next: (p: ReportProgress) => void; error: (message: string) => void }
): () => void {
	let client: ReturnType<typeof createClient>;
	try {
		client = createClient({ url: wsURL() });
	} catch (e) {
		handlers.error(e instanceof Error ? e.message : String(e));
		return () => {};
	}

	const unsub = client.subscribe(
		{ query: print(DOC), variables: { course, name } },
		{
			next: (result) => {
				const data = result.data as AssignmentReportProgressSubscription | undefined;
				if (data?.assignmentReportProgress) handlers.next(data.assignmentReportProgress);
			},
			error: (err) => handlers.error(err instanceof Error ? err.message : String(err)),
			complete: () => {}
		}
	);

	return () => {
		unsub();
		void client.dispose();
	};
}
