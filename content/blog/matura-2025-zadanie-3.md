---
title: "Matura 2025 zadanie 3"
description: "Solution walkthrough for Matura 2025 task 3 in C++: vector geometry, GCD, and file I/O patterns for the exam."
date: "2025-03-01"
tags:
  - "C++"
  - "Matura"
  - "Algorithms"
---

# Matura 2025 zadanie 3

```cpp
#include <iostream>
#include <vector>
#include <fstream>
#include <string>
using namespace std;

// struct definiuje strukturę danych dla pojedynczego punktu
struct Vector2i {
    int x;
    int y;
    // Metoda pozwoli na szybką konwersję punktu do string-a
    std::string to_string() {
        return "(" + std::to_string(this->x) + ", " + std::to_string(this->y) + ')';
    }
};

// Największy wspólny dzielnik z definicji
// Istnieje szybsza metoda wyznaczania NWD – jest nią algorytm Euklidesa
int NWD(int a, int b) {
    // przypisujemy mniejszą z liczb do i, większa nigdy nie będzie NWD.
    int i = a;
    if (b < i) {
        i = b;
    }
    // Idąc w dół sprawdzamy czy liczba i jest dzielnikiem obu liczb, jeśli jest to mamy odpowiedź.
    while (i >= 2) {
        if (a % i == 0 && b % i == 0) {
            return i;
        }
        i--;
    }
    // Jeśli żadna liczba nie jest NWD to wynik to 1, bo jeden zawsze jest dzielnikiem.
    return 1;
}


int main()
{
    ///
    /// Wczytywanie danych
    ///

    // Definiujemy listę do przechowania danych
    vector<Vector2i> przesuniecia;
    // Otwieramy plik do odczytu
    ifstream plik("dron_przyklad.txt");
    // Sprawdzamy czy otwarcie pliku się powiodło
    if (!plik.is_open()) {
        cout << "blad" << endl;
        return -1;
    }
    // Pętla wykonuje się tak długo jak są dane do odczytania w pliku.
    // !!! Jeśli zapomnieliśmy wczytać dane w środku while będzie się on wykonywał w nieskończoność !!!
    while (!plik.eof()) {
        // Definiujemy zmienne pomocnicze x i y
        int x = INT_MIN;
        int y;
        // Wczytujemy dane z pliku
        plik >> x;
        plik >> y;
        // Pomijamy puste linie
        if (x == INT_MIN) {
            continue;
        }
        // Dodajemy elementy na końcu listy przesunięcia.
        przesuniecia.push_back({ x,y });
    }
    // Zamykamy plik
    plik.close();

    ///
    /// Zadanie 3.1
    ///

    // Definiujemy licznik
    int licznik_zad3_1 = 0;

    // Przechodzimy po wszystkich danych
    for (int i = 0; i < przesuniecia.size(); i++) {
        // Jeśli y jest 0 to sprawdzamy czy x > 1, jeśli tak to zwiększamy licznik, zgodnie z `Uwaga`
        if (abs(przesuniecia[i].y) == 0) {
            if (przesuniecia[i].x > 1) {
                licznik_zad3_1++;
            }
            continue;
        }
        // `Uwaga` dotyczy tylko przypadku gdy y == 0 ale można też sprawdzić dla x == 0,
        // jednak nie powinno być takiej sytuacji w danych do zadania.
        /*
        if (przesuniecia[i].x == 0) {
            if (abs(przesuniecia[i].y) > 1) {
                licznik_zad3_1++;
            }
            continue;
        }*/
        // Jeśli NWD jest większe od 1 to zwiększamy licznik
        if (NWD(przesuniecia[i].x, abs(przesuniecia[i].y)) > 1) {
            licznik_zad3_1++;
        }

    }
    cout << "Zadanie 3.1: " << endl;
    cout << licznik_zad3_1 << endl;


    ///
    /// Zadanie 3.2 a)
    /// W zadaniu potrzebujemy pozycje drona względem punktu (0,0), a nie informacje o przemieszczeniu.
    /// Aby je policzyć, zaczynając od punktu (0,0) dodajemy wszystkie poszczególne przemieszczenia i zapisujemy je do listy.
    ///

    // Definiujemy listę do przechowania pozycji
    vector<Vector2i> pozycje;
    // Definiujemy zmienną do przechowywania pozycji
    Vector2i poz = { 0,0 };
    // Definiujemy licznik
    int licznik_zad3_2 = 0;
    // Przechodzimy po wszystkich przesunięciach
    for (int i = 0; i < przesuniecia.size(); i++) {
        // Dodaj wartości przesunięcia do pozycji, aby dostać pozycje absolutną względem punktu (0,0)
        poz.x = poz.x + przesuniecia[i].x;
        poz.y = poz.y + przesuniecia[i].y;
        // Dodajemy elementy na końcu listy `pozycje`, będą one nam potrzebne do następnego zadania.
        pozycje.push_back(poz);
        // Sprawdzamy czy punkt jest wewnątrz kwadratu o wierzchołkach (0, 0), (0, 5000), (5000, 5000), (5000, 0).
        if ( poz.x>0 && poz.x<5000 && poz.y>0 && poz.y<5000 ) {
            licznik_zad3_2++;
        }
    }

    cout << "Zadanie 3.2 a)" << endl;
    cout << licznik_zad3_2 << endl;

    ///
    /// Zadanie 3.2 b)
    /// W zadaniu potrzeba sprawdzić wszystkie punkty i biorąc po 3 stwierdzić czy są takie że, jeden z nich jest środkiem odcinka o końcach w pozostałych dwóch.
    /// Sprawdzanie wykonujemy poprzez policzenie wektorów AB i BC, po czym sprawdzamy czy są one równe
    ///
    cout << "Zadanie 3.2 b)" << endl;
    bool koniec = false;
    // Przechodzimy po wszystkich punktach
    for (int A_index = 0; A_index < pozycje.size() && !koniec; A_index++) {
        for (int B_index = 0; B_index < pozycje.size() && !koniec; B_index++) {
            // Pomijamy jeśli A_index i B_index to ten sam punkt
            if (A_index == B_index) {
                continue;
            }
            // Definiujemy zmienne pomocnicze
            Vector2i A = pozycje[A_index];
            Vector2i B = pozycje[B_index];
            // Definiujemy Wektor AB i liczymy jego wartości
            Vector2i AB = { B.x - A.x , B.y - A.y };
            for (int C_index = 0; C_index < pozycje.size() && !koniec; C_index++) {
                // Pomijamy jeśli A_index i C_index lub B_index i C_index to ten sam punkt
                if (A_index == C_index || B_index == C_index) {
                    continue;
                }
                // Definiujemy zmienną pomocniczą
                Vector2i C = pozycje[C_index];
                // Definiujemy Wektor BC i liczymy jego wartości
                Vector2i BC = { C.x - B.x ,C.y - B.y };
                // Sprawdzamy czy wektory AB i BC są sobie równe, jeśli tak to wyświetlamy odpowiedź
                if (AB.x == BC.x && AB.y == BC.y) {
                    cout << A.to_string() << ", ";
                    cout << B.to_string() << ", ";
                    cout << C.to_string() << endl;
                    // Kończymy wszystkie pętle ( W tym zadaniu jest dopuszczalne użycie return)
                    koniec = true;
                }
            }
        }
    }
}
```