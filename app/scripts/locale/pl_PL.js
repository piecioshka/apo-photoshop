(function (root) {
    'use strict';

    var locale = (root.locale = root.locale || {});

    locale.pl_PL = {
        NAME: 'APO: Photoshop',

        MSG_ERR_UNSUPPORTED: 'Nieobsługiwany typ pliku!',
        MSG_ERR_NO_OPEN_WINDOW: 'Nie ma żadnego otwartego okna!',
        MSG_ERR_NOT_SELECT_ANY_PICTURE_WINDOW: 'Nie aktywowano okna z obrazkiem!',

        FILE: 'Plik',
        FILES_OPEN: 'Otwórz',
        FILE_CLOSE: 'Zamknij otwarte okno',
        CLOSE: 'Zamknij',

        EDIT: 'Edycja',
        EDIT_RESTORE: 'Przywróć',

        BOX: 'Okno',
        BOX_HISTOGRAM: 'Histogram',
        BOX_LUT_UOP: 'Tablica LUT (UOP)',
        BOX_DUPLICATE: 'Duplikuj',

        OPERATIONS: 'Operacje',

        OPERATIONS_FLATTENING_HISTOGRAM: 'Wyrównywanie histogramu',
        OPERATIONS_FLATTENING_HISTOGRAM_MEDIUM_METHOD: 'Metoda średnich',
        OPERATIONS_FLATTENING_HISTOGRAM_RANDOM_METHOD: 'Metoda losowa',
        OPERATIONS_FLATTENING_HISTOGRAM_NEIGHBOURHOOD_METHOD: 'Metoda sąsiedztwa',
        OPERATIONS_FLATTENING_HISTOGRAM_CUSTOM_METHOD: 'Metoda własna',

        OPERATIONS_ONE_POINT: 'Operacje jednopunktowe',
        OPERATIONS_ONE_POINT_NEGATIVE: 'Odwrotności (negacja)',
        OPERATIONS_ONE_POINT_THRESHOLD: 'Progowanie',
        OPERATIONS_ONE_POINT_POSTERIZE: 'Redukcja poziomów szarości',
        OPERATIONS_ONE_POINT_STRETCHING: 'Rozciąganie',
        OPERATIONS_ONE_POINT_BRIGHTNESS_REGULATION: 'Regulacja jasnością',
        OPERATIONS_ONE_POINT_CONTRAST_REGULATION: 'Regulacja kontrastem',
        OPERATIONS_ONE_POINT_GAMMA_REGULATION: 'Regulacja korekcją gamma',

        OPERATIONS_ONE_POINT_ARITHMETIC: 'Arytmetyczne',
        OPERATIONS_ONE_POINT_LOGICAL: 'Logiczne',

        OPERATIONS_NEIGHBOURHOOD: 'Operacje sąsiedztwa',
        OPERATIONS_NEIGHBOURHOOD_SMOOTHING: 'Filtracja liniowa (wygładzanie)',
        OPERATIONS_NEIGHBOURHOOD_SHARPEN: 'Filtracja medianowa (wyostrzanie)',
        OPERATIONS_NEIGHBOURHOOD_EDGE_DETECTION: 'Detekcja krawędzi',

        ABOUT: 'O programie',
        ABOUT_AUTHORS: 'Autorzy',
        ABOUT_HELP: 'Pomoc'
    };

}(this));
