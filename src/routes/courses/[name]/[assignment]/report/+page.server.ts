import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Live-Report über die Repositories eines Assignments — holt die Daten mit dem
 * hinterlegten GitLab-Token aus GitLab. Eigene Route (nicht im Editor-Load), weil
 * der Aufruf einen GitLab-Roundtrip macht, ein Token braucht und langsam sein kann.
 *
 * Fehler (kein Token, GitLab nicht erreichbar) werden als `error` zurückgegeben,
 * damit die Seite eine Meldung statt 500 zeigt.
 */
export const load: PageServerLoad = async ({ params }) => {
	const { name: course, assignment } = params;
	try {
		const d = await backendRequest(
			graphql(`
				query AssignmentReport($course: String!, $name: String!) {
					assignmentReport(course: $course, name: $name) {
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
			`),
			{ course, name: assignment }
		);
		return { course, assignment, report: d?.assignmentReport ?? null, error: null };
	} catch (e) {
		return { course, assignment, report: null, error: gqlErrorMessage(e) };
	}
};
