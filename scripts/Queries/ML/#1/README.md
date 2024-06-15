## Naći izvodjače koji su najviše pesama snimali u studiju, takodje prikazati i koliko pesama nije snimio u studiju i odnos studio/van studija.

Umetnici zbog napretka tehnologije sve više biraju da snimaju u studiju. Pomoću ovog upita dobijamo informaciju koji umetnici su najskoliniji tome.

### Neoptimizovan upit

Ovaj MongoDB agregacijski pipeline analizira audio_features tako što ih povezuje sa umetnicima i kategorizuje ih u studijske i nestudijske, na osnovu karakteristike "liveness". Po Spotify kompaniji pesma je snimana u studiu ukoliko je njen "liveness" u opsegu izmedju 0 i 0.2. 

Pipeline proces obuhvata sledeće korake:

- $lookup - Spaja audio_features sa informacijama o umetnicima.
- $unwind - Razdvaja nizove umetnika tako da svaki umetnik iz niza postaje zaseban dokument.
- $group - Grupiše zapise po umetnicima i određuje da li su pesme studijske ili nestudijske, zatim računa ukupan broj pesama po kategorijama.
- $lookup - Ponovo povezuje umetnike sa dodatnim informacijama iz kolekcije umetnika.
- $project - Izračunava odnos studijskih prema nestudijskim pesmama i prilagođava izlazne podatke.
- $sort - Sortira rezultate po broju studijskih pesama.

Upit se izvršavao _**32min:35s**_


### Optimizovan upit

Ovaj optimizovani MongoDB agregacijski pipeline analizira muzičke zapise povezujući ih sa umetnicima i kategorizuje ih kao studijske ili nestudijske na osnovu vrednosti "liveness". Proces uključuje sledeće korake:

- Indeksiranje - Kreiranje indeksa za brže pretrage po artist_ids i id.
  * Indeks na artist_ids u kolekciji tracks_optimized:
    * Cilj: Omogućava brzu pretragu i grupisanje dokumenata po ID-ovima umetnika.
    * Funkcija: Indeks na artist_ids omogućava MongoDB-ju da efikasno locira i pristupi svim zapisima koji sadrže specifične ID-ove umetnika. To je naročito korisno u koracima kao što su $unwind i $group, gde se dokumenti moraju razdvojiti i grupisati na osnovu pojedinačnih umetnika.

  * Indeks na id u kolekciji artists_with_genres:
    * Cilj: Ubrzava pridruživanje ($lookup) između kolekcija na osnovu ID-ova umetnika.
    * Primena: Poboljšava brzinu pristupa detaljima umetnika za konačno formatiranje i prezentaciju podataka.
    
- $unwind - Razdvaja niz artist_ids kako bi svaki umetnik bio obrađen zasebno.
- $group - Grupiše zapise po umetniku i kategoriji (studijski/nestudijski), zatim računa ukupan broj zapisa za svaku kategoriju.
- $lookup - Pridružuje informacije o umetnicima iz druge kolekcije da bi se dobili dodatni podaci kao što su ime i žanrovi.
- $project - Formatira konačne izlazne podatke uključujući ID umetnika, ime, broj studijskih i nestudijskih zapisa, te njihov odnos.
- $sort - Sortira umetnike prema broju studijskih zapisa u opadajućem redosledu.

Upit se izvršavao _**15.319s**_

### MetaBase pregled podataka
![MetaBase#1](scripts/Queries/ML/#1/MetaBase#1.png)

