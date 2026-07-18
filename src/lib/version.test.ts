import { describe, it, expect } from 'vitest';
import { displayVersion, baseReleaseTag, isExactTag } from './version';

describe('displayVersion', () => {
	it('normalisiert auf ein führendes v', () => {
		expect(displayVersion('1.2.3')).toBe('v1.2.3');
		expect(displayVersion('v1.2.3')).toBe('v1.2.3');
	});
	it('gibt null für leere Eingaben', () => {
		expect(displayVersion('')).toBeNull();
		expect(displayVersion(null)).toBeNull();
		expect(displayVersion(undefined)).toBeNull();
	});
});

describe('baseReleaseTag', () => {
	it('extrahiert den Release-Tag aus einem git-describe-Suffix', () => {
		expect(baseReleaseTag('v1.2.3-4-gabc123')).toBe('v1.2.3');
		expect(baseReleaseTag('1.2.3-dirty')).toBe('v1.2.3');
	});
	it('gibt null, wenn kein Tag erkennbar ist', () => {
		expect(baseReleaseTag('gabc123')).toBeNull();
		expect(baseReleaseTag(null)).toBeNull();
	});
});

describe('isExactTag', () => {
	it('erkennt exakte Tags', () => {
		expect(isExactTag('v1.2.3')).toBe(true);
		expect(isExactTag('1.2.3')).toBe(true);
	});
	it('lehnt dev-Builds und Leeres ab', () => {
		expect(isExactTag('v1.2.3-4-gabc123')).toBe(false);
		expect(isExactTag('')).toBe(false);
		expect(isExactTag(undefined)).toBe(false);
	});
});
