import { json } from '@sveltejs/kit';
import { PREVIEW_COOKIE } from '$lib/server/preview';
import { forgetAccess } from '$lib/server/accessGate';
import type { RequestHandler } from './$types';

/**
 * Vorschau-Modus an- oder ausschalten (`{ on: boolean }`). Ein Sitzungs-Cookie:
 * Browser zu, Vorschau aus. Offen erreichbar, weil man ihn auch aus der
 * Vorschau heraus (also ohne Freischaltung) wieder ausschalten können muss.
 */
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const body = await request.json().catch(() => ({}));
	if (body?.on === true) {
		cookies.set(PREVIEW_COOKIE, '1', { path: '/', httpOnly: true, sameSite: 'lax' });
	} else {
		cookies.delete(PREVIEW_COOKIE, { path: '/' });
	}
	forgetAccess(locals.remoteUser);
	return json({ preview: body?.on === true });
};
