# Relazione

Relazione del progetto _"Social Network for Music"_ per il corso _"Programmazione e linguaggi per il web"_ (a.a. 2022-2023, appello di Giugno).

Realizzata da Luca Favini (matricola 987617).

## Testing e Deploy

Istruzioni per avviare l'applicazione - **fase di testing** (react in modalità di development, backend che si riavvia ad ogni file modificato):

- Clonare il codice sorgente:
  - `git clone https://github.com/Favo02/social-network-for-music`
- Installare i node_modules sia per il `frontend` che per il `backend`:
  - `cd frontend; npm install;`
  - `cd ../backend; npm install;`
- Aggiungere file `.env` alla root della cartella `backend`:
  - `cp /path/to/.env ./backend/.env`
  - Il file contiene le seguenti variabili di ambiente:
    - `PORT`: porta su cui il backend sarà in ascolto
    - `SECRET`: parola segreta per l'hashing delle password
    - `MONGODB_URI`: server mongodb
    - `CLIENT_ID`: id per generare token spotify
    - `CLIENT_SECRET`: segreto per generare token spotify
  - _Un file `.env` completo di esempio è stato caricato su upload_
- Avviare frontend e backend (in due terminali separati):
  - `cd frontend; npm start`
  - `cd backend; npm run dev`
- Il sito sarà raggiungibile all'indirizzo `http://localhost:3000/`
- L'API sarà raggiungbile all'indirizzo `http://localhost:3003/api/`

Per generare una build per la **fase production** (codice sorgente react compilato in una versione ottimizzata di production, backend non si riavvia:

_Istruzioni per le fasi ripetute da sopra omesse_

- Clonare il codice sorgente
- Installare i node_modules sia per il `frontend` che per il `backend`
- Aggiungere il file `.env` alla root della cartella `backend`
- Generare una build di react:
  - `cd frontend; npm run build`
- Spostare la build dentro la cartella `backend`:
  - `mv -r ./frontend/build ./backend`
- Avviare il backend:
  - `cd backend; npm start`
- Il sito sarà raggiungibile all'indirizzo `http://localhost:3003`
- L'API sarà raggiungibile all'indirizzo `http://localhost:3003/api`


## Strutturra del progetto

Ho diviso il progetto in parte frontend e parte backend, completamente indipendenti, ogni parte con la propria cartella (`/frontend`, `/backend`).

### Stack tecnologico

**Frontend** (in `TypeScript`):

- `React`
- Client-side routing: `react-router`
- Styling delle pagine (css): `tailwindcss`
- Richieste HTTP: `axios`

**Backend** (in `JavaScript`):

- `Express`
- Comunicazione con il database: `mongoose`
- Gestione autorizzazioni (sessioni): `jsonwebtoken` (`JWT`)

**Database**:

- `MongoDB`

**Utilità**:

- Validazione oggetti javascript: `zod` _(backend)_
- Password hashing: `bcrypt` _(backend)_
- Linting del codice: `eslint` _(con ulteriore github action)_
- Versionamento automatiico: `gitversion` _(grazie a github action)_
- Deploy: `docker` _(automatizzato con github action)_


### Organizzazione codice

**Frontend**:

Il progetto è organizzato in più pagine, la cui navigazione è gestita lato client (`react-router`). Ogni pagina viene popolata dinamicamente con delle richieste asincrone all'API (`axios`).

Il routing delle varie pagine è gestito nel file `src/App.tsx`. Tutte le pagine sono salvate nella cartella `src/pages` ed ogni pagina è un componente `React` (a sua volta composto da altri componenti).

La richieste all'API avvengono chiamando delle funzioni specifiche chiamate servizi (`src/services`), che mandano delle richieste asincrone al backend componendo correttamente parametri ed headers.

Struttura cartelle (in `src/`):

- `assets`: contenuti statici (stili css, font, immagini)
- `components`: componenti di cui sono composte le pagine (organizzati in sottocartelle in base alla loro natura)
- `hooks`: react hook personalizzati 
- `interfaces`: interfacce che rappresentano i vari tipi di dato (Typescript)
- `pages`: pagine del sito
- `services`: servizi per scambiare dati con l'API
- `utils`: varie utilità


**Backend**:

Il backend che espone l'API è organizzato in vari router (`src/controllers`), ognuno gestisce diversi endpoint, raggruppati per natura. Tutti i router sono poi utilizzati dal server `express` (`src/app.js`) per esporre una API REST.

Struttura cartelle (in `src/`):

- `controllers`: router che gestiscono i vari endpoint
- `db`: connessione con il database
- `middlewares`: middleware (funzioni intermedie prima dei router)
- `models`: modelli di dato presenti nel database
- `spotify_utils`: utilità per comunicare con l'API di Spotify
- `utils`: varie utilità
- `validations`: utilità per validare oggetti

È anche esposto uno swagger (in development: `http://localhost:3003/api/swagger`, in production: `https://snm.favo02.dev/api/swagger`), generato ad ogni avvio del file `src/utils/swaggerGenerator.js`, che poi avvia il server da `src/index.js`


## Struttura del sito web

[Sitemap]


## Scelte implementative significative

- [Gestione generi](#gestione-generi-genres)
- [Operazioni di modifica specifiche](#operazioni-di-modifica-specifiche-follow-playlists-user-favourites-artists-genres)
- [Memorizzazione token Spotify](#memorizzazione-token-spotify)
- [Requests validation (`Zod`)](#requests-validation)


## Gestione generi

L'API di Spotify presenta diversi problemi nella gestione dei generi di canzoni (tracks) o artisti (artists):

1. Non sempre _(praticamente mai)_ viene restituito un genere nella richiesta di una canzone (sia in `/track` che in `/search`)
  - Workaround: effettuare una ulteriore richiesta all'API di Spotify, richiedendo i dettagli dell'artista della canzone ed utilizzare ed utilizzando i generi principali dell'artista come genere della canzone

2. In caso sia presente, il genere NON è limitato alla lista di generi su cui è possibile generare filtrare ricerche o generare raccomandazioni (esistono 126 generi su cui è possibile effettuare operazioni a fronte dei 1383 generi che possono essere associati ad un artista o canzone)


Per queste ragioni (soprattutto il secondo problema, a cui non ho trovato una soluzione efficace e attuabile) ho deciso semplicemente di omettere i generi nella visualizzazione di canzoni e playlist, dato che sarebbero stata un informazione praticamente inutile (oltre che molto dispendiosa da ottenere, sarebbe stata necessaria una richiesta per ogni canzone).

I generi (solo i 126 effettivamente utilizzabili) sono comunque selezionabili come generi preferiti da parte di un utente (nella pagina profilo), che contribuiscono alla personalizzazione delle raccomandazioni.


## Memorizzazione token Spotify

Ho deciso di fornire una API REST completa, che comprende anche le operazioni che includono comunicazione con Spotify, in modo che il frontend comunichi solo con il mio backend e non anche con l'API di Spotify.

Ho preso questa decisione per motivi di sicurezza: per generare un token dell'API di Spotify sono necessari due stringhe univoche (`CLIENT_ID` e `CLIENT_SECRET`) legate al mio personale account e far generare un token al frontend avrebbe significato esporre pubblicamente questi due segreti.

- Il frontend non fa mai richieste direttamente all'API di Spotify, passa sempre dal mio backend
- Il backend si occupa di gestire (generare, memorizzare e rinnovare) il token di accesso a Spotify, in modo del tutto trasparente al frontend
- Il backend salva il token in una variabile locale (`app.locals`), dato che è un informazione non persistente e che deve venir rigenerata spesso (ogni ora) non credo sia necessario utilizzare forme di memorizzazione più complesse

### Refresh token

Tutti gli endpoint `/api/spotify/...` non controllano inizialmente la presenza e validità di un token Spotify, dato che significherebbe fare una richiesta qualsiasi a Spotify (non esiste un endpoint di verifica sull'API Spotify) e controllare che la risposta sia positiva (2xx).

Viene effettuata la richiesta specifica necessaria in quel momento (quella che viene ricevuta dal frontend) e in caso di errore 401 viene generato un nuovo token e riprovata la richiesta. Vengono anche controllati eventuali ulteriori errori (in particolare 401 in caso non si riesca a generare un token valido e 429 in caso di rate limit exceeded).

_Snippet: tentativo di richiesta a spotify (ed eventuale refresh)_

```javascript
let spotifyResponse = await fetchSpotify.albums(token, query)

// invalid token: refresh spotify token and retry one time
if (spotifyResponse.status === 401) {
  const token = await generateSpotifyToken(req.app)
  spotifyResponse = await fetchSpotify.albums(token, query)
}

// check for spotify api errors after token refresh
// undefined == no errors
const errorJson = checkSpotifyError(spotifyResponse.status)

return res
  .status(spotifyResponse.status)
  // if error found return errorJson, otherwise response json
  .json(errorJson ?? await spotifyResponse.json())
```


## Requests validation

Ho implementato una validazione di tutti i possibili input dell'utente, ridondante su più livelli:

- a livello di frontend: viene bloccata la richiesta ancora prima di essere inviata al frontend (verifica di regex)
- a livello di backend: i controller degli endpoint verificano le richieste e le sanificano (`/backend/src/validations`, con il pacchetto `zod`)
- a livello di database: ogni tabella ha uno schema di oggetto che può essere inserito al suo interno, in caso si missmatch l'oggetto viene rifiutato (`/backend/src/models`)

Questo garantisce che anche se venissero mandate eventuali richieste all'API senza passare dal frontend gli input siano comunque sanificicati ed addirittura anche se in qualche modo si riuscisse ad inserire degli oggetti nel database senza passare dal backend, mongo li accetta solo correttamente composti.


### Pacchetto Zod per validazione (backend)

Per validare le richiesta lato backend ho utilizzato una libreria di parsing e validazione di oggetti: `zod`.
Questa mi permette di definire uno schema per un oggetto e verificarne la corretta composizione (operazione che in javascript è un incubo essendo un linguaggio loosely typed)

_Snippet: validazione oggetto ricevuto dall'endpoint che crea un nuovo utente_

```javascript
const CreateUserSchema = z.object({
  username: z.string().regex(regex.username, { message: regex.usernameDesc }),
  password: z.string().regex(regex.password, { message: regex.passwordDesc }),
  email: z.string().regex(regex.email, { message: regex.emailDesc })
})
```

_Snippet: verifica dello schema_

```javascript
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

Un altro grosso vantaggio di questo metodo è che con il parsing vengono automaticamente rimossi tutti i campi extra non presenti nello schema, particolarmente utile quando vanno gestiti oggetti molto complessi come quelli restituiti dall'API di Spotify.

_Snippet: parsing di una Track, vengono salvate solo le informazioni necessarie e contenute nello schema_

```javascript
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
- scelta del mio backend da proxy per API Spotify
- debouncing API calls
