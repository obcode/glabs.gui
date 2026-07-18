import { describe, it, expect } from 'vitest';
import { formatDateTime } from './format';

describe('formatDateTime', () => {
	it('formatiert einen RFC3339-Zeitstempel in Europe/Berlin', () => {
		// 2026-07-18T06:36:52Z → 08:36 in Berlin (Sommerzeit, UTC+2)
		expect(formatDateTime('2026-07-18T06:36:52Z')).toBe('18.07.2026, 08:36');
	});
	it('gibt leeren String für Leeres/Ungültiges', () => {
		expect(formatDateTime('')).toBe('');
		expect(formatDateTime(null)).toBe('');
		expect(formatDateTime('not-a-date')).toBe('');
	});
});
