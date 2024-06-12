
# **Spotify Data Analysis**
Projekat iz predmeta **_Sistemi Baza Podataka_**, koji se bavi analizom podataka o podacima Spotify aplikacije koriscenjem MongoDB NoSQL baze podataka

Autori projekta su [Miljan Lazić](https://github.com/z1cLa) RA212/2020, [Aleksandar Milović](https://github.com/milovicaleksandar001) RA67/2020

### Korišćen je sledeći Data-Set:
###     [![Static Badge](https://img.shields.io/badge/Spotify_Data_Set-006400?logo=spotify&logoColor=white&style=for-the-badge)](https://www.kaggle.com/datasets/maltegrosse/8-m-spotify-tracks-genre-audio-features)
Više o samom Data-Set-u možete saznati na samom [linku](https://www.kaggle.com/datasets/maltegrosse/8-m-spotify-tracks-genre-audio-features) ili u našoj prezentaciji ```resources/SpotifyDataAnalysis.pdf```

# **Upotreba projekta**

Za početak pokrećemo našu skriptu koja sve podatke iz .SQLite prebacuje u MongoDB bazu podataka, pošto je Data-Set veoma obiman odlučili smo da koristimo podatke koji su noviji od 13.05.2017.
Skripta se nalazi ```scripts/data_migration.py``` i pokreće se komandom u terminalu(podaci o Data-Setu moraju da se nalaze takodje u scripts folderu) ```Python data_migration.py``` 


