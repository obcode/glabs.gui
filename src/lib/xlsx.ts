// Minimaler xlsx-Reader: entpackt die Datei (fflate) und liest das erste
// Arbeitsblatt in eine TSV-Zeichenkette, die dann durch dieselbe Tabellen-Logik
// wie CSV/Moodle-Exporte läuft ($lib/roster). Bewusst klein und ohne schwere
// Fremd-Lib; deckt einfache Grids (Moodle-/Excel-Export) ab.

import { unzipSync, strFromU8 } from 'fflate';

function unescapeXml(s: string) {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;|&#39;/g, "'")
		.replace(/&amp;/g, '&');
}

/**
 * Spaltenreferenz („B12") → 0-basierter Spaltenindex.
 */
export function colToIndex(ref: string) {
	const m = ref.match(/^([A-Z]+)/);
	if (!m) return 0;
	let n = 0;
	for (const ch of m[1]) n = n * 26 + (ch.charCodeAt(0) - 64);
	return n - 1;
}

/**
 * Parst sharedStrings.xml → Array der Strings (Rich-Text-Läufe zusammengefügt).
 */
export function parseSharedStrings(xml: string): string[] {
	const out: string[] = [];
	const siRe = /<si>([\s\S]*?)<\/si>/g;
	let m: RegExpExecArray | null;
	while ((m = siRe.exec(xml))) {
		const texts = [...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => unescapeXml(t[1]));
		out.push(texts.join(''));
	}
	return out;
}

/**
 * Parst ein Arbeitsblatt-XML → Zeilen aus Zellwerten (nach Spaltenindex einsortiert).
 */
export function parseSheet(xml: string, shared: string[]): string[][] {
	const rows: string[][] = [];
	const rowRe = /<row[^>]*>([\s\S]*?)<\/row>/g;
	let rm: RegExpExecArray | null;
	while ((rm = rowRe.exec(xml))) {
		const cells: string[] = [];
		const cRe = /<c\s+([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g;
		let cm: RegExpExecArray | null;
		while ((cm = cRe.exec(rm[1]))) {
			const attrs = cm[1];
			const inner = cm[2] ?? '';
			const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1];
			const idx = ref ? colToIndex(ref) : cells.length;
			const t = (attrs.match(/t="([^"]+)"/) || [])[1];
			const vm = inner.match(/<v>([\s\S]*?)<\/v>/);
			let val = '';
			if (t === 's' && vm) {
				val = shared[parseInt(vm[1], 10)] ?? '';
			} else if (t === 'inlineStr') {
				const is = inner.match(/<t[^>]*>([\s\S]*?)<\/t>/);
				val = is ? unescapeXml(is[1]) : '';
			} else if (vm) {
				val = unescapeXml(vm[1]);
			}
			while (cells.length < idx) cells.push('');
			cells[idx] = val;
		}
		rows.push(cells);
	}
	return rows;
}

/**
 * Liest das erste Arbeitsblatt einer xlsx-Datei als TSV.
 */
export function xlsxToTsv(buf: ArrayBuffer): string {
	const files = unzipSync(new Uint8Array(buf));
	const ss = files['xl/sharedStrings.xml'];
	const shared = ss ? parseSharedStrings(strFromU8(ss)) : [];

	const sheetPath =
		Object.keys(files).find((p) => p === 'xl/worksheets/sheet1.xml') ||
		Object.keys(files)
			.filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))
			.sort()[0];
	if (!sheetPath) return '';

	const rows = parseSheet(strFromU8(files[sheetPath]), shared);
	return rows.map((r) => r.join('\t')).join('\n');
}
