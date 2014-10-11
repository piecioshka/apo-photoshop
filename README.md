# APO: Photoshop

**Temat projektu:** _Automatyczna konwersja sekwencji obrazów w odcieniach szarości, na sekwencje obrazów kolorowych._

Wszystkie wykorzystywane narzędzia są darmowe.

### Jak uruchomić aplikację?

1. Ściągamy projekt na dysk komputera https://github.com/piecioshka/apo-photoshop/archive/master.zip.
2. Rozpakowujemy paczkę z projektem `apo-photoshop`.
3. Pobieramy (paczkę zip) `node-webkit` ze strony https://github.com/rogerwang/node-webkit#downloads na nasz system operacyjny.
4. Rozpakowujemy paczkę z projektem `node-webkit`.
5. Kopiujemy zawartość projektu `apo-photoshop` to katalogu który powstał po rozpakowaniu `node-webkit`.
6. Uruchamiamy plik `nw.exe` (Windows) lub `nw` (Linux) lub `node-webkit.app` (Mac).

## Wykorzystywane narzędzia

##### Silnik

- node.js - http://nodejs.org/
- node-webkit - https://github.com/rogerwang/node-webkit

##### Obróbka obrazów

- Canvas - http://www.w3.org/TR/2dcontext/

##### Inne pomocne narzędzia

- JSHint - http://www.jshint.com/docs/options/
- Gulp - http://gulpjs.com/
- Underscore.js - http://underscorejs.org/
- MoveMaster.js - https://github.com/piecioshka/MoveMaster.js

## Lista zadań

- [x] Skróty klawiaturowe
- [x] Słowniki tłumaczeń
- [x] Drag & drop na oknach
- [x] Wyświetlanie histogramu
- [ ] Ćw. 1: Implementacja 3 sposobów wyrównywania histogramu + dodatkowo wymyślić jeden swój sposób na wyrównywanie.
- [x] Duplikacja aktywnego okna
- [ ] Resize okna

#### Przydatne materiały odnośnie koloryzacji obrazów w odcieniach szarości

- http://pl.wikipedia.org/wiki/Lista_czarno-bia%C5%82ych_film%C3%B3w_poddanych_koloryzacji
- http://www.cs.huji.ac.il/~yweiss/Colorization/

