# Supabase Verbindung einrichten

## 1. Supabase Projekt erstellen

1. Gehen Sie zu [supabase.com](https://supabase.com)
2. Erstellen Sie ein kostenloses Konto
3. Klicken Sie auf "New Project"
4. Wählen Sie eine Organisation aus oder erstellen Sie eine neue
5. Geben Sie einen Projektnamen ein (z.B. "persona-generator")
6. Erstellen Sie ein starkes Datenbankpasswort
7. Wählen Sie eine Region aus (Europa für bessere Performance)
8. Klicken Sie auf "Create new project"

## 2. Projekt-Credentials abrufen

Nach der Erstellung des Projekts:

1. Gehen Sie zu **Settings** → **API**
2. Kopieren Sie folgende Werte:
   - **Project URL** (beginnt mit https://[projekt-id].supabase.co)
   - **anon/public Key** (der öffentliche Schlüssel)

## 3. Umgebungsvariablen konfigurieren

Erstellen Sie eine `.env` Datei im Hauptverzeichnis:

```bash
# Supabase Konfiguration
VITE_SUPABASE_URL=https://[ihre-projekt-id].supabase.co
VITE_SUPABASE_ANON_KEY=[ihr-anon-key]

# Destatis API (bereits vorhanden)
VITE_DESTATIS_API_KEY=9ce3ff1522b84af5bc2824dc6524b16d
```

**Wichtig:** Ersetzen Sie `[ihre-projekt-id]` und `[ihr-anon-key]` mit Ihren echten Werten!

## 4. Datenbank-Schema erstellen

1. Gehen Sie in Supabase zu **SQL Editor**
2. Klicken Sie auf "New Query"
3. Kopieren Sie den Inhalt der Datei `supabase/migrations/2025_create_personas.sql`
4. Fügen Sie ihn ein und klicken Sie auf "Run"

Alternativ können Sie die Migration auch über das Terminal ausführen:

```bash
# Supabase CLI installieren (falls noch nicht installiert)
npm install -g supabase

# Mit Ihrem Projekt verbinden
supabase link --project-ref [ihre-projekt-id]

# Migration ausführen
supabase db push
```

## 5. Row Level Security (RLS) aktivieren

Die Migration aktiviert automatisch RLS, aber Sie können es überprüfen:

1. Gehen Sie zu **Authentication** → **Policies**
2. Stellen Sie sicher, dass Policies für die `personas_pg2024` Tabelle existieren
3. Die Policies sollten Benutzern nur Zugriff auf ihre eigenen Daten gewähren

## 6. Authentifizierung konfigurieren

1. Gehen Sie zu **Authentication** → **Settings**
2. Stellen Sie sicher, dass **Enable email confirmations** ausgeschaltet ist (für Entwicklung)
3. Optional: Konfigurieren Sie E-Mail-Templates unter **Email Templates**

## 7. Verbindung testen

1. Starten Sie Ihre Anwendung: `npm run dev`
2. Klicken Sie auf "Anmelden" in der Navigation
3. Registrieren Sie sich mit einer Test-E-Mail
4. Nach erfolgreicher Registrierung sollten Sie angemeldet sein
5. Erstellen Sie eine Persona - sie wird automatisch in Supabase gespeichert

## 8. Verbindungsstatus prüfen

Die App zeigt automatisch den Verbindungsstatus an:
- **Cloud**: Supabase ist verbunden
- **Lokal**: Nur localStorage wird verwendet

## Fehlerbehebung

### Problem: "Supabase credentials not found"
- Überprüfen Sie die `.env` Datei
- Stellen Sie sicher, dass die Variablen mit `VITE_` beginnen
- Starten Sie den Entwicklungsserver neu: `npm run dev`

### Problem: "Failed to initialize Supabase client"
- Überprüfen Sie die Project URL (muss mit https:// beginnen)
- Überprüfen Sie den anon Key (sollte ein langer String sein)

### Problem: "Row Level Security" Fehler
- Führen Sie die Migration erneut aus
- Überprüfen Sie, dass RLS Policies existieren

### Problem: Personas werden nicht gespeichert
- Überprüfen Sie, dass Sie angemeldet sind
- Schauen Sie in die Browser-Konsole nach Fehlermeldungen
- Überprüfen Sie die Supabase-Logs im Dashboard

## Produktions-Deployment

Für die Produktion:

1. Fügen Sie die Umgebungsvariablen zu Ihrem Hosting-Provider hinzu
2. Stellen Sie sicher, dass die Domain in den Supabase Auth-Einstellungen erlaubt ist
3. Aktivieren Sie E-Mail-Bestätigungen für Produktions-Registrierungen

## Lokale Entwicklung ohne Supabase

Falls Supabase nicht verfügbar ist, funktioniert die App weiterhin:
- Alle Daten werden in localStorage gespeichert
- Keine Benutzer-Authentifizierung
- Alle Funktionen bleiben verfügbar

## Kosten

- Supabase Free Tier beinhaltet:
  - 500MB Datenbank
  - 50,000 monatliche aktive Benutzer
  - 2GB Bandbreite
  - Das ist für die meisten Persona-Generator Anwendungen ausreichend