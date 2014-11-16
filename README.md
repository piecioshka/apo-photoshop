# <img src="/images/wsisiz.png" align="top" alt="WSISIZ" /> APO: Photoshop

**Temat projektu:** _Automatyczna konwersja sekwencji obrazów w odcieniach szarości, na sekwencje obrazów kolorowych._

## Jak uruchomić aplikację?

### Z użyciem przeglądarki

1. Ściągamy projekt na dysk komputera https://github.com/piecioshka/apo-photoshop/archive/master.zip.
2. Rozpakowujemy paczkę z projektem `apo-photoshop`.
3. Pobieramy (paczkę zip) `node-webkit` ze strony https://github.com/rogerwang/node-webkit#downloads na nasz system operacyjny.
4. Rozpakowujemy paczkę z projektem `node-webkit`.
5. Kopiujemy zawartość projektu `apo-photoshop` to katalogu który powstał po rozpakowaniu `node-webkit`.
6. Uruchamiamy plik `nw.exe` (Windows) lub `nw` (Linux) lub `node-webkit.app` (Mac).

### Z użyciem konsoli (dla programistów)

```
$ git clone https://github.com/piecioshka/apo-photoshop.git
$ cd apo-photoshop
$ npm install
$ npm start
```

## Wykorzystywane narzędzia

#### Silnik

- node.js - http://nodejs.org/
- node-webkit - https://github.com/rogerwang/node-webkit

#### Obróbka obrazów

- Canvas - http://www.w3.org/TR/2dcontext/

#### Inne pomocne narzędzia

- Gulp - http://gulpjs.com/
- Underscore.js - http://underscorejs.org/
- MoveMaster.js - https://github.com/piecioshka/MoveMaster.js
- JSHint - http://www.jshint.com/docs/options/

Wszystkie wykorzystywane narzędzia są darmowe.

## Lista zadań

- [x] Skróty klawiaturowe
- [x] Słowniki tłumaczeń
- [x] Drag & drop na oknach
- [x] Wyświetlanie histogramu
- [x] Ćw. 1
    - Zadanie 1
        - [x] Metoda średnich
        - [x] Metoda losowa
        - [x] Metoda sąsiedztwa
        - [x] Dodatkowo wymyślić jeden swój sposób
- [ ] Ćw. 2
    - Zadanie 1
        - [x] Operacja odwrotności (negacji)
        - [x] Operacja progowania (binaryzacji)
        - [ ] Operacja redukcji poziomów szarości
        - [ ] Operacja rozciągania
        - [ ] Regulacja kontrastem
        - [ ] Regulacja jasnością
        - [ ] Regulacja korekcją gamma
    - Zadanie 2
        - [ ] Uniwersalna operacja punktowa jednoargumentowa (oparta na tablicy LUT z możliwością zadawania parametrów w sposób interakcyjny (np. poprzez modyfikację postaci graficznej Uniwersalnego Operatora Punktowego)).
        - [ ] Tablica LUT
    - Zadanie 3
        - [ ] Typowe operacje punktowe dwu i wieloargumentowe (arytmetyczne (ADD, SUB,...) i logiczne (OR, AND, XOR,...) ).
- [ ] Ćw. 3
    - Zadanie 1
        - [ ] Operacje wygładzania liniowego oparte na 4 typowych maskach wygładzania, wyostrzania liniowego oparte na 4 maskach laplasjanowych, detekcji krawędzi oparte na 3 maskach detekcji krawędzi.
        - [ ] Uniwersalna operacja liniowa (wygładzanie i wyostrzanie oparte na masce 3x3 o wartościach zadawanych w sposób interakcyjny).
        *Uwaga: zastosować opcjonalnie znane metody operacji na skrajnych wierszach i kolumnach obrazu oraz 3 metody skalowania (w przypadku operacji wyostrzania)*
    - Zadanie 2
        - [ ] Uniwersalna operacja medianowa (otoczenie 3x3, 3x5, 5x5, 7x7 itd.).
        *Uwaga: zastosować opcjonalnie znane metody operacji na skrajnych wierszach i kolumnach obrazu.*
    - Zadanie 3
        - [ ] Uniwersalna operacja logiczna wygładzania (kierunek 0, 1, 2, 3 ).
        *Uwaga: zastosować opcjonalnie wybrane metody operacji na skrajnych wierszach i kolumnach obrazu.*
    - Zadanie 4
        - [ ] Operacje wyostrzania gradientowego (2 maski uniwersalne, 2 maski Robertsa, 2 maski Sobela).
        *Uwaga: zastosować opcjonalnie wybrane metody operacji na skrajnych wierszach i kolumnach obrazu oraz 3 metody skalowania*
- [ ] Ćw. 4
    - Zadanie 1
        - [ ] Operacja liniowa sąsiedztwa oparta na masce 5x5 utworzonej na podstawie dwóch masek 3x3 użytych w dwuetapowej (1-szy etap – wygładzanie, 2-gi etap – wyostrzanie) operacji filtracji. Opracowaną aplikację przetestować na wybranych obrazach i porównać wyniki otrzymane przy użyciu maski 5x5 z wynikami uzyskanymi przy użyciu kolejno dwóch masek 3x3. Uwaga: zastosować opcjonalnie 5 znanych z wykładu metod operacji na skrajnych wierszach i kolumnach obrazu oraz 3 znane metody skalowania (proporcjonalna, trójwartościowa, obcinająca).
    - Zadanie 2
        - [ ] Korzystając z podanego na wykładzie algorytmu ścieniania zrealizować program przekształcający utworzony obiekt, np. literę (lub 2 litery – np. inicjały wykonawcy) w szkielet (szkielety).
    - Zadanie 3
        - [ ] Operacje erozji, dylatacji, otwarcia, zamknięcia dla dwóch przypadków elementu strukturalnego:
            - [ ] a) romb (czterosąsiedztwo)
            - [ ] b) kwadrat (ośmiosąsiedztwo)

- [x] Duplikacja aktywnego okna
- [ ] Resize okna
- [x] Przywróć obrazek do pierwotnego stanu
- [x] Zamknięcie programu

#### Przydatne materiały odnośnie koloryzacji obrazów w odcieniach szarości

- http://pl.wikipedia.org/wiki/Lista_czarno-bia%C5%82ych_film%C3%B3w_poddanych_koloryzacji
- http://www.cs.huji.ac.il/~yweiss/Colorization/
