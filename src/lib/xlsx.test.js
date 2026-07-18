import { describe, it, expect } from 'vitest';
import { colToIndex, parseSharedStrings, parseSheet } from './xlsx.js';

describe('colToIndex', () => {
	it('mappt Spaltenbuchstaben auf 0-basierte Indizes', () => {
		expect(colToIndex('A1')).toBe(0);
		expect(colToIndex('B12')).toBe(1);
		expect(colToIndex('Z9')).toBe(25);
		expect(colToIndex('AA1')).toBe(26);
	});
});

describe('parseSharedStrings', () => {
	it('liest <si>/<t> und fügt Rich-Text zusammen, entschärft Entities', () => {
		const xml =
			'<sst><si><t>E-Mail-Adresse</t></si>' +
			'<si><r><t>a&amp;</t></r><r><t>b@hm.edu</t></r></si></sst>';
		expect(parseSharedStrings(xml)).toEqual(['E-Mail-Adresse', 'a&b@hm.edu']);
	});
});

describe('parseSheet', () => {
	it('sortiert Zellen nach Spaltenreferenz und löst shared strings auf', () => {
		const shared = ['E-Mail-Adresse', 'Gruppe', 'a@hm.edu', 'Gruppe 07'];
		// Zeile 1: Header (A1, B1); Zeile 2: A2 fehlt → leere Zelle, dann C2
		const xml =
			'<sheetData>' +
			'<row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row>' +
			'<row r="2"><c r="A2" t="s"><v>2</v></c><c r="C2" t="s"><v>3</v></c></row>' +
			'</sheetData>';
		const rows = parseSheet(xml, shared);
		expect(rows).toEqual([
			['E-Mail-Adresse', 'Gruppe'],
			['a@hm.edu', '', 'Gruppe 07']
		]);
	});
});
