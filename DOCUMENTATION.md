# Documentazione

Documentazione ancora **MOOOOLTO work in progress**.

## Scelte implementative significative

- [Gestione generi](#gestione-generi-genres)
- [Operazioni di modifica specifiche](#operazioni-di-modifica-specifiche-follow-playlists-user-favourites-artists-genres)
- [Memorizzazione token spotify](#memorizzazione-token-spotify)
- [Requests validation (`Zod`)](#requests-validation)


## Argomenti da aggiungere:

- strategia duplicazione (dato che siamo su nosql)
- organizzazione progetto:
  - backend
    - controllers
    - models
    - validations
  - frontend
    - components
    - pages
    - services
    - routing
- deploy
- scelta del mio backend da proxy per api spotify
- debouncing API calls


## Gestione generi (genres)

L'API di Spotify non fornisce alcun endpoint relativo a generi, ho trovato una sorgente di dati [da github](https://gist.github.com/andytlr/4104c667a62d8145aa3a).

Inizialmente l'idea era quella di memorizzare i generi nel database, ma a quale pro? Non verranno mai aggiunti, modificati o rimossi generi. Tanto vale lasciarli in un file (`utils/genres.json`) che viene importato dal controller che fornisce l'endpoint `/genres`. Un altro vantaggio di questa soluzione è la possibilità di far partire l'applicazione col database vuoto, senza dover importare la collezione `genres`.


## Operazioni di modifica specifiche: Follow playlists, User favourites artists, genres

Sarebbe stato possibile implementare alcune operazioni di modifica specifiche, come il follow di una playlist o la modifica degli artisti e generi preferiti di un utente attraverso la generica `PATCH` `/users/edit` o `PATCH` `/playlists/edit`, ma ho preferito aggiungere degli specifici endpoint `PATCH` `/users/favourite***` e `POST` `/playlists/:id/follow` per eseguire solamente queste operazioni.

Ho fatto questa scelta in quanto gli endpoint "generici" `/edit` sono pensati per modificare i dettagli significativi di una playlist o dell'utente e non per operazioni specifiche e molto comuni come un follow.

Questa scelta comporta anche una forte semplificazione di entrambi i controller coinvolti (sia il generico edit che lo specifico follow).


## Memorizzazione token spotify

Avevo qualche dubbio su come gestire il token per l'api di spotify.

- Il frontend non fa mai richieste direttamente all'API di spotify, ma passa sempre dal mio backend, perchè far memorizzare il token spotify (oltre al token JWT di accesso al backend) al frontend quando serve solo al backend?
- Come gestire un token scaduto? La cosa migliore sarebbe renderlo del tutto trasparente al frontend, il backend lo aggiorna ed effettua la richiesta, in caso il token fosse memorizzato dal frontend andrebbe aggiornato lato browser, quindi sarebbe necessario controllare ogni risposta del backend e controllare se c'è anche un token spotify da memorizzare nel browser.

Insomma tanti problemi per quale vantaggio? Quindi ho deciso di salvarlo come variabile locale del backend (express `app.locals`), nonostante non sia proprio una cosa comune ed utilizzatissima, ma credo fosse accettabile per questo caso d'uso.

### Refresh token

Tutti gli endpoint `/api/spotify/...` non controllano inizialmente la presenza e validità di un token spotify, dato che significherebbe fare una richiesta qualsiasi a spotify (non esiste un endpoint di verifica sull'api spotify).
Viene effettuata la richiesta che il frontend richiede e in caso di errore 401 viene generato un nuovo token. Viene poi riprovata la richiesta e controllati eventuali ulteriori errori (in particolare 401 in caso non si riesca a generare un token valido e 429 in caso di rate limit exceeded).


## Requests validation

Ho cercato di effettuare una validazione di tutti gli input dell'utente su più livelli:

- a livello di frontend: viene bloccata la richiesta ancora prima di essere inviata al frontend
- a livello di backend: i controller degli endpoint verificano le richieste e le sanificano
- a livello di database: ogni tabella ha uno schema di oggetto che può essere inserito al suo interno, in caso si missmatch l'oggetto viene rifiutato

Questo garantisce che anche se venissero mandate eventuali richieste all'api senza passare dal frontend gli input siano comunque sanificicati ed addirittura anche se in qualche modo si riuscisse ad inserire degli oggetti nel database senza passare dal backend, mongo li accetta solo correttamente composti.


### Pacchetto Zod per validazione (backend)

Per validare le richiesta lato backend ho utilizzato una libreria di parsing e validazione di oggetti: `zod`.
Questa mi permette di definire uno schema per un oggetto e verificarne la corretta composizione (cosa che in javascript è un incubo essendo un linguaggio loosely typed)

Snippet: validazione oggetto ricevuto dall'endpoint che crea un nuovo utente

```
const CreateUserSchema = z.object({
  username: z.string().regex(regex.username, { message: regex.usernameDesc }),
  password: z.string().regex(regex.password, { message: regex.passwordDesc }),
  email: z.string().regex(regex.email, { message: regex.emailDesc })
})
```

Snippet: verifica dello schema

```
try {
  const parsed = CreateUserSchema.parse(input)
  return { valid: true, parsed }
}
catch(e) {
  const message = e instanceof z.ZodError
    ? `: ${generateErrorMessage(e.errors, formatterOptions)}` // formattare errore
    : ""

  return { valid: false, message }
}
```

Un altro grosso vantaggio di questo metodo è che con il parsing vengono automaticamente rimossi tutti i campi extra non presenti nello schema, particolarmente utile quando vanno gestiti oggetti molto complessi come quelli restituiti dall'api di spotify.

Snippet: parsing di una Track, vengono salvate solo le informazioni necessarie e contenute nello schema

```
const { track } = req.body

// validate
const { valid, message, parsed } = validateTrack(track)
if (!valid) {
  return res.status(400).json({ error: `Invalid track${message}` })
}

...

playlist.tracks.push(parsed) // oggetto parsato, senza campi inutili o addirittura "malevoli"
const savedPlaylist = await playlist.save()
```

_Ho utilizzato la tecnica del parsing solo con gli oggetti restituiti da spotify, mentre in tutti gli altri controller ho preferito effettuare un destructuring della richiesta, estraendo solo i campi significativi e poi sanificando solo questi (sempre con zod). Questo perchè spesso è necessario prima effettuare dei controlli su campi specifici, solo una questione di comodità, ma il risultato è lo stesso: campi extra scartati e campi necessari sanificati_

Snippet: sanificazione senza parsing (ma con destructuring)

```
const {
  username,
  password,
  email
} = req.body // destructuring body della richiesta (campi extra persi)

// validazione
const { valid, message } = validateCreateUser({ username, password, email })
if (!valid) {
  return res.status(400).json({ error: `Invalid user${message}` })
}

// da qui in poi username, password ed email sanificati
```
