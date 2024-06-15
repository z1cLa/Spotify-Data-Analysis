## Izlistati jedinstvene izvodjače i njihove najtiše pesme

Izvođači sve više teže ka glasnim pesmama da bi podstakli adrenalin slušaoca.Zanima nas ko najmanje koristi to u svoju korist.

### Neoptimizovan upit

Ovaj MongoDB agregacijski upit dizajniran je da identifikuje top 100 najtiših pesama od jedinstvenih izvođača, s fokusom na to koje su pesme najtiše. Proces uključuje sledeće korake:

- $sort: Pesme se sortiraju po glasnoći u rastućem redosledu, što znači da najtiše pesme dolaze prve.
- $limit: Rezultat se ograničava na prvih 200 najtiših pesama kako bi se osiguralo da se dalje procesuiranje vrši samo na najrelevantnijim zapisima.
- $lookup: Izvršava se pridruživanje sa kolekcijom tracks da bi se povezali audio atributi sa konkretnim pesmama.
- $unwind: Operacija razdvaja dokumente koji sadrže nizove, što omogućava dalju obradu svake pesme posebno.
- $lookup: Pridružuje se sa r_track_artist kako bi se za svaku pesmu pronašli povezani izvođači.
- $unwind: Ponovno razdvajanje nizova, ovog puta za izvođače, kako bi svaki izvođač bio obrađen pojedinačno.
- $lookup: Pridružuje se sa kolekcijom artists da bi se za svaku pesmu dobile informacije o izvođaču.
- $unwind: Još jednom se dokumenti razdvajaju kako bi se omogućilo formiranje grupa po jedinstvenim izvođačima.
- $group: Grupišu se dokumenti po ID-u izvođača, uzimajući prvu (najtišu) pesmu koja je povezana sa svakim izvođačem.
- $sort: Rezultati se ponovo sortiraju po glasnoći da bi se osiguralo da su prikazane najtiše pesme.
- $limit: Ograničava se izlaz na 100 jedinstvenih izvođača sa njihovim najtišim pesmama.
- $project: Formatira se konačni izlaz tako da prikazuje ime izvođača, ID pesme, naziv pesme i glasnoću.

Upit se izvršavao _**31min:50s**_

### Optimizovan upit

Ovaj optimizovani MongoDB agregacijski upit efikasno pronalazi top 100 najtiših pesama od jedinstvenih izvođača, koristeći optimizovane indekse i poboljšanu strukturu kolekcije. Proces obuhvata sledeće korake:

- Indeksiranje: Pre pokretanja upita, kreiraju se indeksi za 'audio_features.loudness', 'artist_ids' u kolekciji tracks_optimized, i 'id' u kolekciji artists_with_genres.
  * Indeks na "audio_features.loudness" u kolekciji tracks_optimized:
    * Cilj: Poboljšava efikasnost sortiranja i filtriranja pesama po glasnoći.
    * Funkcija: Ovaj indeks omogućava brzo lociranje i sortiranje zapisa na osnovu vrednosti glasnoći, što je ključno za odabir najtiših pesama. Efikasno sortiranje smanjuje vreme obrade, posebno u koracima kao što su $sort i $limit.
  * Indeks na "artist_ids" u kolekciji tracks_optimized:
    * Cilj: Omogućava brzu pretragu i grupisanje dokumenata po ID-ovima umetnika.
    * Funkcija: Indeks na "artist_ids" omogućava MongoDB-ju da efikasno locira i pristupi svim zapisima koji sadrže specifične ID-ove umetnika. To je naročito korisno u koracima kao što su $unwind i $group, gde se dokumenti moraju razdvojiti i grupisati na osnovu pojedinačnih umetnika.
  * Indeks na "id" u kolekciji artists_with_genres:
    * Cilj: Ubrzava pridruživanje ($lookup) između kolekcija na osnovu ID-ova umetnika.
    * Primena: Poboljšava brzinu pristupa detaljima umetnika za konačno formatiranje i prezentaciju podataka, čineći $lookup operacije efikasnijim i bržim.
          
- $match: Filtrira se kolekcija tako da se uključe samo zapisi gde polje audio_features.loudness nije null, čime se osigurava da se obradjuju samo zapisi sa definisanom glasnoćom.
- $sort: Sortira zapise po glasnoći u rastućem redosledu, stavljajući najtiše pesme na vrh.
- $limit: Ograničava broj zapisa na prvih 200, kako bi se fokusiralo na najtišije pesme pre dalje obrade.
- $unwind: Razdvaja niz artist_ids, što omogućava individualnu obradu svakog ID-a umetnika povezanog sa pesmom.
- $lookup: Izvršava pridruživanje sa kolekcijom artists_with_genres kako bi se dobili detaljni podaci o umetnicima na osnovu ID-a umetnika.
- $unwind: Ponovo razdvaja nizove, ovog puta za informacije o umetnicima, omogućavajući pristup pojedinačnim detaljima umetnika.
- $group: Grupiše zapise po ID-u umetnika i izdvaja prvu (najtišu) pesmu koja je povezana sa svakim umetnikom. Takođe čuva podatke kao što su ime umetnika, žanrovi, ID i ime pesme, te glasnoća.
- $sort: Ponovo sortira grupisane rezultate po glasnoći, osiguravajući da najtiše pesme ostanu na vrhu liste.
- $limit: Ograničava konačni broj zapisa na 100, čime se obezbeđuje da se u izlaznim podacima nađu samo jedinstveni izvođači sa svojom najtišom pesmom.
- $project: Definiše format izlaznih podataka, uključujući ime umetnika, žanrove, ID pesme, naziv pesme i glasnoću.


Upit se izvršavao _**15.319s**_


### MetaBase pregled podataka
![MetaBase#2](MetaBase%232.png)
