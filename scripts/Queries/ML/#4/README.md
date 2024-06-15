## Koje su najpopularnije pesme najpopularnijih albuma?

Izvođači često traže najpopularnije pesme sa najpopularnijih albuma kako bi ih najviše promovisali, što pomaže u boljoj promociji albuma i povećanju popularnosti izvođača.
Cilj ovog upita je obezbeđivanje izvođačima te ključne informacije, uključujući ime albuma, prosečnu popularnost pesama na albumu, broj pesama na albumu, i detalje o izvođačima pesama.

### Neoptimizovan upit

Ovaj složeni MongoDB agregacijski upit dizajniran je za identifikaciju najpopularnijih pesama sa top 100 najpopularnijih albuma, uz dodatne informacije o izvođačima i žanrovima. Cilj je pružiti umetnicima ključne informacije koje mogu koristiti za bolju promociju svojih albuma. Evo kako upit funkcioniše:

- $sort: Sortira albume po popularnosti u opadajućem redosledu, čime se osigurava da se analiza vrši na najpopularnijim albumima.
- $limit: Ograničava analizu na prvih 100 najpopularnijih albuma.
- $lookup: Spaja informacije o albumima sa tabelom r_albums_tracks da bi se dobili podaci o pesmama koje pripadaju svakom albumu.
- $unwind: Razdvaja niz album_tracks kako bi se mogla obaviti dalja obrada svake pesme zasebno.
- $lookup: Spaja pesme sa tabelom tracks da bi se dobile dodatne informacije o svakoj pesmi, uključujući popularnost i trajanje.
- $unwind: Ponovno razdvajanje nizova, ovog puta za informacije o pesmama, što omogućava individualnu analizu svake pesme.
- $lookup: Pridružuje pesme sa izvođačima koristeći tabelu r_track_artist.
- $unwind: Razdvaja niz track_artists kako bi se dobili podaci o svakom izvođaču povezanom sa pesmom.
- $lookup: Povezuje izvođače sa njihovim informacijama iz tabele artists.
- $unwind: Razdvaja informacije o izvođačima za dalju obradu.
- $lookup i $unwind: Ove operacije povezuju izvođače sa žanrovima koristeći tabele r_artist_genre i genres, što omogućava dodavanje informacija o žanru za svakog izvođača.
- $group: Grupiše podatke po jedinstvenim identifikatorima albuma i pesama, izračunavajući prosečnu popularnost i broj pesama na albumu, kao i sakupljajući informacije o izvođačima i žanrovima.
- $sort: Sortira pesme unutar svakog albuma po popularnosti da bi se identifikovale najpopularnije.
- $group: Druga grupacija sumira rezultate po albumima, zadržavajući podatke o najpopularnijim pesmama.
- $project: Formira konačni izlazni format koji uključuje ID albuma, ime, prosečnu popularnost, broj pesama i detalje o top 3 najpopularnije pesme.
- $sort: Konačno sortiranje po godini osigurava pravilno redosled albuma u izveštaju.

Upit se izvršavao _**41min:10s**_

### Optimizovan upit

Ova optimizovana verzija MongoDB agregacijskog upita fokusirana je na identifikaciju najpopularnijih pesama sa top 100 najpopularnijih albuma, uz efikasno korišćenje indeksa za poboljšanje performansi. Evo kako upit funkcioniše korak po korak:

- Indeksiranje: Pre pokretanja upita, kreiraju se indeksi na ključnim poljima poput popularity, track_ids, id u različitim kolekcijama. Ovi indeksi omogućavaju brže sortiranje, pridruživanje i pretragu, što značajno ubrzava procesiranje podataka.
- $sort: Sortira albume po popularnosti u opadajućem redosledu, omogućavajući da se fokusira na 100 najpopularnijih.
- $limit: Ograničava skup na prvih 100 albuma kako bi se smanjio obim podataka za dalju obradu.
- $unwind: Razdvaja niz track_ids iz svakog albuma, pripremajući pojedinačne ID-ove pesama za dalje pridruživanje.
- $lookup: Pridružuje track_ids sa tracks_optimized kolekcijom da bi se dobile detaljne informacije o svakoj pesmi.
- $unwind: Razdvaja dobijene informacije o pesmama kako bi se omogućila individualna analiza svake pesme.
- $lookup: Povezuje artist_ids iz pesama sa artists_with_genres kolekcijom, što omogućava pristup podacima o izvođačima i njihovim žanrovima.
- $unwind: Još jednom razdvaja podatke o izvođačima, što pojednostavljuje dalje grupisanje i analizu.
- $group: Prvo grupisanje kombinuje podatke o pesmama i albumima, sakupljajući informacije kao što su ukupna popularnost pesama i broj pesama po albumu.
- $sort: Sortira pesme unutar svakog albuma po ukupnoj popularnosti pesama, čime se ističu najpopularnije.
- $group: Druga grupacija sumira rezultate po albumima, izdvajajući najpopularnije pesme i pružajući prosječne vrednosti popularnosti i broj pesama.
- $project: Formira konačni izlazni format, uključujući detalje o albumu i top 3 pesme.
- $sort: Konačno sortiranje po popularnosti albuma osigurava da su najpopularniji albumi na vrhu liste izlaznih rezultata.

Upit se izvršavao _**0.212s**_

### MetaBase pregled podataka
![MetaBase#4](MetaBase%234.png)
