# 📖 Book Tracker App

Book Tracker App je mobilna aplikacija koja omogućuje korisnicima praćenje pročitanih knjiga, ostavljanje recenzija i dodavanje novih knjiga u osobnu biblioteku.

## 🚀 Tehnologije

- **Frontend**: React Native + Expo
- **Backend**: Firebase (Authentication, Firestore)
- **Storage**: Supabase (za pohranu slika i podataka)

## 📌 Ključne značajke

✔️ Dodavanje knjiga u bazu  
✔️ Evidencija pročitanih knjiga  
✔️ Ostavljanje recenzija i ocjena  
✔️ Autentifikacija korisnika putem Firebasea  
✔️ Pohrana podataka i slika putem Supabasea  
✔️ Pronalazak knjižnica u bizini


## ⚙️ Pokretanje projekta

1. Kloniraj repozitorij:
   ```sh
   git clone https://github.com/kantonija/Book-tracker-app.git
   cd Book-tracker-app
    ```

2. Instaliraj potrebne pakete:
    ```sh
    npm install
    ```
3. Pokreni Expo server:
    ```sh
    npx expo start
    ```

## 🔧 Konfiguracija

Prije pokretanja aplikacije, potrebno je postaviti .env datoteku s odgovarajućim API ključevima za **Firebase** i **Supabase**.

```env
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

