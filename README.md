# APO: Photoshop

**Temat projektu:** _Automatyczna konwersja sekwencji obrazów w odcieniach szarości, na sekwencje obrazów kolorowych._

Wszystkie wykorzystywane narzędzia są darmowe.

### Jak uruchomić aplikację?

1. Ściągamy projekt na dysk komputera https://github.com/piecioshka/apo-photoshop/archive/master.zip.
2. Rozpakowujemy paczkę z projektem `apo-photoshop`.
3. Pobieramy (paczkę zip) `node-webkit` ze strony https://github.com/rogerwang/node-webkit#downloads na nasz system operacyjny.
4. Rozpakowujemy paczkę z projektem `node-webkit`.
5. Kopiujemy zawartość projektu `apo-photoshop` to katalogu który powstał po rozpakowaniu `node-webkit`.
6. Uruchamiamy plik `nw.exe` (Window) lub `nw` (Linux) lub `node-webkit.app` (Mac OS).

## Wykorzystywane narzędzia

##### Silnik

- node.js - http://nodejs.org/
- node-webkit - https://github.com/rogerwang/node-webkit

##### Obróbka obrazów

- Canvas - http://www.w3.org/TR/2dcontext/

##### Mniejsze narzędzie pomocne

- JSHint - http://www.jshint.com/docs/options/
- Gulp - http://gulpjs.com/

## Lista zadań

- [x] Skróty klawiaturowe
- [x] Drag & drop na okienkach
- [x] Wyświetlanie histogramu
- [ ] Ćw. 1: Implementacja 3 sposobów wyrównywania histogramu + dodatkowo wymyślić jeden swój sposób na wyrównywanie.

#### Przydatne materiały odnośnie koloryzacji czarno-białych obrazów

- http://pl.wikipedia.org/wiki/Lista_czarno-bia%C5%82ych_film%C3%B3w_poddanych_koloryzacji
- http://www.cs.huji.ac.il/~yweiss/Colorization/

