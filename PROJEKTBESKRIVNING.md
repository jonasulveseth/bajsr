# Projektbeskrivning: bajsr.com

**Syfte:**  
bajsr.com är en social app där användare kan markera platser i naturen där de bajsat. Varje plats (pin) kan få en bild, betyg och kommentar. Användarna kan skapa grupper för att dela pins med vänner, och alla registreringar visas på karta samt i en lista. Appen ska även fungera som en PWA (Progressive Web App) och ha autentisering.

**Teknikstack:**  
- Backend: Ruby on Rails 8  
- Frontend: Hotwire (Turbo/Stimulus), TailwindCSS  
- Databas: PostgreSQL  
- Autentisering: Devise  
- Karttjänst: Mapbox eller Leaflet  
- Bilduppladdning: Active Storage  
- PWA: Service Worker + manifest.json  
- Deployment: Fly.io eller Render  

**Funktioner:**  
1. Användarregistrering och inloggning  
2. Skapa en pin (plats + bild + betyg + kommentar)  
3. Visa alla pins på en karta  
4. Visa senaste pins i en lista  
5. Skapa grupper och bjuda in vänner  
6. Se gruppens pins på karta/lista  
7. Fungerar offline (PWA)