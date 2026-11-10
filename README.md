<div align="center">

<img src="./icons/app-icon.png" alt="APO Photoshop icon" width="160" height="160">

# APO Photoshop 🎨

**Zamiana sekwencji obrazów w odcieniach szarości na sekwencję obrazów kolorowych.**

Desktopowa aplikacja napisana w 2014 roku na zaliczenie przedmiotu „Algorytmy przetwarzania obrazów” w WSISiZ. Oprócz koloryzacji ma histogram, operacje punktowe, filtry na maskach, operacje morfologiczne i algorytm żółwia.

<!-- prettier-ignore-start -->
[![github-ci](https://github.com/piecioshka/apo-photoshop/actions/workflows/ci.yml/badge.svg)](https://github.com/piecioshka/apo-photoshop/actions/workflows/ci.yml)
[![release](https://github.com/piecioshka/apo-photoshop/actions/workflows/release.yml/badge.svg)](https://github.com/piecioshka/apo-photoshop/actions/workflows/release.yml)
[![Release](https://img.shields.io/github/v/release/piecioshka/apo-photoshop)](https://github.com/piecioshka/apo-photoshop/releases/latest)
[![Platforms](https://img.shields.io/badge/platforms-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey)](#wymagania-)
[![NW.js](https://img.shields.io/badge/NW.js-0.117-2b5797)](https://nwjs.io/)
[![Canvas](https://img.shields.io/badge/image%20processing-Canvas%202D-orange)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://piecioshka.mit-license.org)
<!-- prettier-ignore-end -->

</div>

## Zadania z zajęć 🎓

Temat projektu, pełna lista zadań od prowadzącego, uwagi z zajęć i egzaminu oraz materiały źródłowe są w [docs/TASKS.md](docs/TASKS.md).

## Wymagania 💻

- macOS (Apple silicon lub Intel), Windows albo Linux (64-bit)

## Instalacja 📦

Pobierz plik dla swojego systemu z [ostatniego wydania](https://github.com/piecioshka/apo-photoshop/releases/latest):

| System  | Plik                                                       |
| ------- | ---------------------------------------------------------- |
| macOS   | `*-mac-arm64.zip` (Apple silicon), `*-mac-x64.zip` (Intel) |
| Windows | `*-win-x64.zip`                                            |
| Linux   | `*-linux-x64.tar.gz`                                       |

Na Windowsie i Linuksie rozpakuj archiwum i uruchom `APO Photoshop.exe` albo `APO Photoshop`.

### Pierwsze uruchomienie na macOS

Aplikacja nie jest notaryzowana przez Apple, więc macOS blokuje pierwsze uruchomienie:

1. Rozpakuj archiwum, przenieś **APO Photoshop** do Aplikacji, spróbuj ją otworzyć i zamknij ostrzeżenie.
2. Otwórz **Ustawienia systemowe** > **Prywatność i ochrona**, przewiń w dół i kliknij **Otwórz mimo to** przy APO Photoshop.
3. Potwierdź przyciskiem **Otwórz**.

Albo z Terminala:

```bash
xattr -dr com.apple.quarantine "/Applications/APO Photoshop.app"
```

macOS zapamiętuje wybór, więc kolejne uruchomienia startują normalnie.

## Współtworzenie 🛠️

Uruchamianie ze źródeł, testy, budowanie paczek i wydania opisuje [CONTRIBUTING.md](CONTRIBUTING.md).

## Licencja 📄

[The MIT License](https://piecioshka.mit-license.org) @ 2014
