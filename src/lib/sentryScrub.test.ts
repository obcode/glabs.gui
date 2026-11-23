import { describe, expect, it } from 'vitest';
import {
	DATA_COLLECTION,
	FILTERED,
	scrubBreadcrumb,
	scrubEvent,
	scrubHeaders,
	scrubText,
	withoutQuery
} from './sentryScrub.ts';

// Nur erfundene Werte: das Repo ist öffentlich.
const MAIL = 'someone@example.invalid';
const PAT = 'glpat-FAKE';
const LEGACY_TOKEN = 'FAKElegacy0123456789';

/** Alles, was je in einem Event stehen könnte und nie darin stehen darf. */
const SECRETS = [MAIL, 'Some One', PAT, LEGACY_TOKEN, 'FAKEcookie', 'FAKEbearer', '198.51.100.7'];

function expectNoSecrets(value: unknown) {
	const json = JSON.stringify(value);
	for (const secret of SECRETS) expect(json).not.toContain(secret);
}

describe('withoutQuery', () => {
	it('schneidet an Query und Fragment ab', () => {
		expect(withoutQuery('https://example.invalid/courses/algo?filter=x&mail=' + MAIL)).toBe(
			'https://example.invalid/courses/algo'
		);
		expect(withoutQuery('/token#neu')).toBe('/token');
		expect(withoutQuery('/jobs')).toBe('/jobs');
	});
});

describe('scrubHeaders', () => {
	it('lässt nur harmlose Header durch, gleich in welcher Schreibweise', () => {
		const kept = scrubHeaders({
			'X-Remote-User': MAIL,
			'x-remote-displayname': 'Some One',
			'X-Glabs-Preview': 'unapproved',
			'X-Forwarded-Email': MAIL,
			'X-Forwarded-User': MAIL,
			'X-Forwarded-Preferred-Username': 'someone',
			'X-Forwarded-Access-Token': 'FAKEbearer',
			'X-Forwarded-For': '198.51.100.7',
			'X-Real-Ip': '198.51.100.7',
			Forwarded: 'for=198.51.100.7',
			'X-Auth-Request-Email': MAIL,
			'X-Auth-Request-User': MAIL,
			'Remote-User': MAIL,
			Authorization: 'Bearer FAKEbearer',
			'Private-Token': PAT,
			Cookie: '_oauth2_proxy=FAKEcookie; glabs_preview=1',
			'User-Agent': 'Mozilla/5.0',
			Accept: 'text/html',
			Referer: 'https://example.invalid/courses?mail=' + MAIL
		});

		expect(kept).toEqual({
			'User-Agent': 'Mozilla/5.0',
			Accept: 'text/html',
			Referer: 'https://example.invalid/courses'
		});
	});
});

describe('scrubText', () => {
	it('entfernt GitLab-Token an ihrem Präfix', () => {
		expect(scrubText(`token ${PAT} rejected`)).toBe(`token ${FILTERED} rejected`);
		expect(scrubText('gldt-FAKE1234 and glrt-FAKE5678')).toBe(`${FILTERED} and ${FILTERED}`);
	});

	it('lässt glabs-Namen stehen, die nur wie ein Präfix aussehen', () => {
		expect(scrubText('glabs-web unreachable')).toBe('glabs-web unreachable');
	});

	it('entfernt den Wert eines JSON-Felds "token", auch ohne Präfix', () => {
		expect(scrubText(`{"token":"${LEGACY_TOKEN}","x":1}`)).toBe(`{"token":"${FILTERED}","x":1}`);
	});

	it('entfernt E-Mail-Adressen', () => {
		expect(scrubText(`no access for ${MAIL}.`)).toBe(`no access for ${FILTERED}.`);
	});

	it('entfernt das Zitat der Eingabe aus einer JSON.parse-Meldung', () => {
		const cases: Array<[string, string]> = [
			[PAT, 'g'],
			[LEGACY_TOKEN, 'F'],
			[`no "json" ${LEGACY_TOKEN} ${'x'.repeat(40)}`, 'o']
		];
		for (const [body, unexpected] of cases) {
			let message = '';
			try {
				JSON.parse(body);
			} catch (e) {
				message = (e as Error).message;
			}
			expect(scrubText(message)).toBe(
				`Unexpected token '${unexpected}', ${FILTERED} is not valid JSON`
			);
		}
	});

	it('schneidet die Anfrage ab, die graphql-request an jeden ClientError hängt', () => {
		const message =
			'GraphQL Error (Code: 500): ' +
			JSON.stringify({
				response: { status: 500, headers: {} },
				request: {
					query:
						'mutation SetGitlabToken($token: String!) { setGitlabToken(token: $token) { set } }',
					variables: { token: LEGACY_TOKEN }
				}
			});
		expect(scrubText(message)).toBe(`GraphQL Error (Code: 500): ${FILTERED}`);
	});
});

describe('scrubBreadcrumb', () => {
	it('schneidet Query-Strings an fetch- und Navigations-Adressen ab', () => {
		const fetch = scrubBreadcrumb({
			category: 'fetch',
			data: {
				url: `https://example.invalid/courses/__data.json?mail=${MAIL}&x-sveltekit-invalidated=01`,
				method: 'GET',
				status_code: 200
			}
		});
		expect(fetch).toEqual({
			category: 'fetch',
			data: { url: 'https://example.invalid/courses/__data.json', method: 'GET', status_code: 200 }
		});

		const navigation = scrubBreadcrumb({
			category: 'navigation',
			data: { from: '/token?t=' + PAT, to: '/courses?q=Some+One' }
		});
		expect(navigation.data).toEqual({ from: '/token', to: '/courses' });
	});

	it('entfernt Token und Adressen aus Meldung und Daten', () => {
		const crumb = scrubBreadcrumb({
			category: 'console',
			message: `setGitlabToken failed for ${MAIL}: ${PAT}`,
			data: { arguments: [{ token: LEGACY_TOKEN }, PAT], logger: `token ${PAT}` }
		});
		expect(crumb.message).toBe(`setGitlabToken failed for ${FILTERED}: ${FILTERED}`);
		expect(crumb.data).toEqual({ logger: `token ${FILTERED}` });
	});

	it('lässt einen Breadcrumb ohne Daten unverändert', () => {
		const click = { category: 'ui.click', message: 'button.btn' };
		expect(scrubBreadcrumb(click)).toEqual(click);
	});
});

describe('scrubEvent', () => {
	it('lässt vom Request nur Methode, Pfad und harmlose Header übrig', () => {
		const event = scrubEvent({
			request: {
				method: 'POST',
				url: `https://example.invalid/api/token/set?mail=${MAIL}`,
				query_string: `mail=${MAIL}`,
				cookies: { _oauth2_proxy: 'FAKEcookie', glabs_preview: '1' },
				data: { token: PAT },
				env: { REMOTE_ADDR: '198.51.100.7' },
				headers: {
					'x-remote-user': MAIL,
					'x-remote-displayname': 'Some One',
					'x-forwarded-for': '198.51.100.7',
					cookie: '_oauth2_proxy=FAKEcookie',
					authorization: 'Bearer FAKEbearer',
					'content-type': 'application/json',
					referer: `https://example.invalid/token?mail=${MAIL}`
				}
			},
			user: { email: MAIL, ip_address: '198.51.100.7' }
		});

		expect(event).toEqual({
			request: {
				method: 'POST',
				url: 'https://example.invalid/api/token/set',
				headers: {
					'content-type': 'application/json',
					referer: 'https://example.invalid/token'
				}
			}
		});
	});

	it('entfernt den Token aus Exception-Text, Frame-Variablen, Meldungen und extra', () => {
		const clientError =
			'GraphQL Error (Code: 400): ' +
			JSON.stringify({
				response: { errors: [{ message: 'bad token' }], status: 400 },
				request: {
					query:
						'mutation SetGitlabToken($token: String!) { setGitlabToken(token: $token) { set } }',
					variables: { token: PAT }
				}
			});
		const event = scrubEvent({
			message: `failed for ${MAIL}`,
			logentry: { message: `failed for ${MAIL}`, params: [LEGACY_TOKEN] },
			exception: {
				values: [
					{
						type: 'ClientError',
						value: clientError,
						stacktrace: {
							frames: [
								{ function: 'POST', lineno: 10, vars: { token: PAT, request: '[object]' } },
								{ function: 'gqlProxy', lineno: 30 }
							]
						}
					}
				]
			},
			breadcrumbs: [{ category: 'navigation', data: { to: `/token?mail=${MAIL}` } }],
			extra: { body: `{"token":"${LEGACY_TOKEN}"}`, count: 1 }
		});

		expectNoSecrets(event);
		expect(event.exception?.values?.[0]).toEqual({
			type: 'ClientError',
			value: `GraphQL Error (Code: 400): ${FILTERED}`,
			stacktrace: {
				frames: [
					{ function: 'POST', lineno: 10 },
					{ function: 'gqlProxy', lineno: 30 }
				]
			}
		});
		expect(event.logentry).toEqual({ message: `failed for ${FILTERED}` });
		expect(event.breadcrumbs).toEqual([{ category: 'navigation', data: { to: '/token' } }]);
		expect(event.extra).toEqual({ body: `{"token":"${FILTERED}"}`, count: 1 });
	});

	it('reicht ein Event ohne Request und Breadcrumbs durch', () => {
		expect(scrubEvent({ message: 'x' })).toEqual({ message: 'x' });
	});

	it('verändert das übergebene Event nicht', () => {
		const original = { request: { headers: { 'x-remote-user': MAIL } } };
		scrubEvent(original);
		expect(original.request.headers['x-remote-user']).toBe(MAIL);
	});
});

describe('DATA_COLLECTION', () => {
	it('lässt das SDK von sich aus nichts einsammeln', () => {
		const leaves = (value: unknown): unknown[] =>
			value !== null && typeof value === 'object' && !Array.isArray(value)
				? Object.values(value).flatMap(leaves)
				: [value];
		const all = leaves(DATA_COLLECTION);
		expect(all.length).toBeGreaterThan(0);
		for (const leaf of all) {
			expect(leaf === false || (Array.isArray(leaf) && leaf.length === 0)).toBe(true);
		}
	});

	it('nennt jede Kategorie, deren Sentry-11-Default etwas einsammelt', () => {
		// Fehlt ein Schlüssel, gilt Sentrys Default — und der ist bei allen diesen `true`.
		expect(Object.keys(DATA_COLLECTION).sort()).toEqual(
			[
				'cookies',
				'databaseQueryData',
				'genAI',
				'graphQL',
				'httpBodies',
				'httpHeaders',
				'mcp',
				'queues',
				'stackFrameVariables',
				'urlQueryParams',
				'userInfo'
			].sort()
		);
		expect(DATA_COLLECTION.graphQL).toEqual({ document: false, variables: false });
	});
});
