import { gql } from 'graphql-request';
import { error } from '@sveltejs/kit';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';

/**
 * Der geführte Assignment-Editor (vorerst read-only): das server-autoritative
 * Feld-Schema (`assignmentSchema`) plus die eigenen Werte und die aufgelöste
 * Vorschau dieses Assignments.
 *
 * @type {import('./$types').PageServerLoad}
 */
export const load = async ({ params }) => {
	const { name: course, assignment } = params;
	try {
		const d = await backendRequest(
			gql`
				query AssignmentEditor($course: String!, $name: String!) {
					assignmentSchema {
						key
						label
						description
						kind
						required
						deprecated
						example
						options {
							value
							label
							description
						}
					}
					assignment(course: $course, name: $name) {
						course
						name
						extends
						abstract
						own {
							key
							value
						}
						resolved
						resolveError
					}
				}
			`,
			{ course, name: assignment }
		);
		if (!d?.assignment) {
			throw error(404, `Assignment „${assignment}" in Kurs „${course}" nicht gefunden`);
		}
		return { schema: d.assignmentSchema ?? [], assignment: d.assignment };
	} catch (e) {
		// A thrown SvelteKit error (404) has a `status`; re-throw it untouched.
		if (e && typeof e === 'object' && 'status' in e) throw e;
		throw error(502, gqlErrorMessage(e));
	}
};
