import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Anfrage-Seite für angemeldete, aber nicht freigeschaltete Personen. Der Status
 * kommt aus dem Layout-Load (`me.access`); wer freigeschaltet ist, hat hier nichts
 * verloren.
 */
export const load: PageServerLoad = async ({ parent }) => {
	const { me } = await parent();
	if (me?.access === 'APPROVED') redirect(303, '/');
	return {};
};
