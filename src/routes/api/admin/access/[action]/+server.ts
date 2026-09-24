import { error, json } from '@sveltejs/kit';
import { graphql } from '$lib/gql';
import { gqlProxy } from '$lib/server/gqlProxy';
import { forgetAccess } from '$lib/server/accessGate';
import type { RequestHandler } from './$types';

// Die vier Entscheidungen der Seite /admin/access. Admin-gated im Backend.
const ApproveUser = graphql(`
	mutation ApproveUser($email: String!) {
		approveUser(email: $email) {
			status
		}
	}
`);
const RejectUser = graphql(`
	mutation RejectUser($email: String!) {
		rejectUser(email: $email) {
			status
		}
	}
`);
const RevokeUser = graphql(`
	mutation RevokeUser($email: String!) {
		revokeUser(email: $email) {
			status
		}
	}
`);
const ResetUser = graphql(`
	mutation ResetUser($email: String!) {
		resetUser(email: $email)
	}
`);

export const POST: RequestHandler = async ({ params, request }) => {
	const body = await request.json().catch(() => ({}));
	const email = typeof body?.email === 'string' ? body.email : '';
	if (!email) return json({ error: 'Keine E-Mail-Adresse angegeben.' }, { status: 400 });

	let res: Response;
	switch (params.action) {
		case 'approve':
			res = await gqlProxy(ApproveUser, { email });
			break;
		case 'reject':
			res = await gqlProxy(RejectUser, { email });
			break;
		case 'revoke':
			res = await gqlProxy(RevokeUser, { email });
			break;
		case 'reset':
			res = await gqlProxy(ResetUser, { email });
			break;
		default:
			error(404, 'Unbekannte Aktion.');
	}
	// Der GUI-Riegel soll die Entscheidung sofort sehen, nicht erst nach 30 s.
	forgetAccess(email);
	return res;
};
