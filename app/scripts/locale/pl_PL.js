(function (root) {
    'use strict';

    var Locale = (root.Locale = root.Locale || {});

    Locale.pl_PL = {
        NAME: 'APO: Photoshop',

        MSG_UNKNOWN: '- brak nazwy -',
        MSG_WAITING: 'Proszę czekać...',

        MSG_ERR_UNSUPPORTED: 'Nieobsługiwany typ pliku!',
        MSG_ERR_NO_OPEN_WINDOW: 'Nie ma żadnego otwartego okna!',
        MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW: 'Nie aktywowano okna z obrazkiem!',
        MSG_ERR_DIFFERENT_DIMENSION: 'Obrazki mają różne rozmiary',

        FILE: 'Plik',
        FILES_OPEN: 'Otwórz',
        FILE_SAVE_AS: 'Zapisz jako...',
        FILE_SAVE_AS_CONFIRM: 'Plik został zmodyfikowany. Czy chcesz zapisać zmiany?',
        FILE_CLOSE: 'Zamknij otwarte okno',
        CLOSE: 'Zamknij',

        EDIT: 'Edycja',
        EDIT_RESTORE: 'Przywróć do oryginału',

        TOOLS: 'Narzędzia',
        TOOLS_DUPLICATE: 'Duplikuj',
        TOOLS_LUT: 'Look-up Table',
        TOOLS_UOP: 'Uniwersalna operacja punktowa',
        TOOLS_SEQUENCE_ANALYZES: 'Analizuj sekwencję',
        TOOLS_STOP_MOTION_SEQUENCE: 'Sekwencja poklatkowa',

        OPERATIONS: 'Operacje',

        OPERATIONS_FLATTENING_HISTOGRAM: 'Wyrównywanie histogramu',
        OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD: 'Metoda średnich',
        OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD: 'Metoda losowa',
        OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD: 'Metoda sąsiedztwa',
        OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD: 'Metoda własna',

        OPERATIONS_ONE_POINT: 'Operacje jednopunktowe',
        OPERATIONS_ONE_POINT_NEGATIVE: 'Odwrotności (negacja)',
        OPERATIONS_ONE_POINT_THRESHOLD: '(W) Progowanie',
        OPERATIONS_ONE_POINT_POSTERIZE: '(W) Redukcja poziomów szarości',
        OPERATIONS_ONE_POINT_STRETCHING: '(W) Rozciąganie',
        OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION: '(W) Regulacja jasnością',
        OPERATIONS_ONE_POINT_CONTRAST_REGULATION: '(W) Regulacja kontrastem',
        OPERATIONS_ONE_POINT_GAMMA_REGULATION: '(W) Regulacja korekcją gamma',

        OPERATIONS_ONE_POINT_ARITHMETICAL_LOGICAL: '(W) Arytmetyczne i Logiczne',

        OPERATIONS_NEIGHBOURHOOD: 'Operacje sąsiedztwa',
        OPERATIONS_NEIGHBOURHOOD_SMOOTHING: '(W) Filtracja liniowa',
        OPERATIONS_NEIGHBOURHOOD_SHARPEN_MEDIUM: 'Filtracja medianowa',
        OPERATIONS_NEIGHBOURHOOD_SHARPEN_MINIMAL: 'Filtracja minimalna',
        OPERATIONS_NEIGHBOURHOOD_SHARPEN_MAXIMAL: 'Filtracja maksymalna',

        OPERATIONS_MORPHOLOGICAL: 'Operacje morfologiczne',
        OPERATIONS_TURTLE: 'Algorytm Żółwia',

        ABOUT: 'O programie',
        ABOUT_AUTHORS: 'Autorzy',
        ABOUT_HELP: 'Pomoc'
    };

}(this));
