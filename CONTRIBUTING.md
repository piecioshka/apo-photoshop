# Dla programistów 🛠️

## Wymagania

- Node.js z `.nvmrc`
- macOS do budowania paczek macOS (podpis robi `codesign`)

## Uruchomienie

```bash
git clone https://github.com/piecioshka/apo-photoshop.git
cd apo-photoshop
npm install
npm start
```

`npm start` pobiera NW.js 0.117 do `cache/` i uruchamia aplikację ze źródeł.

## Skrypty

| Komenda               | Co robi                                                         |
| --------------------- | --------------------------------------------------------------- |
| `npm start`           | Uruchamia aplikację ze źródeł w NW.js                           |
| `npm run build`       | Paczki na wszystkie systemy do `dist/`                          |
| `npm run build:mac`   | Oba cele macOS (`osx-arm64`, `osx-x64`)                         |
| `npm run build:win`   | Windows (`win-x64`)                                             |
| `npm run build:linux` | Linux (`linux-x64`)                                             |
| `npm test`            | Testy jednostkowe (Jasmine) w Chrome bez okna                   |
| `npm run test:serve`  | Te same testy pod adresem z konsoli, do podglądu w przeglądarce |
| `npm run count`       | Liczba linii w `app/scripts/core`                               |

Wybrane cele: `npm run build -- osx-arm64 win-x64` (dostępne: `osx-arm64`, `osx-x64`, `win-x64`, `linux-x64`). Paczka macOS dostaje podpis ad hoc, bez niego macOS zgłasza, że aplikacja jest uszkodzona. Podpis robi `codesign`, więc paczkę macOS zbudujesz tylko na macOS. Paczki Windows i Linux budują się na macOS i na Linuksie.

## Struktura

| Ścieżka                        | Co zawiera                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `app/index.html`               | Punkt wejścia aplikacji NW.js (`main` w `package.json`)                                                        |
| `app/scripts/core/operations/` | Operacje na obrazach: punktowe, sąsiedztwa, morfologiczne, wyrównanie histogramu, koloryzacja, algorytm żółwia |
| `app/scripts/core/windows/`    | Okna aplikacji i `WindowManager`                                                                               |
| `app/scripts/core/models/`     | Canvas, menu, operacje, tłumaczenia                                                                            |
| `app/scripts/core/file/`       | Otwieranie i zapisywanie obrazów                                                                               |
| `app/scripts/locale/`          | Słownik tłumaczeń (`pl_PL.js`)                                                                                 |
| `app/scripts/vendor/`          | Biblioteki dołączone do repo                                                                                   |
| `scripts/build.mjs`            | Budowanie paczek przez nw-builder                                                                              |
| `test/`                        | Testy Jasmine                                                                                                  |
| `pictures/`                    | Przykładowe obrazy i sekwencje                                                                                 |

## Testy

```bash
npm test
```

## CI i wydania

Workflow `.github/workflows/ci.yml` uruchamia testy przy każdym pushu i pull requeście.

`.github/workflows/release.yml` buduje paczki: macOS na `macos-latest` (`npm run build:mac`), Windows i Linux na `ubuntu-latest` (`npm run build:win`, `npm run build:linux`). Uruchomiony ręcznie z zakładki Actions tylko zapisuje paczki jako artefakty.

Wydanie:

```bash
npm version patch
git push --follow-tags
```

`npm version` podbija wersję w `package.json` i tworzy tag `vX.Y.Z`. Wypchnięty tag uruchamia workflow release: job `release` sprawdza, czy tag zgadza się z wersją w `package.json`, i publikuje paczki jako wydanie na GitHubie.

## Wykorzystywane narzędzia

### Silnik

- NW.js - https://nwjs.io/
- nw-builder - https://github.com/nwutils/nw-builder

### Obróbka obrazów

- Canvas - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

### Testy

- Jasmine - https://jasmine.github.io/
- jasmine-browser-runner - https://github.com/jasmine/jasmine-browser-runner

### Inne pomocne narzędzia

- Underscore.js - https://underscorejs.org/
- Underscore.assert.js - https://github.com/piecioshka/underscore.assert.js
- MoveMaster.js - https://github.com/piecioshka/move-master.js
- promise.js - https://github.com/stackp/promisejs

Wszystkie wykorzystywane narzędzia są darmowe.
