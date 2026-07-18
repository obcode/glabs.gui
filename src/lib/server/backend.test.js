import { describe, it, expect, vi, beforeEach } from 'vitest';

// $env + graphql-request mocken; wir prüfen nur, mit welcher URL/Headern der
// GraphQLClient gebaut wird — nicht das echte Backend.
vi.mock('$env/dynamic/private', () => ({ env: { GLABS_SERVER: 'http://test/query' } }));
const clientCtor = vi.fn();
vi.mock('graphql-request', () => ({
	GraphQLClient: class {
		/**
		 * @param {string} url
		 * @param {unknown} opts
		 */
		constructor(url, opts) {
			clientCtor(url, opts);
		}
		request() {
			return Promise.resolve(null);
		}
	}
}));

const { authContext, backendClient } = await import('./backend.js');

beforeEach(() => clientCtor.mockReset());

describe('backendClient', () => {
	it('ohne Kontext: keine Identitäts-Header', () => {
		backendClient();
		expect(clientCtor).toHaveBeenCalledWith('http://test/query', { headers: {} });
	});

	it('reicht die Identität aus dem AsyncLocalStorage als X-Remote-User weiter', () => {
		authContext.run({ remoteUser: 'a@hm.edu', remoteDisplayname: 'Anna A.' }, () => {
			backendClient();
		});
		expect(clientCtor).toHaveBeenCalledWith('http://test/query', {
			headers: { 'X-Remote-User': 'a@hm.edu', 'X-Remote-Displayname': 'Anna A.' }
		});
	});

	it('expliziter Kontext schlägt den ALS-Kontext', () => {
		authContext.run({ remoteUser: 'als@hm.edu' }, () => {
			backendClient({ remoteUser: 'explicit@hm.edu' });
		});
		expect(clientCtor).toHaveBeenCalledWith('http://test/query', {
			headers: { 'X-Remote-User': 'explicit@hm.edu' }
		});
	});
});
