# NMS Order Registration System

En moderne webapplikasjon for Norwegian Marine & Cargo Survey (NMCS) som erstatter den gamle Access-databasen med et moderne system for ordreregistrering og skipssurveyer.

## Funksjoner

- **Ordreregistrering**: Opprett og administrer surveyordrer
- **Timelog**: Registrer aktiviteter og hendelser under surveyer
- **Sampling**: Administrer prøvetaking og laboratorieanalyser
- **Remarks**: Forhåndsdefinerte merknader og maler
- **Email-integrasjon**: Automatiske ordrebekreftelser
- **Surveytyper**: Administrer forskjellige typer surveyer
- **Moderne UI**: Responsiv design med Material-UI

## Teknisk Stack

### Backend
- **Node.js** med Express.js
- **SQLite** database
- **JWT** autentisering
- **Nodemailer** for email-funksjonalitet
- **Helmet** for sikkerhet

### Frontend
- **React 18** med TypeScript
- **Material-UI (MUI)** for komponenter
- **React Router** for navigasjon
- **Axios** for API-kall
- **Day.js** for dato-håndtering

## Installasjon og Oppsett

### Forutsetninger
- Node.js (versjon 16 eller høyere)
- npm eller yarn

### 1. Klon repositoryet
```bash
git clone <repository-url>
cd NMS
```

### 2. Installer backend-avhengigheter
```bash
npm install
```

### 3. Installer frontend-avhengigheter
```bash
cd client
npm install
cd ..
```

### 4. Konfigurer miljøvariabler
Opprett en `.env`-fil i rotmappen:

```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
DB_PATH=./database.sqlite
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=post@cargosurvey.com
```

### 5. Start applikasjonen

#### Utviklingsmodus (anbefalt)
```bash
# Start backend
npm run dev

# I en ny terminal, start frontend
cd client
npm start
```

#### Produksjonsmodus
```bash
# Bygg frontend
npm run build

# Start backend (serverer også frontend)
npm start
```

## Bruk av Applikasjonen

### 1. Første gang
- Gå til `http://localhost:3000`
- Registrer en ny bruker eller logg inn
- Systemet vil automatisk opprette nødvendige databasetabeller

### 2. Hovedfunksjoner

#### Dashboard
- Oversikt over alle ordrer
- Statistikk over ordrestatus
- Rask tilgang til nye ordrer

#### Ordreregistrering
- Opprett nye surveyordrer
- Fyll inn kundeinformasjon, skip, havn
- Velg surveytype
- Spor ordrestatus

#### Timelog
- Registrer aktiviteter under surveyer
- Forhåndsdefinerte aktiviteter (auto-complete)
- Tidsstempling av hendelser
- Merknader og kommentarer

#### Sampling
- Administrer prøvetaking
- Spor prøver til laboratorier
- Registrer seglnummer
- Dokumenter prøvehåndtering

#### Email-funksjonalitet
- Automatiske ordrebekreftelser
- Tilpassede email-maler
- Integrasjon med kundekommunikasjon

## Database-struktur

Applikasjonen bruker SQLite med følgende hovedtabeller:

- **users**: Brukeradministrasjon
- **orders**: Ordreinformasjon
- **survey_types**: Typer av surveyer
- **timelog_entries**: Tidsregistrering
- **timelog_activities**: Forhåndsdefinerte aktiviteter
- **remarks_templates**: Merknadsmaler
- **sampling_records**: Prøvetakingsregistrering

## API-endepunkter

### Autentisering
- `POST /api/auth/register` - Registrer ny bruker
- `POST /api/auth/login` - Logg inn
- `GET /api/auth/verify` - Verifiser token

### Ordre
- `GET /api/orders` - Hent alle ordrer
- `POST /api/orders` - Opprett ny ordre
- `GET /api/orders/:id` - Hent spesifikk ordre
- `PUT /api/orders/:id` - Oppdater ordre
- `DELETE /api/orders/:id` - Slett ordre

### Surveytyper
- `GET /api/surveys/types` - Hent alle surveytyper
- `POST /api/surveys/types` - Opprett ny surveytype
- `PUT /api/surveys/types/:id` - Oppdater surveytype
- `DELETE /api/surveys/types/:id` - Slett surveytype

### Timelog
- `GET /api/timelog/activities` - Hent aktiviteter
- `GET /api/timelog/order/:orderId` - Hent timelog for ordre
- `POST /api/timelog` - Opprett timelog-oppføring

### Sampling
- `GET /api/sampling/order/:orderId` - Hent sampling for ordre
- `POST /api/sampling` - Opprett sampling-oppføring

### Email
- `POST /api/email/order-confirmation/:orderId` - Send ordrebekreftelse
- `POST /api/email/send` - Send tilpasset email

## Sikkerhet

- JWT-basert autentisering
- Rate limiting
- Helmet for sikkerhetsheaders
- Input-validering
- SQL injection-beskyttelse

## Utvikling

### Kode-struktur
```
NMS/
├── server.js              # Hovedserver-fil
├── config/
│   └── database.js        # Database-konfigurasjon
├── routes/                # API-ruter
├── middleware/            # Middleware-funksjoner
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React-komponenter
│   │   ├── pages/         # Sider
│   │   ├── contexts/      # React contexts
│   │   └── App.tsx        # Hovedapp
└── package.json
```

### Utviklingskommandoer
```bash
# Start backend i utviklingsmodus
npm run dev

# Start frontend
cd client && npm start

# Bygg frontend for produksjon
npm run build

# Kjør tester (hvis implementert)
npm test
```

## Deployment

### Heroku
1. Opprett Heroku-app
2. Sett miljøvariabler i Heroku dashboard
3. Deploy med Git:
```bash
git push heroku main
```

### Docker (valgfritt)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Feilsøking

### Vanlige problemer

1. **Database-feil**: Sjekk at SQLite-filen kan opprettes
2. **Email-feil**: Verifiser email-konfigurasjon
3. **CORS-feil**: Sjekk at frontend kjører på riktig port
4. **Token-feil**: Sjekk JWT_SECRET i .env

### Logger
Backend logger til konsoll. For produksjon, vurder å implementere en proper logging-løsning.

## Bidrag

1. Fork repositoryet
2. Opprett feature branch
3. Commit endringer
4. Push til branch
5. Opprett Pull Request

## Lisens

MIT License - se LICENSE-fil for detaljer.

## Kontakt

Norwegian Marine & Cargo Survey AS
Email: post@cargosurvey.com
Website: www.cargosurvey.no
