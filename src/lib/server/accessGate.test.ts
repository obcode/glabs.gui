import { describe, it, expect, vi, beforeEach } from 'vitest';

// Das Backend mocken: accessOf soll nur prüfen, wann es fragt und was es cacht.
const backendRequest = vi.fn();
vi.mock('$lib/server/backend', () => ({ backendRequest }));

const { gateDecision, isOpenPath, accessOf, forgetAccess } = await import('./accessGate');

describe('gateDecision', () => {
	it('lässt Freigeschaltete überall durch', () => {
		expect(gateDecision('/courses', 'APPROVED')).toBe('allow');
		expect(gateDecision('/api/op/run', 'APPROVED')).toBe('allow');
	});

	it('schickt Nicht-Freigeschaltete auf /zugang, /api bekommt 403', () => {
		for (const s of ['NONE', 'PENDING', 'REJECTED', 'REVOKED'] as const) {
			expect(gateDecision('/', s)).toBe('redirect');
			expect(gateDecision('/admin/access', s)).toBe('redirect');
			expect(gateDecision('/api/courses/save', s)).toBe('deny');
		}
	});

	it('lässt die Anfrage-Seite und ihren Endpunkt offen', () => {
		expect(gateDecision('/zugang', 'NONE')).toBe('allow');
		expect(gateDecision('/api/access/request', 'NONE')).toBe('allow');
	});

	it('sperrt niemanden aus, wenn das Backend nicht antwortet', () => {
		expect(gateDecision('/courses', null)).toBe('allow');
	});
});

describe('isOpenPath', () => {
	it('kennt nur die festen offenen Pfade', () => {
		expect(isOpenPath('/healthz/gui')).toBe(true);
		expect(isOpenPath('/_app/immutable/x.js')).toBe(true);
		expect(isOpenPath('/zugang/../courses')).toBe(false);
		expect(isOpenPath('/api/access/requestX')).toBe(false);
		expect(isOpenPath('/api/admin/access/approve')).toBe(false);
	});
});

describe('accessOf', () => {
	beforeEach(() => {
		backendRequest.mockReset();
		forgetAccess('a@hm.edu');
		forgetAccess('b@hm.edu');
	});

	it('cacht pro Kennung, unabhängig von Groß-/Kleinschreibung', async () => {
		backendRequest.mockResolvedValue({ me: { access: 'PENDING' } });
		expect(await accessOf('a@hm.edu')).toBe('PENDING');
		expect(await accessOf('A@hm.edu')).toBe('PENDING');
		expect(backendRequest).toHaveBeenCalledTimes(1);

		backendRequest.mockResolvedValue({ me: { access: 'APPROVED' } });
		expect(await accessOf('b@hm.edu')).toBe('APPROVED');
		expect(await accessOf('a@hm.edu')).toBe('PENDING');
		expect(backendRequest).toHaveBeenCalledTimes(2);
	});

	it('fragt nach forgetAccess neu', async () => {
		backendRequest.mockResolvedValue({ me: { access: 'PENDING' } });
		await accessOf('a@hm.edu');
		forgetAccess('A@HM.EDU');
		backendRequest.mockResolvedValue({ me: { access: 'APPROVED' } });
		expect(await accessOf('a@hm.edu')).toBe('APPROVED');
	});

	it('liefert bei Fehlern null und cacht das nicht', async () => {
		backendRequest.mockRejectedValue(new Error('down'));
		expect(await accessOf('a@hm.edu')).toBeNull();
		backendRequest.mockResolvedValue({ me: { access: 'APPROVED' } });
		expect(await accessOf('a@hm.edu')).toBe('APPROVED');
	});
});
