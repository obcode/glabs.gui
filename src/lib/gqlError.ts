// Extrahiert eine lesbare Fehlermeldung aus einem graphql-request-Fehler
// (ClientError trägt die GraphQL-Fehler unter response.errors).
export function gqlErrorMessage(e: unknown): string {
	const errs = (e as { response?: { errors?: Array<{ message: string }> } })?.response?.errors;
	if (Array.isArray(errs) && errs.length) {
		return errs.map((x) => x.message).join('; ');
	}
	return e instanceof Error ? e.message : String(e);
}
