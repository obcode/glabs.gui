// Vorschau-Modus: Ein Admin sieht glabs so, wie es eine nicht freigeschaltete Person
// sieht, und kann damit den ganzen Anfrage-Ablauf mit der eigenen (einzigen)
// Shibboleth-Kennung durchspielen. Der Cookie wird serverseitig in den Header
// X-Glabs-Preview übersetzt; glabs-web nimmt daraufhin dem Aufrufer die Admin-Rechte
// und beurteilt ihn nach seiner eigenen Zeile in der users-Tabelle.
//
// Der Modus kann nur Rechte wegnehmen, und nur die eigenen — deshalb braucht der
// Cookie keinen Schutz.

export const PREVIEW_COOKIE = 'glabs_preview';
