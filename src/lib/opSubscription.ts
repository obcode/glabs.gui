import { graphql } from '$lib/gql';
import { subscribe } from '$lib/wsClient';
import type { RunOpSubscription } from '$lib/gql/graphql';

// One streamed output line of a running operation.
export type LogLine = RunOpSubscription['runOp'];

const DOC = graphql(`
	subscription RunOp($token: String!, $confirmPhrase: String) {
		runOp(token: $token, confirmPhrase: $confirmPhrase) {
			level
			text
		}
	}
`);

/**
 * Run a planned operation (from planOp's token) and stream its output. Calls `next`
 * for every log line and `error` on a transport failure. The operation keeps
 * running server-side even if this subscription is torn down. Returns a cleanup fn.
 */
export function subscribeRunOp(
	token: string,
	confirmPhrase: string | null,
	handlers: { next: (line: LogLine) => void; error: (message: string) => void }
): () => void {
	return subscribe<RunOpSubscription>(
		DOC,
		{ token, confirmPhrase },
		{
			next: (d) => {
				if (d.runOp) handlers.next(d.runOp);
			},
			error: handlers.error
		}
	);
}
