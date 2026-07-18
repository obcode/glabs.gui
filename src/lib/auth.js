// Identitäts-Helfer. glabs-web kennt **keine Rollen** — jeder Nutzer verwaltet
// nur seine eigenen Kurse (Owner-Isolation im Backend). Diese Helfer sind rein
// kosmetisch (Identität im Header anzeigen); der eigentliche Riegel ist das
// Backend.
//
// Lokal / Dev ohne Auth-Proxy liefert der Layout-Load `me = null` → es wird
// nichts angezeigt (kein Nutzer-Chip).

/**
 * @typedef {Object} Me
 * @property {string} [email]
 * @property {string} [name]
 */

/**
 * Anzeigename fürs Header-Chip: Name, sonst E-Mail.
 * @param {Me|null|undefined} me
 * @returns {string}
 */
export function displayName(me) {
	if (!me) return '';
	return me.name || me.email || '';
}
