// Feste Zeitzone/Locale (Europe/Berlin, de-DE), damit SSR und Client identisch
// rendern.
const dtf = new Intl.DateTimeFormat('de-DE', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	timeZone: 'Europe/Berlin'
});

/**
 * Einen ISO-/RFC3339-Zeitstempel als „TT.MM.JJJJ, HH:MM" formatieren.
 * @param {string|null|undefined} iso
 * @returns {string}
 */
export function formatDateTime(iso) {
	if (!iso) return '';
	const d = new Date(iso);
	if (isNaN(d.getTime())) return '';
	return dtf.format(d);
}
