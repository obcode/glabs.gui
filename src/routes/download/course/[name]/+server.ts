import { error } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { backendRequest } from '$lib/server/backend';
import { gqlErrorMessage } from '$lib/gqlError';
import type { RequestHandler } from './$types';

/**
 * Liefert einen Kurs als YAML-Datei zum Download (die Original-Bytes des Uploads,
 * solange im Web nichts editiert wurde). Owner-Isolation im Backend.
 */
export const GET: RequestHandler = async ({ params }) => {
	const name = params.name;
	let yaml;
	try {
		const d = await backendRequest(
			graphql(`
				query CourseYAML($name: String!) {
					courseYAML(name: $name)
				}
			`),
			{ name }
		);
		yaml = d?.courseYAML;
	} catch (e) {
		throw error(404, gqlErrorMessage(e));
	}
	if (typeof yaml !== 'string') throw error(404, `Kurs „${name}" nicht gefunden`);

	// Dateiname auf ein unbedenkliches Muster beschränken (der Kursname wird sonst
	// unverändert in den Content-Disposition-Header gesetzt).
	const safe = /^[A-Za-z0-9._-]+$/.test(name) ? name : 'course';
	return new Response(yaml, {
		headers: {
			'content-type': 'application/x-yaml; charset=utf-8',
			'content-disposition': `attachment; filename="${safe}.yaml"`
		}
	});
};
