// Extrahiert eine lesbare Fehlermeldung aus einem graphql-request-Fehler
// (ClientError trägt die GraphQL-Fehler unter response.errors).
/** @param {any} e */
export function gqlErrorMessage(e) {
	const errs = e?.response?.errors;
	if (Array.isArray(errs) && errs.length) {
		return errs.map((/** @type {any} */ x) => x.message).join('; ');
	}
	return e instanceof Error ? e.message : String(e);
}
