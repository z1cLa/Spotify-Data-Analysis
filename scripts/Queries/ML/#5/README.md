## Izlistati godine koje po proseku imaju najenergičnije pesme u opadajućem redosledu.

Trend postaje da su pesme sve više energičnije. Ovim upitom hoćemo da vidimo da li je taj proces bio iz godine u godinu sve vidljiviji ili je bilo drugačijih promena po tom pitanju.

### Neoptimizovan upit

Ovaj neoptimizovani MongoDB agregacijski upit analizira energiju pesama po godinama izdavanja albuma. Upit koristi višestruke $lookup operacije za spajanje informacija iz različitih kolekcija, a zatim obrađuje i grupiše podatke kako bi izračunao prosečnu energiju pesama za svaku godinu. Evo kako upit funkcioniše korak po korak:

- $lookup: Pridružuje kolekciju tracks sa audio_features koristeći audio_feature_id, što omogućava pristup detaljima o audio karakteristikama svake pesme.
- $unwind: Razdvaja niz audio_features_info kako bi svaka pesma bila zasebno obrađena sa svojim audio karakteristikama.
- $lookup: Spaja tracks sa r_albums_tracks da bi se identifikovao album kojem svaka pesma pripada.
- $unwind: Razdvaja niz album_tracks, što omogućava dalje spajanje sa informacijama o albumima.
- $lookup: Povezuje album_tracks sa kolekcijom albums koristeći album_id, omogućavajući pristup informacijama o albumima kao što je datum izdanja.
- $unwind: Ponovno razdvaja niz album_info, pripremajući podatke o albumu za dalju obradu.
- $addFields: Dodaje novo polje release_date_as_date konvertujući tekstualni datum izdanja u datumski tip, što olakšava izračunavanje godine izdanja.
- $project: Izdvaja godinu izdanja i vrednost energije iz audio karakteristika, pripremajući podatke za grupisanje.
- $group: Grupiše podatke po godini izdanja, izračunavajući prosečnu energiju pesama za svaku godinu.
- $sort: Sortira rezultate po prosečnoj energiji u opadajućem redosledu, što ističe godine sa najenergičnijim pesmama na vrhu liste.
- $project: Konačno formatiranje izlaza, prikazuje godinu i prosečnu energiju, uklanjajući MongoDB-ov unutrašnji ID.

Upit se izvršavao _**2h:4min:56s**_

### Optimizovan upit

Ova optimizovana verzija MongoDB agregacijskog upita analizira i izračunava prosečnu energiju pesama po godinama izdavanja albuma, koristeći efikasnije metode i strukture podataka. Upit je optimizovan zahvaljujući indeksiranju i smanjenju broja koraka u agregacijskom pipeline-u. Evo kako upit funkcioniše:

- Indeksiranje: Pre početka upita, kreiran je indeks na track_ids u kolekciji albums_with_tracks, što omogućava brže pridruživanje i efikasnije pretraživanje.
- $lookup: Spaja tracks_optimized kolekciju sa albums_with_tracks preko id polja iz pesama i track_ids iz albuma. To omogućava pridobijanje informacija o albumima direktno vezanim za svaku pesmu.
- $unwind: Razdvaja niz album_info kako bi se omogućila dalja obrada pojedinačnih albuma vezanih za svaku pesmu.
- $addFields: Dodaje novo polje release_date_as_date konvertujući tekstualni datum izdavanja u datumski tip. Ovo olakšava izračunavanje godine izdanja za svaku pesmu.
- $project: Izdvaja godinu izdanja i energiju iz audio karakteristika pesama. Ovaj korak priprema podatke za grupisanje po godini izdanja.
- $group: Grupiše podatke po godini izdanja, izračunavajući prosečnu energiju pesama za svaku godinu. To daje pregled energetskog profila muzike po godinama.
- $sort: Sortira rezultate po prosečnoj energiji u opadajućem redosledu, ističući godine sa najvećom prosečnom energijom pesama.
- $project: Konačno formatiranje izlaza, prikazuje godinu i prosečnu energiju, uklanjajući interni MongoDB ID.

Upit se izvršavao _**1min:24s**_

### MetaBase pregled podataka
![MetaBase#5](MetaBase%235.png)
