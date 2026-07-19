import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { PageServerLoad } from './$types';

/**
 * Der geführte Assignment-Editor: das server-autoritative Feld-Schema
 * (`assignmentSchema`) plus die eigenen Werte und die aufgelöste Vorschau dieses
 * Assignments.
 */
export const load: PageServerLoad = async ({ params }) => {
	const { name: course, assignment } = params;
	try {
		const d = await backendRequest(
			graphql(`
				query AssignmentEditor($course: String!, $name: String!) {
					course(name: $course) {
						assignmentNames
					}
					assignmentSchema {
						key
						label
						description
						group
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
					branchRuleSchema {
						key
						label
						description
						kind
						required
						example
					}
					approvalSettingsSchema {
						key
						label
						description
						kind
						required
						example
						options {
							value
							label
							description
						}
					}
					approvalRuleSchema {
						key
						label
						description
						kind
						required
						example
					}
					assignment(course: $course, name: $name) {
						course
						name
						extends
						extendsOptions
						abstract
						own {
							key
							value
						}
						resolved
						resolveError
					}
					assignmentUrls(course: $course, name: $name) {
						per
						groupUrl
						repos {
							for
							url
						}
					}
				}
			`),
			{ course, name: assignment }
		);
		// Kein Assignment dieses Namens → „neu"-Modus: ein leeres Assignment
		// synthetisieren, der Editor legt es beim Speichern (Upsert) an.
		if (!d?.assignment) {
			return {
				schema: d?.assignmentSchema ?? [],
				branchSchema: d?.branchRuleSchema ?? [],
				settingsSchema: d?.approvalSettingsSchema ?? [],
				ruleSchema: d?.approvalRuleSchema ?? [],
				assignment: {
					course,
					name: assignment,
					extends: null,
					// A brand-new assignment may inherit from any existing sibling
					// (it is not in the course yet, so none of them is itself).
					extendsOptions: d?.course?.assignmentNames ?? [],
					abstract: false,
					own: [],
					resolved: '',
					resolveError: null
				},
				urls: null,
				isNew: true
			};
		}
		return {
			schema: d.assignmentSchema ?? [],
			branchSchema: d.branchRuleSchema ?? [],
			settingsSchema: d.approvalSettingsSchema ?? [],
			ruleSchema: d.approvalRuleSchema ?? [],
			assignment: d.assignment,
			urls: d.assignmentUrls ?? null,
			isNew: false
		};
	} catch (e) {
		// A thrown SvelteKit error (404) has a `status`; re-throw it untouched.
		if (e && typeof e === 'object' && 'status' in e) throw e;
		throw error(502, gqlErrorMessage(e));
	}
};
