import { createClient } from 'graphql-ws';
import { print, type DocumentNode } from 'graphql';
import { env } from '$env/dynamic/public';

// Browser → glabs-web GraphQL over WebSocket. Unlike the SSR calls (internal hop),
// subscriptions run in the browser against PUBLIC_GLABS_SERVER; in production the
// auth proxy injects the identity on the WS upgrade (as on any request), in dev the
// backend runs with auth disabled.
function wsURL(): string {
	const http = env.PUBLIC_GLABS_SERVER;
	if (!http) {
		throw new Error('PUBLIC_GLABS_SERVER ist nicht gesetzt — der Live-Stream kann nicht öffnen.');
	}
	return http.replace(/^http/, 'ws');
}

/**
 * Open a GraphQL subscription in the browser. `next` receives each payload's data;
 * `error` a transport/connection failure. Returns a cleanup function that
 * unsubscribes and disposes the client.
 */
export function subscribe<TData>(
	document: DocumentNode,
	variables: Record<string, unknown>,
	handlers: { next: (data: TData) => void; error: (message: string) => void }
): () => void {
	let client: ReturnType<typeof createClient>;
	try {
		// keepAlive: the client pings every 12s so a long stream (report/check) is
		// not dropped as idle and re-subscribed from scratch. Belt-and-suspenders
		// with the server's PongOnlyInterval.
		client = createClient({ url: wsURL(), keepAlive: 12_000 });
	} catch (e) {
		handlers.error(e instanceof Error ? e.message : String(e));
		return () => {};
	}

	const unsub = client.subscribe(
		{ query: print(document), variables },
		{
			next: (result) => {
				if (result.data) handlers.next(result.data as TData);
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
