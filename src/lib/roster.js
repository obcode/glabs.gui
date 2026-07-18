// Parsen von Studierenden-/Gruppen-Listen aus Paste oder Datei-Upload.
// Unterstützt: eine E-Mail pro Zeile, CSV (Komma/Semikolon), TSV (Moodle-Export).

/** @param {string} line */
function detectDelimiter(line) {
	if (line.includes('\t')) return '\t';
	if (line.includes(';')) return ';';
	return ',';
}

/**
 * Zerlegt Text in Kopfzeile + Datenzeilen (Delimiter automatisch erkannt).
 * @param {string} text
 * @returns {{ header: string[], rows: string[][] }}
 */
export function parseTable(text) {
	const lines = (text ?? '').split(/\r?\n/).filter((l) => l.trim() !== '');
	if (lines.length === 0) return { header: [], rows: [] };
	const delim = detectDelimiter(lines[0]);
	const cells = lines.map((l) => l.split(delim).map((c) => c.trim().replace(/^"(.*)"$/, '$1')));
	return { header: cells[0], rows: cells.slice(1) };
}

/** Sieht der Wert wie eine E-Mail aus? @param {string} s */
function isEmail(s) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * Extrahiert E-Mail-Adressen aus Paste oder CSV. Gibt es eine „E-Mail"-Spalte,
 * wird nur diese genutzt; sonst wird jede Zelle geprüft, die wie eine E-Mail
 * aussieht.
 * @param {string} text
 * @returns {string[]}
 */
export function extractEmails(text) {
	const { header, rows } = parseTable(text);
	const idx = header.findIndex((h) => /mail/i.test(h));
	/** @type {string[]} */
	const out = [];
	if (idx >= 0) {
		for (const r of rows) {
			const v = (r[idx] ?? '').trim();
			if (isEmail(v)) out.push(v);
		}
	} else {
		// Kein Header-Treffer (z. B. reines Paste): jede E-Mail-artige Zelle nehmen,
		// inkl. der als „Kopfzeile" interpretierten ersten Zeile.
		for (const r of [header, ...rows]) {
			for (const c of r) {
				const v = (c ?? '').trim();
				if (isEmail(v)) out.push(v);
			}
		}
	}
	return out;
}

/**
 * Extrahiert Gruppen aus einem Moodle-Export (Spalten „Gruppe" + „E-Mail").
 * Zeilen ohne Gruppe werden übersprungen.
 * @param {string} text
 * @returns {{ name: string, members: string[] }[]}
 */
export function extractGroups(text) {
	const { header, rows } = parseTable(text);
	const emailIdx = header.findIndex((h) => /mail/i.test(h));
	// „Gruppe" exakt, nicht „Gruppenwahl"; Fallback „group".
	const groupIdx = header.findIndex((h) => /^gruppe$/i.test(h.trim()) || /^group$/i.test(h.trim()));
	if (emailIdx < 0 || groupIdx < 0) return [];

	/** @type {Record<string, string[]>} */
	const map = {};
	for (const r of rows) {
		const g = (r[groupIdx] ?? '').trim();
		const e = (r[emailIdx] ?? '').trim();
		if (!g || !isEmail(e)) continue;
		(map[g] ??= []).push(e);
	}
	return Object.entries(map).map(([name, members]) => ({ name, members }));
}

/**
 * Fügt neue E-Mails additiv hinzu (case-insensitiv dedupliziert, Reihenfolge bleibt).
 * @param {string[]} existing
 * @param {string[]} incoming
 * @returns {string[]}
 */
export function mergeEmails(existing, incoming) {
	const seen = new Set(existing.map((e) => e.toLowerCase()));
	const out = [...existing];
	for (const e of incoming) {
		const k = e.toLowerCase();
		if (!seen.has(k)) {
			seen.add(k);
			out.push(e);
		}
	}
	return out;
}

/**
 * Fügt Gruppen additiv zusammen: gleiche Gruppennamen werden vereint, Mitglieder
 * dedupliziert.
 * @param {{name:string, members:string[]}[]} existing
 * @param {{name:string, members:string[]}[]} incoming
 * @returns {{name:string, members:string[]}[]}
 */
export function mergeGroups(existing, incoming) {
	/** @type {Map<string, {name:string, members:string[]}>} */
	const byName = new Map();
	for (const g of existing) byName.set(g.name, { name: g.name, members: [...g.members] });
	for (const ng of incoming) {
		const cur = byName.get(ng.name) ?? { name: ng.name, members: [] };
		cur.members = mergeEmails(cur.members, ng.members);
		byName.set(ng.name, cur);
	}
	return [...byName.values()];
}
