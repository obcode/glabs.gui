// Identitäts-Helfer. glabs-web kennt **keine Rollen** — jeder Nutzer verwaltet
// nur seine eigenen Kurse (Owner-Isolation im Backend). Diese Helfer sind rein
// kosmetisch (Identität im Header anzeigen); der eigentliche Riegel ist das
// Backend.
//
// Lokal / Dev ohne Auth-Proxy liefert der Layout-Load `me = null` → es wird
// nichts angezeigt (kein Nutzer-Chip).

export interface Me {
	email?: string;
	name?: string;
}

/**
 * Anzeigename fürs Header-Chip: Name, sonst E-Mail.
 */
export function displayName(me: Me | null | undefined): string {
	if (!me) return '';
	return me.name || me.email || '';
}
