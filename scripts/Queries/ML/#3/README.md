## Koji albumi u proseku imaju najduže pesme po svakoj godini?

Sve je veći trend da su pesme sve kraće što iželjkuje manje truda u pisanju samog teksta. Ovim upitom dolazimo do zaključka na kojim albumima je uloženo najviše truda za tekst i muziku.

### Neoptimizovan upit

Ovaj neoptimizovani MongoDB agregacijski upit je dizajniran da analizira pesme po albumima i izračunava prosečno trajanje pesama za svaki album, grupišući rezultate po godini izdanja albuma. Ovde su ključni koraci u procesu:

- $lookup: Prvi $lookup se koristi za pridruživanje informacija iz kolekcije r_albums_tracks sa kolekcijom tracks, čime se za svaku pesmu dobijaju podaci o pripadnosti albumu.
- $unwind: Razdvaja niz album_tracks kako bi se omogućila individualna obrada svakog zapisa iz niza.
- $lookup: Drugi $lookup povezuje album_tracks sa kolekcijom albums, što omogućava pristup dodatnim informacijama o albumima, kao što su naziv i datum izdavanja.
- $unwind: Ponovno razdvajanje, ovog puta niza album_info, omogućava dalju individualnu obradu svakog albuma.
- $addFields: Dodaje novo polje release_date_as_date, koje pretvara tekstualni datum izdavanja albuma u datumski format.
- $project: Projektuje godinu izdavanja albuma, ID albuma, naziv albuma i trajanje pesama, pripremajući podatke za naredne korake.
- $group: Prva grupacija kreira grupu po godini, ID-u albuma i nazivu albuma, izračunavajući prosečno trajanje pesama unutar svakog albuma.
- $sort: Sortira rezultate prvo po godini izdavanja (rastuće), a zatim po prosečnom trajanju pesama (opadajuće).
- $group: Druga grupacija sumira rezultate po godini, čuvajući samo album sa najdužim prosečnim trajanjem pesama za svaku godinu.
- $project: Finalno projektovanje za pripremu konačnog izlaza, uklanjajući interno korišćene identifikatore i pripremajući čistu strukturu podataka.
- $sort: Konačno sortiranje po godini izdavanja, osiguravajući da su godine listane u hronološkom redosledu.

Upit se izvršavao _**1h:23min:15s**_

### Optimizovan upit

Ovaj optimizovani MongoDB agregacijski upit efikasno analizira pesme po albumima i izračunava prosečno trajanje pesama za svaki album, grupišući rezultate po godini izdanja albuma. Ključna optimizacija uključuje upotrebu indeksa i efikasnije strukturiranje upita. Evo kako upit funkcioniše:

- Indeksiranje: Pre početka, kreiran je indeks na track_ids u kolekciji albums_with_tracks, što poboljšava performanse prilikom pretrage i spajanja podataka.
- $lookup: Ovaj korak povezuje pesme iz kolekcije tracks_optimized sa njihovim albumima u kolekciji albums_with_tracks korišćenjem polja id i track_ids. Rezultat se čuva u polju album_info.
- $unwind: Razdvaja niz album_info kako bi se svaki zapis obradio pojedinačno, čime se priprema teren za dalju obradu.
- $addFields: Dodaje novo polje release_date_as_date, konvertujući tekstualni datum izdavanja albuma u datumski format, što olakšava dalje izračunavanje po datumima.
- $project: Izdvaja neophodne podatke za dalju analizu: godinu izdanja, ID albuma, naziv albuma i trajanje pesme.
- $group: Grupiše pesme po godini izdanja, ID-u albuma i nazivu albuma, izračunavajući prosečno trajanje pesama unutar svakog albuma.
- $sort: Sortira rezultate prvo po godini izdanja (rastuće) a zatim po prosečnom trajanju pesama (opadajuće).
- $group: Druga grupacija agregira podatke po godinama, čuvajući samo najduži prosečni album za svaku godinu.
- $project: Formatira izlazne podatke za prikaz, uklanjajući interni identifikator i pripremajući čistu strukturu podataka.
- $sort: Finalno sortiranje po godinama, osigurava da su podaci listani hronološki.

Upit se izvršavao _**1min:28s**_


### MetaBase pregled podataka
![MetaBase#3.1](MetaBase%233.1.png)

![MetaBase#3.2](MetaBase%233.2.png)
