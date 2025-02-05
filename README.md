# Databox Metrics Integration

To aplikacijo omogoča zajem in pošiljanje metrik iz različnih virov v Databox. Podatki se periodično pridobivajo iz vremenskega API-ja in GitHub API-ja ter se nato posredujejo v Databox preko API klicev.

## Funkcionalnosti
- **Pridobivanje vremenskih podatkov** (trenutna temperatura in vremenske razmere)
- **Pridobivanje GitHub metrik** (npr. število odprtih PR-jev, število zvezdic, itd.)
- **Obdelava in validacija podatkov** (preverjanje vrednosti in pretvorba enot)
- **Pošiljanje podatkov v Databox** s pomočjo njihovega API-ja
- **Shranjevanje metrik lokalno** v primeru napak
- **Periodično osveževanje podatkov** vsakih 60 minut s pomočjo `node-cron`

## Zahteve
- Node.js (priporočena verzija: 16 ali novejša)
- NPM
- Databox račun (uporabljen e-mail: `your-databox-email@example.com`)

## Namestitev
1. Kloniraj repozitorij:
   ```sh
   git clone https://github.com/your-repo/databox-metrics.git
   cd databox-metrics
   ```
2. Namesti odvisnosti:
   ```sh
   npm install
   ```

## Konfiguracija
Uredi `.env` datoteko in dodaj svoje API ključe:
```env
DATABOX_TOKEN=your_databox_token
WEATHER_API_KEY=your_openweathermap_api_key
GITHUB_TOKEN=your_github_personal_access_token
```

## Zagon aplikacije

Za ročni zagon:
```sh
node index.js
```

Aplikacija bo periodično osveževala metrike in jih pošiljala v Databox.

## Struktura projekta
```
/databox-metrics
│── index.js              # Glavna aplikacija
│── push_data.js          # Pošiljanje podatkov v Databox
│── weather_integration.js # Pridobivanje vremenskih podatkov
│── github_integration.js # Pridobivanje GitHub metrik
│── util/
│   └── storeMetricsLocally.js  # Shranjevanje metrik lokalno
│── package.json          # Odvisnosti in skripte
│── README.md             # Dokumentacija
```

## Dodatne informacije
Če želite prilagoditi metrike ali dodati nove vire podatkov, uredite ustrezne datoteke (`weather_integration.js`, `github_integration.js`) in poskrbite, da so nove metrike pravilno obdelane v `push_data.js`.

---


