/**
 * Was an den Fehler-Collector geht, für Browser und Server gleichermaßen.
 *
 * Seit Sentry 11 sammelt das SDK ohne `dataCollection` alles ein: Header, Cookies, Bodies,
 * Query-Strings, GraphQL-Variablen und die lokalen Variablen jedes Stack-Frames. Bei glabs hieße
 * das:
 *
 * - die Identität, die der Auth-Proxy setzt (`X-Remote-User` IST die E-Mail-Adresse,
 *   `X-Remote-Displayname` der Name), dazu das Login-Cookie des Proxys und `glabs_preview`;
 * - der GitLab-PAT, der als JSON-Body an `/api/token/set` geht, dort als lokale Variable
 *   `token` liegt und als GraphQL-Variable `$token` an glabs-web weiterwandert.
 *
 * Deshalb zwei Linien: `DATA_COLLECTION` schaltet das Einsammeln ab, und `scrubEvent` /
 * `scrubBreadcrumb` räumen danach noch einmal auf — für den Fall, dass eine Integration oder
 * eine spätere SDK-Version doch etwas anhängt. Ein Issue braucht Meldung, Stack, Pfad und
 * Methode; eine Person braucht es nicht.
 *
 * Strukturelle Typen statt der Sentry-eigenen: das Modul bleibt eine reine Funktion seiner
 * Eingabe und ist ohne SDK testbar.
 */

/** Ersatz für alles, was entfernt wird — dieselbe Markierung, die Sentry selbst verwendet. */
export const FILTERED = '[Filtered]';

/**
 * Was das SDK von sich aus einsammeln darf: nichts.
 *
 * `frameContextLines` bleibt beim Default — das sind Zeilen aus dem ausgelieferten Quelltext,
 * und der ist öffentlich.
 */
export const DATA_COLLECTION = {
	userInfo: false,
	cookies: false,
	httpHeaders: false,
	httpBodies: [],
	urlQueryParams: false,
	graphQL: { document: false, variables: false },
	genAI: { inputs: false, outputs: false },
	mcp: { inputs: false, outputs: false },
	databaseQueryData: false,
	queues: false,
	stackFrameVariables: false
};

/** Schneidet eine Adresse an `?` und `#` ab: der Pfad findet die Seite, der Filter darauf nicht. */
export function withoutQuery(url: string): string {
	const cut = url.search(/[?#]/);
	return cut === -1 ? url : url.slice(0, cut);
}

/**
 * Die einzigen Request-Header, die ein Event behalten darf. Eine Erlaubnis- statt einer
 * Sperrliste: der Auth-Proxy setzt je nach Konfiguration `X-Remote-*`, `X-Forwarded-Email`/
 * `-User`/`-Access-Token`, `X-Auth-Request-*`, `Authorization` oder `Remote-User`, dazu kommen
 * Cookies und Client-IPs (`X-Forwarded-For`, `X-Real-Ip`, `Forwarded`). Eine Sperrliste müsste
 * jeden davon kennen; diese Liste muss nur wissen, was harmlos ist. `referer` bleibt, aber ohne
 * Query-String.
 */
const KEPT_HEADERS = new Set([
	'accept',
	'accept-language',
	'content-length',
	'content-type',
	'referer',
	'user-agent'
]);

export function scrubHeaders(headers: { [name: string]: string }): { [name: string]: string } {
	const kept: { [name: string]: string } = {};
	for (const [name, value] of Object.entries(headers)) {
		const lower = name.toLowerCase();
		if (!KEPT_HEADERS.has(lower)) continue;
		kept[name] = lower === 'referer' ? withoutQuery(value) : value;
	}
	return kept;
}

/**
 * GitLab-Token an ihrem Präfix (PAT, Deploy-, Runner-, OAuth-, Feed-Token …). Ein ganzes
 * Präfix-Muster wie `gl[a-z]+-` träfe auch `glabs-web`, daher die Liste.
 */
const GITLAB_TOKEN =
	/\b(?:glpat|gldt|glrt|glrtr|glcbt|glptt|glft|glimt|glagent|glsoat|gloas|glffct|glwt)-[\w.-]+/g;

/** Ein JSON-Feld `"token": "…"` — fängt auch Token ohne Präfix (ältere GitLab-Instanzen). */
const TOKEN_FIELD = /("(?:token|gitlabToken|password|secret)"\s*:\s*)"(?:[^"\\]|\\.)*"/gi;

/** Bei glabs ist die Kennung die E-Mail-Adresse — jede Adresse in einem Text wird zur Lücke. */
const MAIL_ADDRESS = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

/**
 * graphql-request hängt an die Meldung jedes `ClientError` die ganze Anfrage als JSON an:
 * `<Meldung>: {"response":…,"request":{"query":…,"variables":…}}`. Die Variablen sind
 * Studierendennamen, Kurs-Konfigurationen — oder bei `setGitlabToken` der PAT.
 */
const GRAPHQL_REQUEST_TAIL = /: \{"response":[\s\S]*$/;

/**
 * `JSON.parse` zitiert in seiner Meldung den Anfang der Eingabe:
 * `Unexpected token 'g', "glpat-…" is not valid JSON`. Ein kaputter Body an `/api/token/set`
 * (`await request.json()`) wird so zur Exception mit dem Token darin — auch einem ohne Präfix.
 * Das Zitat ist nicht maskiert, kann also selbst Anführungszeichen enthalten.
 */
const JSON_PARSE_QUOTE = /, "[\s\S]*"(?:\.\.\.)? is not valid JSON/;

/** Entfernt Token, GraphQL-Anfragen, Body-Zitate und E-Mail-Adressen aus einem freien Text. */
export function scrubText(text: string): string {
	return text
		.replace(GRAPHQL_REQUEST_TAIL, `: ${FILTERED}`)
		.replace(JSON_PARSE_QUOTE, `, ${FILTERED} is not valid JSON`)
		.replace(GITLAB_TOKEN, FILTERED)
		.replace(TOKEN_FIELD, `$1"${FILTERED}"`)
		.replace(MAIL_ADDRESS, FILTERED);
}

/** Die Breadcrumb-Felder mit einer Adresse: fetch/xhr `url`, Navigation `from` und `to`. */
const URL_FIELDS = new Set(['url', 'from', 'to']);

type ScrubbableBreadcrumb = { message?: string; data?: { [key: string]: unknown } };

export function scrubBreadcrumb<B extends ScrubbableBreadcrumb>(breadcrumb: B): B {
	const scrubbed = { ...breadcrumb };
	if (typeof breadcrumb.message === 'string') scrubbed.message = scrubText(breadcrumb.message);
	if (breadcrumb.data) {
		const data: { [key: string]: unknown } = {};
		for (const [key, value] of Object.entries(breadcrumb.data)) {
			// Console-Breadcrumbs tragen die rohen Argumente zusätzlich zur fertigen Meldung —
			// auch Objekte, in die kein Textfilter hineinsieht. Die Meldung genügt.
			if (key === 'arguments') continue;
			if (typeof value !== 'string') data[key] = value;
			else data[key] = scrubText(URL_FIELDS.has(key) ? withoutQuery(value) : value);
		}
		scrubbed.data = data;
	}
	return scrubbed;
}

type ScrubbableEvent = {
	message?: string;
	logentry?: { message?: string; params?: unknown[] };
	user?: unknown;
	request?: {
		url?: string;
		query_string?: unknown;
		cookies?: unknown;
		data?: unknown;
		env?: unknown;
		headers?: { [name: string]: string };
	};
	exception?: {
		values?: Array<{
			value?: string;
			stacktrace?: { frames?: Array<{ vars?: unknown }> };
		}>;
	};
	breadcrumbs?: ScrubbableBreadcrumb[];
	extra?: { [key: string]: unknown };
};

/**
 * Die letzte Runde über ein Event, bevor es zum Collector geht (`beforeSend`).
 *
 * - `user` fällt ganz weg — glabs setzt keinen, und das SDK würde dort die Client-IP ablegen.
 * - Am Request bleiben Methode, URL ohne Query und die harmlosen Header (`scrubHeaders`);
 *   Query-String, Cookies, Body und Umgebung fallen weg.
 * - Meldungen, Exception-Texte, `extra` und Breadcrumbs verlieren Token, GraphQL-Anfragen und
 *   E-Mail-Adressen, Stack-Frames ihre lokalen Variablen.
 */
export function scrubEvent<E extends ScrubbableEvent>(event: E): E {
	const scrubbed = { ...event };
	delete scrubbed.user;
	if (typeof event.message === 'string') scrubbed.message = scrubText(event.message);
	if (event.logentry) {
		// Die Parameter einer formatierten Meldung sind Werte aus dem Programm — weg damit.
		const logentry = { ...event.logentry };
		delete logentry.params;
		if (typeof logentry.message === 'string') logentry.message = scrubText(logentry.message);
		scrubbed.logentry = logentry;
	}
	if (event.request) {
		const { url, headers } = event.request;
		const request = { ...event.request };
		delete request.query_string;
		delete request.cookies;
		delete request.data;
		delete request.env;
		if (url) request.url = withoutQuery(url);
		if (headers) request.headers = scrubHeaders(headers);
		scrubbed.request = request;
	}
	if (event.exception?.values) {
		scrubbed.exception = {
			...event.exception,
			values: event.exception.values.map((value) => ({
				...value,
				...(typeof value.value === 'string' ? { value: scrubText(value.value) } : {}),
				...(value.stacktrace?.frames
					? {
							stacktrace: {
								...value.stacktrace,
								frames: value.stacktrace.frames.map((frame) => {
									const withoutVars = { ...frame };
									delete withoutVars.vars;
									return withoutVars;
								})
							}
						}
					: {})
			}))
		};
	}
	if (event.breadcrumbs) scrubbed.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb);
	if (event.extra) {
		scrubbed.extra = Object.fromEntries(
			Object.entries(event.extra).map(([key, value]) => [
				key,
				typeof value === 'string' ? scrubText(value) : value
			])
		);
	}
	return scrubbed;
}
