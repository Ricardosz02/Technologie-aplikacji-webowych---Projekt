# Technologie aplikacji webowych - Projekt

Aplikacja blogowa z profilami użytkowników, systemem komentarzy, paginacją, walidacją formularzy i systemem polubień.

## Wymagania

- Node.js (v18+)
- MongoDB
- Git

## Uruchomienie aplikacji

### 1. Klonowanie repozytorium
```bash
https://github.com/Ricardosz02/Technologie-aplikacji-webowych---Projekt.git
cd Technologie-aplikacji-webowych---Projekt
```

### 2. Backend (Node.js + Express)
```bash
cd server
npm install
npm start
```
Serwer dostępny pod: **http://localhost:3000**

### 3. Frontend (Angular)
W **nowym terminalu**:
```bash
cd blog
npm install
npm start
```
Aplikacja dostępna pod: **http://localhost:4200**

## Zaimplementowane funkcjonalności

1. **Profil użytkownika**
   - Wyświetlanie danych: nazwa użytkownika, email, data rejestracji, liczba opublikowanych postów, lista postów użytkownika.
   - Możliwość edycji danych profilowych.

2. **System komentarzy**
   - Formularz dodawania komentarza pod postem.
   - Wyświetlanie listy komentarzy z autorem i datą.
   - Możliwość usuwania własnych komentarzy.
   - **Dodatkowo**: Automatyczne wykrywanie linków w komentarzach (przekierowanie po kliknięciu).

3. **Paginacja postów**
   - Paginacja listy postów (np. 5 na stronę).
   - Przyciski nawigacji między stronami.
   - Informacja o aktualnej stronie i łącznej liczbie stron.
   - Obsługa parametrów query w URL (`?page=1&limit=5`).

4. **Walidacja formularzy (Reactive Forms)**
   - Walidacja wymaganych pól.
   - Walidacja formatu email.
   - Minimalna długość hasła.
   - Wyświetlanie komunikatów błędów przy polach.
   - Blokada przycisku submit, gdy formularz jest niepoprawny.

5. **System polubień (like/unlike)**
   - Przycisk like/unlike przy każdym poście.
   - Licznik polubień.
   - Blokada wielokrotnego polubienia przez jednego użytkownika.
   - Wizualne oznaczenie polubionych postów.

6. **Dodatkowe funkcjonalności**
   - **Licznik wyświetleń**: Zliczanie odwiedzin posta.
   - **Zmieniony wygląd Navbar**: Dostosowany interfejs nawigacyjny.
