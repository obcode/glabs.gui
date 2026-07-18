// GUI-Version + Build-Zeitpunkt für den Footer. Beide Werte werden von Vite via
// `define` (siehe vite.config.js) zur Buildzeit als String-Literale eingesetzt.
// Universeller Load (kein Backend nötig) — das Auth-Gate und die `me`-Query
// folgen im nächsten Schritt.
export const load = () => {
	return {
		guiVersion: __APP_VERSION__,
		buildTime: __BUILD_TIME__
	};
};
