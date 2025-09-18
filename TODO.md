# TODO för bajsr.com

## Initiering
- [x] Skapa nytt Rails 8-projekt
- [x] Lägg till TailwindCSS
- [x] Lägg till en landningssida 
- [x] Lägg till autentisering via rails nya autentisering plattform
- [x] Lägg till Stimulus + Turbo (Hotwire)
- [x] Konfigurera Active Storage för bilduppladdning
- [x] Lägg till stöd för Google maps
- [x] Sätt upp PWA (manifest.json + service worker)

## Funktionalitet
- [x] Modell: User
- [x] Modell: Pin (plats, kommentar, betyg, bild, tillhör user)
- [x] Modell: Group (namn)
- [x] Modell: Membership (user_id, group_id)
- [x] Relation: User has_many :pins, has_many :groups, through: :memberships
- [x] CRUD: Pins
- [x] Visa pins på karta
- [x] Visa pins i lista (senaste först)
- [x] Skapa grupper
- [x] Bjud in användare till grupp (via e-post)
- [x] Visa gruppens pins (filtrering)

## PWA
- [x] Skapa manifest.json
- [x] Lägg till service worker
- [ ] Testa offline-stöd

## UI
- [x] Responsiv design med TailwindCSS
- [x] Enkelt gränssnitt för att lägga till pin
- [x] Karta med pins + popup
- [x] Lista med senaste registreringarna
- [x] Gruppvy med medlemmar och pins

## Deployment
- [ ] Sätt upp miljövariabler
- [ ] Sätt upp domän: bajsr.com