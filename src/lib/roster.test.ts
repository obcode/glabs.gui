import { describe, it, expect } from 'vitest';
import { extractEmails, extractGroups, mergeEmails, mergeGroups } from './roster';

describe('extractEmails', () => {
	it('liest eine E-Mail pro Zeile (Paste)', () => {
		expect(extractEmails('a@hm.edu\nb@hm.edu\n\n')).toEqual(['a@hm.edu', 'b@hm.edu']);
	});
	it('nutzt die E-Mail-Spalte einer CSV', () => {
		const csv = 'Vorname,Nachname,E-Mail-Adresse,Gruppen\nHans,Meier,h@hm.edu,\nEva,Fux,e@hm.edu,';
		expect(extractEmails(csv)).toEqual(['h@hm.edu', 'e@hm.edu']);
	});
	it('ignoriert Nicht-E-Mail-Zellen', () => {
		expect(extractEmails('Name;Wert\nHans;kein-mail')).toEqual([]);
	});
});

describe('extractGroups', () => {
	it('baut Gruppen aus einem Moodle-TSV (Gruppe + E-Mail), ohne Gruppenlose', () => {
		const tsv =
			'Nachname\tVorname\tID\tE-Mail-Adresse\tGruppe\tGruppenwahl\n' +
			'Braun\tOliver\t \tob@hm.edu\t\t\n' + // keine Gruppe → übersprungen
			'Ansrlian\tSamuel\t \ts@hm.edu\tGruppe 07\t\n' +
			'Wang\tJixuan\t \tw@hm.edu\tGruppe 07\t\n' +
			'Barth\tFlorian\t \tf@hm.edu\tGruppe 06\t';
		const groups = extractGroups(tsv);
		expect(groups).toEqual([
			{ name: 'Gruppe 07', members: ['s@hm.edu', 'w@hm.edu'] },
			{ name: 'Gruppe 06', members: ['f@hm.edu'] }
		]);
	});
});

describe('mergeEmails', () => {
	it('fügt additiv hinzu und dedupliziert case-insensitiv', () => {
		expect(mergeEmails(['a@hm.edu'], ['A@HM.EDU', 'b@hm.edu'])).toEqual(['a@hm.edu', 'b@hm.edu']);
	});
});

describe('mergeGroups', () => {
	it('vereint gleiche Gruppen und dedupliziert Mitglieder', () => {
		const merged = mergeGroups(
			[{ name: 'Gruppe 01', members: ['a@hm.edu'] }],
			[
				{ name: 'Gruppe 01', members: ['A@hm.edu', 'b@hm.edu'] },
				{ name: 'Gruppe 02', members: ['c@hm.edu'] }
			]
		);
		expect(merged).toEqual([
			{ name: 'Gruppe 01', members: ['a@hm.edu', 'b@hm.edu'] },
			{ name: 'Gruppe 02', members: ['c@hm.edu'] }
		]);
	});
});
